import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

/**
 * POST /api/file/confirm
 *
 * Confirm a successful file upload and save metadata to database
 *
 * Request Body:
 *   - s3Key: string - The S3 key returned from upload endpoint
 *   - filename: string - Original filename from user
 *   - fileType: string - MIME type
 *   - fileSize: number - File size in bytes
 *   - seshId: number - ID of the session this file belongs to
 */
export const POST = withAuth(async (req: Request, uid: string) => {
  try {
    const { s3Key, filename, fileType, fileSize, seshId } = await req.json();

    if (!s3Key || !filename || !fileType || !fileSize || !seshId) {
      return NextResponse.json(
        {
          error: "s3Key, filename, fileType, fileSize, and seshId are required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sesh = await prisma.sesh.findFirst({
      where: {
        id: seshId,
        OR: [{ ownerId: user.id }, { participants: { some: { id: user.id } } }],
      },
    });

    if (!sesh) {
      return NextResponse.json(
        { error: "Sesh not found or access denied" },
        { status: 403 }
      );
    }

    const fileRecord = await prisma.file.create({
      data: {
        filename,
        s3Key,
        fileType,
        fileSize,
        seshId,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(fileRecord);
  } catch (error) {
    console.error("Error confirming file upload:", error);
    return NextResponse.json(
      { error: "Failed to confirm file upload" },
      { status: 500 }
    );
  }
});
