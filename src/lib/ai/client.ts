import { createGoogleGenerativeAI } from "@ai-sdk/google";

// ─── Gemini Client ────────────────────────────────────────────────────────────
// Checks both GOOGLE_GENERATIVE_AI_API_KEY and GEMINI_API_KEY
const rawKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  "";

// Valid Google AI Studio Gemini keys start with "AIzaSy" and are typically ~39 chars.
export const hasValidGeminiKey = Boolean(
  rawKey &&
  rawKey.trim().length > 20 &&
  !rawKey.startsWith("AQ.") &&
  rawKey !== "your_gemini_api_key_here"
);

const google = createGoogleGenerativeAI({
  apiKey: rawKey,
});

export const geminiFlash = google("gemini-2.0-flash");

export { google };

