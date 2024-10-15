import SignUpForm from "@/components/SignUpForm";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getAuth();
  if (session) {
    redirect("/");
  }
  return (
    <>
      <SignUpForm />
    </>
  );
}
