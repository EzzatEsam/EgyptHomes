"use client";
import { logoutAction } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function LogoutHandler() {
  const router = useRouter();

  useEffect(() => {
    logout();
  }, []);

  async function logout() {
    await logoutAction();
    await signOut({
      redirect: false,
    });
    router.push("/login");
  }

  return <></>;
}
