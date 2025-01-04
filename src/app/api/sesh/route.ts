import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { authAdmin } from "../../../../firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, start, end, location, virtual } = body;
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required." },
        { status: 400 }
      );
    }

    if (!title || virtual === null) {
      return NextResponse.json(
        { error: "Title and virtual are required." },
        { status: 400 }
      );
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const ownerId = await prisma.user
        .findUnique({ where: { firebaseUid: uid } })
        .then((user) => {
          if (!user) throw new Error("User not found");
          return user.id;
        });

      const newSesh = await prisma.sesh.create({
        data: {
          title,
          start,
          end,
          location: location || null,
          virtual,
          owner: { connect: { id: ownerId } },
        },
      });

      console.log("Sesh successfully created", newSesh);
      return NextResponse.json(newSesh, { status: 201 });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Error verifying token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error creating Sesh:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken is required." },
        { status: 400 }
      );
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const userId = await prisma.user
        .findUnique({ where: { firebaseUid: uid } })
        .then((user) => {
          if (!user) throw new Error("User not found");
          return user.id;
        });

      const seshes = await prisma.sesh.findMany({
        where: {
          OR: [{ ownerId: userId }, { participants: { some: { id: userId } } }],
        },
      });

      return NextResponse.json(seshes, { status: 200 });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Error verifying token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching Seshes:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
