import { createGoogleGenerativeAI } from "@ai-sdk/google";

// ─── Gemini Client ────────────────────────────────────────────────────────────
// Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local to activate AI features

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

export const geminiFlash = google("gemini-2.0-flash");

export { google };
