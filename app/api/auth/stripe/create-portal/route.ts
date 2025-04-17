import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return new Response("User not found", { status: 404 });
    }

    const customerId = userDoc.data()?.stripeCustomerId;

    if (!customerId) {
      return new Response("Customer not found", { status: 404 });
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get("origin")}/account`,
    });

    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
