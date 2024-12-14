"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

import Image from "next/image";

export default function Home() {
  const { user, error, isLoading } = useUser();

  console.log("user", user);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
      {/* {user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )} */}
    </>
  );
}
