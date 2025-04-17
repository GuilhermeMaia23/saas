import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json();

  const price = process.env.STRIPE_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price not foumd" }, { status: 500 });
  }

  const metadata = {
    testeId: testeId,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      payment_method_types: ["card", "boleto"],
      success_url: `${req.headers.get("origins")}/success`,
      cancel_url: `${req.headers.get("origins")}/`,
      ...(userEmail && { customer_email: userEmail }),
      metadata,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
