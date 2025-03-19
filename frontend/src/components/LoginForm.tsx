"use client";
import { useState } from "react";
import LogoBig from "./LogoBig";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconGoogle } from "./Icons";
import { AlertBox } from "./Alert";
export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrors([result.error]); // Handle sign-in errors from NextAuth
    } else {
      router.push("/"); // Redirect after successful sign-in
      router.refresh(); // Refresh the page to show the user as signed in
    }
  };

  return (
    <div className="flex items-center justify-center mt-8   ">
      <form className="max-w-md mx-auto space-y-6 " onSubmit={handleSubmit}>
        <LogoBig />
        <div className="text-center text-xl">Sign in to your account</div>

        <button
          type="button"
          className="btn text-white w-full bg-red-500 hover:bg-red-600  "
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <IconGoogle fill="white" />
          Sign in with Google
        </button>
        <div className="flex w-full flex-col border-opacity-50">
          <div className="divider">OR</div>
        </div>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="Email"
            name="email"
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            placeholder="Password"
            name="password"
            required
          />
        </label>
        {errors.map((error) => (
          <AlertBox key={error} message={error} />
        ))}
        <button className="btn btn-primary w-full">Sign in</button>
        <div className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="link">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
