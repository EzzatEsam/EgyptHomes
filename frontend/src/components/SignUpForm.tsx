"use client";
import LogoBig from "@/components/LogoBig";
import { RegisterRequest } from "@/types/RegisterRequest";
import { SignUpAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconGoogle } from "./Icons";
import { AlertBox } from "./Alert";

export default function SignUpForm() {
  const { register, watch } = useForm();
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("wtf");
    const request: RegisterRequest = {
      //   username: event.currentTarget.userName.value,
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
      firstName: event.currentTarget.firstName.value,
      lastName: event.currentTarget.lastName.value,
      phoneNumber: event.currentTarget.phone.value,
    };
    const result = await SignUpAction(request);
    if (!result.success) {
      setErrors(result.errors!);
      return;
    } else {
      router.push("/login");
    }
  };
  return (
    <div className="flex items-center justify-center mt-8">
      <form className="max-w-md mx-auto space-y-4 " onSubmit={onFormSubmit}>
        <LogoBig />
        <div className="text-center text-xl">Create new account</div>
        <button
          type="button"
          className="btn text-white w-full bg-red-500 hover:bg-red-600  "
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <IconGoogle fill="white" />
          Sign up with Google
        </button>
        <div className="flex w-full flex-col border-opacity-50">
          <div className="divider">OR</div>
        </div>
        <div className="flex flex-row space-x-4">
          <label className="input input-bordered flex items-center gap-2">
            <input
              required
              type="text"
              className="grow"
              name="firstName"
              placeholder="First Name"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              required
              type="text"
              className="grow"
              name="lastName"
              placeholder="Last Name"
            />
          </label>
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
            required
            type="email"
            className="grow"
            placeholder="Email"
            name="email"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M3 2a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V2zm6 11a1 1 0 10-2 0 1 1 0 002 0z" />
          </svg>
          <input
            required
            type="tel"
            className="grow"
            placeholder="Phone Number"
            name="phone"
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
            required
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
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
            required
            type="password"
            className="grow"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value: string) => {
                const password = watch("password"); // watch the password field
                if (password !== value) {
                  return "Passwords do not match";
                }
                return true; // if validation passes
              },
            })}
          />
        </label>
        {errors.map((error) => (
          <AlertBox key={error} message={error}></AlertBox>
        ))}
        <button className="btn btn-primary w-full">Sign up</button>
        <div className="text-center">
          Already have an account?{" "}
          <a href="/login" className="link">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}
