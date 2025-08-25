import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/user/search?query={query}
// Get all users where first or last name matches query
export const GET = withAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  let users = [];
  if (!query) {
    return NextResponse.json({ users, total_results: 0 });
  }

  const parts = query.split(" ");

  users = await prisma.user.findMany({
    where: {
      OR: parts.flatMap((part) => [
        { firstName: { contains: part, mode: "insensitive" } },
        { lastName: { contains: part, mode: "insensitive" } },
      ]),
    },
    select: { id: true, firstName: true, lastName: true },
  });

  return NextResponse.json({
    users,
    total_results: users.length,
  });
});
