import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

/**
 * @route GET user/[id]/friends
 * @description Gets the given user's friends list
 * @path {string} id - ID of the user
 * @returns {200} OK - User[]
 * @returns {400} Missing or invalid input
 * @returns {404} User not found
 */
export const GET = withAuth(async (_: Request, { params }) => {
  const { id } = await params;

  const idNum = Number(id);
  if (!idNum) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: idNum },
    include: { friends: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.friends);
});
