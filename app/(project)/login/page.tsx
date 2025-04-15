import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen mb-10">
      <h1 className="text-4x1 font-bold mb-10">Login</h1>
      <form action={handleAuth}>
        <button
          type="submit"
          className="border boder-rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        >
          Signin with Google
        </button>
      </form>
    </div>
  );
}
