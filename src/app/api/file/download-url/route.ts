import s3Client from "@/app/lib/s3Client";
import { withAuth } from "@/app/lib/withAuth";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

/**
 * GET /api/file/download?fileName={fileName}
 *
 * Generate a pre-signed S3 download URL for a file.
 *
 * Query Parameters:
 *   - s3Key (string): The S3 key of the file to download. Must start with the authenticated user's UID.
 *
 * Responses:
 *   200: OK
 *     - downloadUrl (string): Temporary pre-signed URL to GET the file from S3
 *     - s3Key (string): S3 key of the file
 *   400: Bad Request - s3Key is missing
 *   403: Access Denied - s3Key does not belong to the authenticated user
 *   500: Internal Server Error - Failed to generate download URL
 */
export const GET = withAuth(async (req: Request, uid: string) => {
  try {
    const { searchParams } = new URL(req.url);
    const s3Key = searchParams.get("s3Key");

    if (!s3Key) {
      return NextResponse.json({ error: "s3Key is required" }, { status: 400 });
    }

    if (!s3Key.startsWith(uid)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const file = await prisma.file.findFirst({
      where: {
        s3Key,
        uploadedById: user.id,
      },
    });

    if (!file)
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return NextResponse.json({
      downloadUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
});
