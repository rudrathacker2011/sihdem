import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { geminiFlash } from "@/lib/ai/client";
import {
  GENERAL_CAREER_SYSTEM_PROMPT,
  PERSONALIZED_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getOrCreateDbUser } from "@/lib/auth-sync";
import { getLocalAiResponse } from "@/lib/ai/localAiEngine";

async function buildSystemPrompt(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { careerPaths: true },
      },
    },
  });

  if (!user || user.assessments.length === 0) {
    return GENERAL_CAREER_SYSTEM_PROMPT;
  }

  const latest = user.assessments[0];
  const paths = latest.careerPaths.map((c) => c.title).join(", ");

  return PERSONALIZED_SYSTEM_PROMPT
    .replace("{{stream}}", latest.stream ?? "not specified")
    .replace("{{careerPaths}}", paths)
    .replace("{{goals}}", latest.goals ?? "not specified");
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, sessionId } = body;

    // Get or create DB user (links seeded users by email automatically)
    const dbUser = await getOrCreateDbUser(user);

    // Check token limit for FREE users
    if (dbUser.subscriptionTier === "FREE" && dbUser.aiTokensUsed >= dbUser.aiTokensLimit) {
      return NextResponse.json(
        { error: "AI token limit reached. Upgrade to Premium for unlimited chats." },
        { status: 403 }
      );
    }

    // Determine mode and build system prompt
    const hasAssessment = (await prisma.assessment.count({ where: { userId: dbUser.id } })) > 0;
    const mode = hasAssessment ? "personalized" : "general";
    const systemPrompt = await buildSystemPrompt(dbUser.id);

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId: dbUser.id, mode },
      });
    }

    // Check if API key is available or fallback to local AI engine
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const lastMsg = messages[messages.length - 1];
      const localResponse = getLocalAiResponse(lastMsg?.content ?? "", { mode });

      // Save messages to DB
      await prisma.chatMessage.create({
        data: { sessionId: session.id, role: "user", content: lastMsg.content },
      });
      await prisma.chatMessage.create({
        data: { sessionId: session.id, role: "assistant", content: localResponse },
      });

      return NextResponse.json({
        role: "assistant",
        content: localResponse,
        sessionId: session.id,
        mode,
      });
    }


    // Real streaming response
    const result = streamText({
      model: geminiFlash,
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        // Save messages
        const lastMsg = messages[messages.length - 1];
        await prisma.chatMessage.createMany({
          data: [
            { sessionId: session!.id, role: "user", content: lastMsg.content },
            { sessionId: session!.id, role: "assistant", content: text },
          ],
        });
        // Increment token usage
        await prisma.user.update({
          where: { id: dbUser!.id },
          data: { aiTokensUsed: { increment: 1 } },
        });
      },
    });

    return result.toTextStreamResponse({
      headers: {
        "x-session-id": session.id,
        "x-mode": mode,
      },
    });
  } catch (error: any) {
    console.error("[chat]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
