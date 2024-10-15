import LoginForm from "@/components/LoginForm";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function SignUpPage() {
  const session = await getAuth();
  if (session) {
    redirect("/");
  }
  return (
    <>
      <LoginForm />
    </>
  );
}

export default SignUpPage;
