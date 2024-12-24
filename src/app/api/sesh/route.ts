import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, date, time, location, virtual, ownerId } = body;

    if (!name || !ownerId) {
      return NextResponse.json({ error: "Name and ownerId are required." }, { status: 400 });
    }

    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    })
    
    if (!owner) {
      return NextResponse.json({ error: "Owner not found." }, { status: 400 });
    }
;
    
    const newSesh = await prisma.sesh.create({
      data: {
        name,
        date: new Date(date),
        time: time || null,
        location: location || null,
        virtual,
        owner: {
          connect: { id: ownerId },
        },
      },
    });

    console.log("Sesh succesfully created", newSesh);
    return NextResponse.json(newSesh, { status: 201 });
  } catch (error) {
    console.error("Error creating Sesh:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
