import { NextResponse } from "next/server";
import { authAdmin } from "../../../firebaseAdmin";

export function withAuth<
  T extends (req: Request, uid: string) => Promise<Response> | Response,
>(handler: T) {
  return async (req: Request) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decodedToken = await authAdmin.verifyIdToken(token);
      return handler(req, decodedToken.toString());
    } catch (err) {
      console.error("Auth failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
