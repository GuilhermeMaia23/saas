import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!
      );
      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStripeChekout(checkoutData: any) {
    if (!stripe) return;
    try {
      const response = await fetch("/api/stripe/create-pay-checkout", {
        method: "POST",
        body: JSON.stringify(checkoutData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }

  async function createSubscripitionStripeChekout(checkoutData: any) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-subs-checkout", {
        method: "POST",
        body: JSON.stringify(checkoutData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }

  async function handleCreateStripePortal() {
    const response = await fetch("/api/stripe/create-portal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    window.location.href = data.url;
  }

  return {
    createPaymentStripeChekout,
    createSubscripitionStripeChekout,
    handleCreateStripePortal,
  };
}
