import { NextResponse } from "next/server";
import { authAdmin } from "../../../firebaseAdmin";

// A middleware wrapper for endpoints that require authentication. Handles verifying the request
export function withAuth<
  T extends (
    req: Request,
    context: { params: Record<string, string> },
    uid: string
  ) => Promise<Response> | Response
>(handler: T) {
  return async (req: Request, context: { params: Record<string, string> }) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(token);
      return handler(req, context, decodedToken.uid);
    } catch (err) {
      console.error("Auth failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
