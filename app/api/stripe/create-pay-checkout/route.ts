import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json(); //pegando o body da requisição

  const price = process.env.STRIPE_PRODUCT_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 });
  }

  const metadata = {
    testeId: testeId,
  };
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/`,
      ...(userEmail && { customer_email: userEmail }),
      metadata,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session Url not found" },
        { status: 500 }
      );
    }
    // Redirect to checkout session URL
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
