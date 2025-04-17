"use client";
import { useStripe } from "@/app/hooks/useStripe";
import test from "node:test";

export default function Pagamentos() {
  const {
    createPaymentStripeChekout,
    createSubscripitionStripeChekout,
    handleCreateStripePortal,
  } = useStripe();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Pagamentos</h1>
      <p className="mt-4 text-lg mb-10">Gerencie seus pagamentos aqui.</p>
      <button
        className="border rounded-md px-1 mb-2.5"
        onClick={() =>
          createPaymentStripeChekout({
            testeId: "123",
          })
        }
      >
        Criar Pagamento Stripe
      </button>
      <button
        className="border rounded-md px-1 mb-2.5"
        onClick={() =>
          createSubscripitionStripeChekout({
            testeId: "123",
          })
        }
      >
        Criar Portal de Pagamentos
      </button>
      <button
        className="border rounded-md px-1 mb-2.5"
        onClick={handleCreateStripePortal}
      >
        Criar Portal de Assinatura
      </button>
    </div>
  );
}
