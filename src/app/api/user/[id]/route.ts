import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/user/[id]
// Gets the user with the given id
export const GET = withAuth(async (request: Request) => {
  const id = Number(request.url.split("/").pop());

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
});

// PUT /api/user/[id]
// Updates the user with the given id
export const PUT = withAuth(async (request: Request) => {
  const id = Number(request.url.split("/").pop());

  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
});
