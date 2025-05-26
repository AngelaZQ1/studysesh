import { pusherServer } from "@/app/pusher";
import { Sesh } from "@prisma/client";
import { NextResponse } from "next/server";
import { authAdmin } from "../../../../firebaseAdmin";
import prisma from "../../../../prisma/client";

// POST api/sesh
// Create a new Sesh
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, start, end, location, virtual, participantIds } = body;
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
          participants: {
            connect: participantIds.map((id: string) => ({ id })),
          },
          owner: { connect: { id: ownerId } },
        },
      });

      const newSeshWithParticipants = await prisma.sesh.findUnique({
        where: { id: newSesh.id },
        include: { participants: true },
      });

      pusherServer.trigger("public", "new-sesh", newSeshWithParticipants);

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
      { error: "Error creating Sesh." },
      { status: 500 }
    );
  }
}

// GET api/sesh?userId=1
// Get all Seshes that the user with the given id is a part of
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    if (!userIdParam) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const userId = Number(userIdParam);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId." }, { status: 400 });
    }

    try {
      authAdmin.verifyIdToken(idToken);

      const seshes: Sesh[] = await prisma.sesh.findMany({
        where: {
          OR: [{ ownerId: userId }, { participants: { some: { id: userId } } }],
        },
        include: { participants: true, owner: true },
      });

      console.log("SESHES", seshes);

      console.log("Seshes successfully retrieved", seshes);
      return NextResponse.json(seshes, { status: 200 });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Error verifying token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error retrieving Seshes:", error);
    return NextResponse.json(
      { error: "Error retrieving Seshes." },
      { status: 500 }
    );
  }
}
