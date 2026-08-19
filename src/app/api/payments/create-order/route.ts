import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getRazorpay } from "@/lib/razorpay/client";

// POST /api/payments/create-order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured. Add Razorpay test keys to .env.local." },
        { status: 503 }
      );
    }

    const razorpay = getRazorpay();

    // Premium plan: ₹999/month (99900 paise)
    const order = await razorpay.orders.create({
      amount: 99900,
      currency: "INR",
      receipt: `premium_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan: "premium",
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error: any) {
    console.error("[payments/create-order]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
