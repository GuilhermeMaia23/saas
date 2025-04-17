import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";
import { handleStripePayment } from "@/app/server/stripe/handleStripePayment";
import { handleStripeSubscription } from "@/app/server/stripe/handleStripeSubscription";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handleStripeCancelSubscription";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !secret) {
      return NextResponse.json(
        { erro: "Missing signature or secret" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;
        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }
        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }
        // Handle the event when the checkout session is completed
        break;
      case "checkout.session.expired":
        console.log("Session expired", event.data.object);
        // Handle the event when the subscription is updated
        break;
      case "checkout.session.async_payment_succeeded":
        console.log("Async payment succeeded", event.data.object);
        // boleto pago
        break;
      case "checkout.session.async_payment_failed":
        console.log("Async payment failed", event.data.object);
        // boleto falhou
        break;
      case "customer.subscription.created":
        console.log("Subscription created", event.data.object);
        // Handle the event when the subscription is created
        break;
      case "customer.subscription.updated":
        console.log("Subscription updated", event.data.object);
        // Handle the event when the subscription is updated
        break;
      case "customer.subscription.deleted":
        await handleStripeCancelSubscription(event);
        // Handle the event when the subscription is deleted
        break;
    }
  } catch (erro) {
    console.log("Error", erro);
    return NextResponse.json({ erro: "Webhook error" }, { status: 400 });
  }
}
