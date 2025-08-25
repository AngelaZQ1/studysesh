import { pusherServer } from "@/app/pusher";
import { NextResponse } from "next/server";
import { authAdmin } from "../../../../../firebaseAdmin";
import prisma from "../../../../../prisma/client";
import { verifySession } from "@/app/lib/dal";

// PUT api/sesh/[id]
// Update a Sesh with the given id
export async function PUT(request: Request) {
  const session = await verifySession();
  try {
    const body = await request.json();
    const { title, start, end, location, virtual, participantIds } = body;

    const id = Number(request.url.split("/").pop());

    if (!id) {
      return NextResponse.json({ error: "Missing Sesh id." }, { status: 400 });
    }

    try {
      const ownerId = await prisma.user
        .findUnique({ where: { firebaseUid: session.uid } })
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

      const updatedSeshWithParticipants = await prisma.sesh.findUnique({
        where: { id: updatedSesh.id },
        include: { participants: true },
      });

      pusherServer.trigger(
        "public",
        "update-sesh",
        updatedSeshWithParticipants
      );

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

      const seshToDelete = await prisma.sesh.findUnique({
        where: {
          id,
        },
        include: { participants: true },
      });

      const deletedSesh = await prisma.sesh.delete({
        where: {
          id,
        },
      });

      pusherServer.trigger("public", "delete-sesh", seshToDelete);

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
