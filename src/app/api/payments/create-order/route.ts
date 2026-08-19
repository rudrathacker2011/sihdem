import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getRazorpay } from "@/lib/razorpay/client";

// POST /api/payments/create-order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // If Razorpay is not configured, support seamless Demo/Test Mode
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        isDemo: true,
        orderId: `demo_order_${user.id}_${Date.now()}`,
        amount: 99900,
        currency: "INR",
        message: "Running in Demo Simulation Mode",
      });
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

    return NextResponse.json({
      isDemo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("[payments/create-order]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
