import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

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
