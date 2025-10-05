import s3Client from "@/app/lib/s3Client";
import { withAuth } from "@/app/lib/withAuth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

/**
 * POST /api/file/upload
 *
 * Generate a pre-signed S3 upload URL.
 *
 * Request Body (application/json):
 *   - filename (string): Original file name (e.g. "notes.pdf")
 *   - fileType (string): MIME type of the file (e.g. "application/pdf")
 *
 * Responses:
 *   200: OK
 *     - uploadUrl (string): Temporary pre-signed URL to PUT the file to S3
 *     - s3Key (string): Unique S3 key assigned to the file
 *   400: Bad Request - filename and fileType are required
 *   401: Unauthorized - Missing or invalid auth token
 *   500: Internal Server Error - Failed to generate upload URL
 */
export const POST = withAuth(async (req: Request, uid: string) => {
  try {
    const { filename, fileType } = await req.json();

    if (!filename || !fileType) {
      return NextResponse.json(
        { error: "filename and fileType are required" },
        { status: 400 }
      );
    }

    const s3Key = `${uid}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return NextResponse.json({
      uploadUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
});
