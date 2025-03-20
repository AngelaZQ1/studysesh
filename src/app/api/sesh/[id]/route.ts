import { NextResponse } from "next/server";
import { authAdmin } from "../../../../../firebaseAdmin";
import prisma from "../../../../../prisma/client";

// Update a Sesh with the given id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { title, start, end, time, location, virtual, participantIds } = body;

    const id = Number(request.url.split("/").pop());
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing Sesh id." }, { status: 400 });
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

      const updatedSesh = await prisma.sesh.update({
        where: {
          id,
        },
        data: {
          title,
          start,
          end,
          time,
          location: location || null,
          virtual,
          participants: {
            set: [],
            connect: participantIds.map((participantId: string) => ({
              id: participantId,
            })),
          },
          owner: { connect: { id: ownerId } },
        },
      });

      console.log("Sesh successfully updated", updatedSesh);
      return NextResponse.json(updatedSesh, { status: 201 });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Error verifying token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error updating Sesh:", error);
    return NextResponse.json(
      { error: "Error updating Sesh." },
      { status: 500 }
    );
  }
}

// Delete the Sesh with the given id
export async function DELETE(request: Request) {
  try {
    const id = Number(request.url.split("/").pop());
    const idToken = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing Sesh id." }, { status: 400 });
    }

    try {
      authAdmin.verifyIdToken(idToken);

      const deletedSesh = await prisma.sesh.delete({
        where: {
          id,
        },
      });

      console.log("Sesh successfully deleted", deletedSesh);
      return NextResponse.json(deletedSesh, { status: 201 });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Error verifying token." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error deleting Sesh:", error);
    return NextResponse.json(
      { error: "Error deleting Sesh." },
      { status: 500 }
    );
  }
}
