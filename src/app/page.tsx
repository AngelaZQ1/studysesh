"use client";
import { useEffect } from "react";
import useSesh from "./_hooks/useSesh";
import useUserContext from "./_hooks/useUserContext";
import { Sesh } from "./_types/types";
import { default as Dashboard } from "./dashboard/page";
import { default as LogIn } from "./login/page";
import { pusherClient } from "./pusher";

export default function Home() {
  const { firebaseUser, user } = useUserContext();
  const { seshes, fetchSeshes } = useSesh();

  useEffect(() => {
    pusherClient.subscribe("public");

    pusherClient.bind("new-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        fetchSeshes();
      }
    });

    return () => {
      pusherClient.unsubscribe("public");
    };
  }, []);

  return firebaseUser ? (
    <Dashboard seshes={seshes} fetchSeshes={fetchSeshes} />
  ) : (
    <LogIn />
  );
}
