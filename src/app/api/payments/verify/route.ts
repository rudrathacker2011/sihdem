import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// POST /api/payments/verify — HMAC signature verification (server-side only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment gateway not configured." }, { status: 503 });
    }

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Get or create DB user
    let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { supabaseId: user.id, email: user.email! },
      });
    }

    // Record payment and upgrade to Premium
    await prisma.payment.create({
      data: {
        userId: dbUser.id,
        razorpayOrderId,
        amount: 99900,
        currency: "INR",
        status: "paid",
      },
    });

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { subscriptionTier: "PREMIUM" },
    });

    return NextResponse.json({ success: true, tier: "PREMIUM" });
  } catch (error: any) {
    console.error("[payments/verify]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
