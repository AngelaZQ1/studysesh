import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET /api/user
// Returns all users
export const GET = withAuth(async () => {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
});

// POST /api/user
// Creates a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firebaseUid, firstName, lastName, email } = body;

    if (!firebaseUid || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        firebaseUid,
        firstName,
        lastName,
        email,
        seshes: {
          create: [],
        },
      },
    });

    console.log("User succesfully created", newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating User:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// PUT /api/user
// Updates the user with the given id
export const PUT = withAuth(async (request: Request) => {
  try {
    const body = await request.json();
    const { id, firstName, lastName, email } = body;

    if (!id || !firstName || !lastName || !email) {
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
