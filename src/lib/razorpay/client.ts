import Razorpay from "razorpay";

// ─── Razorpay Client ──────────────────────────────────────────────────────────
// Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local to activate payments
// Use test keys ONLY: rzp_test_...

let razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local"
    );
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpay;
}
