import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { geminiFlash, hasValidGeminiKey } from "@/lib/ai/client";
import {
  GENERAL_CAREER_SYSTEM_PROMPT,
  PERSONALIZED_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getOrCreateDbUser } from "@/lib/auth-sync";
import { getLocalAiResponse } from "@/lib/ai/localAiEngine";

async function buildSystemPrompt(userId?: string): Promise<string> {
  if (!userId) return GENERAL_CAREER_SYSTEM_PROMPT;

  try {
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
  } catch {
    return GENERAL_CAREER_SYSTEM_PROMPT;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body;
    const lastMsg = messages?.[messages.length - 1];
    const userQuery = lastMsg?.content ?? "";

    // 1. Try to get authenticated user (optional for guest chat)
    let dbUser: any = null;
    let mode: "general" | "personalized" = "general";

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        dbUser = await getOrCreateDbUser(user);

        // Check token limit for FREE users
        if (
          dbUser.subscriptionTier === "FREE" &&
          dbUser.aiTokensUsed >= dbUser.aiTokensLimit
        ) {
          return NextResponse.json(
            { error: "AI token limit reached. Upgrade to Premium for unlimited chats." },
            { status: 403 }
          );
        }

        const hasAssessment =
          (await prisma.assessment.count({ where: { userId: dbUser.id } })) > 0;
        if (hasAssessment) mode = "personalized";
      }
    } catch (authErr) {
      // Guest or offline mode
    }

    // 2. Build system prompt
    const systemPrompt = await buildSystemPrompt(dbUser?.id);

    // 3. Fallback / Local AI Engine if no valid Gemini API key
    if (!hasValidGeminiKey) {
      const localResponse = getLocalAiResponse(userQuery, { mode });

      // Save messages to DB if logged in
      if (dbUser) {
        try {
          let session = sessionId
            ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
            : null;
          if (!session) {
            session = await prisma.chatSession.create({
              data: { userId: dbUser.id, mode },
            });
          }

          await prisma.chatMessage.create({
            data: { sessionId: session.id, role: "user", content: userQuery },
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
        } catch {
          // DB error fallback
        }
      }

      return NextResponse.json({
        role: "assistant",
        content: localResponse,
        sessionId: sessionId ?? "session_demo",
        mode,
      });
    }

    // 4. Gemini AI Streaming with Automatic Fallback
    try {
      const result = streamText({
        model: geminiFlash,
        system: systemPrompt,
        messages,
        onFinish: async ({ text }) => {
          if (dbUser) {
            try {
              let session = sessionId
                ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
                : null;
              if (!session) {
                session = await prisma.chatSession.create({
                  data: { userId: dbUser.id, mode },
                });
              }

              await prisma.chatMessage.createMany({
                data: [
                  { sessionId: session.id, role: "user", content: userQuery },
                  { sessionId: session.id, role: "assistant", content: text },
                ],
              });

              await prisma.user.update({
                where: { id: dbUser.id },
                data: { aiTokensUsed: { increment: 1 } },
              });
            } catch {
              // Ignore DB sync error in onFinish
            }
          }
        },
      });

      return result.toTextStreamResponse({
        headers: {
          "x-session-id": sessionId ?? "session_live",
          "x-mode": mode,
        },
      });
    } catch (aiErr: any) {
      console.warn("[chat:gemini_fallback]", aiErr?.message);
      // Fallback to local AI engine on any Gemini exception
      const localResponse = getLocalAiResponse(userQuery, { mode });
      return NextResponse.json({
        role: "assistant",
        content: localResponse,
        sessionId: sessionId ?? "session_fallback",
        mode,
      });
    }
  } catch (error: any) {
    console.error("[chat]", error);
    // Even on server failure, return an informative AI answer
    const fallbackResponse = getLocalAiResponse("career guidance");
    return NextResponse.json({
      role: "assistant",
      content: fallbackResponse,
    });
  }
}
