import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">AntiGravity</span>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by logging in or creating an account.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/login"
            className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-gray-50"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
