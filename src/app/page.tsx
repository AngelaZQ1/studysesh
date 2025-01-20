"use client";
import { default as LogIn } from "./login/page";
import { default as Dashboard } from "./dashboard/page";
import useUserContext from "./_hooks/useUserContext";

export default function Home() {
  const { firebaseUser } = useUserContext();

  return firebaseUser ? <Dashboard /> : <LogIn />;
}
