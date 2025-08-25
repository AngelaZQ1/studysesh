import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

// GET /api/user/uid/[uid]
// Gets the user with the given Firebase uid
export async function GET(request: Request) {
  const uid = request.url.split("/").pop();
  const user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
