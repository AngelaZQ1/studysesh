import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

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

// GET /api/user
// Gets the user with the given id or uid
// If no id or uid is provided, returns all users
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  const uid = searchParams.get("uid");

  let user = null;

  if (idParam) {
    const id = Number(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    } else {
      user = await prisma.user.findUnique({ where: { id } });
    }
  } else if (uid) {
    user = await prisma.user.findUnique({ where: { firebaseUid: uid } });
  } else {
    user = await prisma.user.findMany();
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT /api/user
// Updates the user with the given id
export async function PUT(request: Request) {
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
}
