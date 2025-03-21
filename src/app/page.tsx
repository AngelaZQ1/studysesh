"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserContext from "./_hooks/useUserContext";

export default function Home() {
  const { firebaseUser } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (firebaseUser) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [firebaseUser, router]);

  return null;
}
