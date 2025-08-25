import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authAdmin } from "../../../firebaseAdmin";

export const verifySession = cache(async () => {
  const headersList = await headers();
  const idToken = headersList.get("authorization")?.split("Bearer ")[1];

  if (!idToken) {
    redirect("/login");
  }

  let uid;
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    uid = decodedToken.uid;
  } catch {
    redirect("/login");
  }

  return { isAuth: true, uid };
});
