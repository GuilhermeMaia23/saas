import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // estamos no lado do servidor
  const sessions = await auth();
  console.log("sessions", sessions);
  if (!sessions?.user) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>
      <p className="mt-4 text-lg mb-10">Welcome to your dashboard!</p>
      <p>
        Email do usuário:
        {sessions?.user?.email
          ? sessions?.user?.email
          : "Usuário não encontrado"}
      </p>
      {sessions?.user?.image && (
        <form action={handleAuth}>
          <button
            type="submit"
            className="border boder-rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer mt-10"
          >
            Log Out
          </button>
        </form>
      )}
      <Link href="/pagamentos">
        <button className="border rounded-md px-1 mt-10">
          Realize seu Pagamento.
        </button>
      </Link>
    </div>
  );
}
