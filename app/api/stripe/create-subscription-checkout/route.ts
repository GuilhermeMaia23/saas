import stripe from "@/app/lib/stripe";
import { getOrCreateCustomerId } from "@/app/server/stripe/get-customer-id";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testeId } = await req.json();
  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  if (!price) {
    return new Response("Price not found", { status: 500 });
  }
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId || !userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }

  const metadata = {
    testeId,
    price,
  };

  const customerId = await getOrCreateCustomerId(userId, userEmail);
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin")}/sucsess`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata,
      customer: customerId,
    });

    if (!session.url) {
      return NextResponse.json("Session not found", { status: 500 });
    }
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
