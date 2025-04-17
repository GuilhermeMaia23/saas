import "server-only";
import Stripe from "stripe";

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === "paid") {
    console.log("Payment succeeded", event.data.object);
    // Aqui você pode adicionar lógica para atualizar o status do pagamento no seu banco de dados
  }
}
