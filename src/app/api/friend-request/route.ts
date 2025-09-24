import { withAuth } from "@/app/lib/withAuth";
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

/**
 * @route POST /api/friend-request
 * @description Create a new friend request with a given sender and recipient
 * @body {number} body.senderId - ID of the sender
 * @body {number} body.recipientId - ID of the recipient
 * @returns {201} FriendRequest created
 * @returns {400} Missing or invalid input
 * @returns {409} Duplicate request or already friends
 */
export const POST = withAuth(async (request: Request) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body is required" },
      { status: 400 }
    );
  }

  const senderId = body.senderId;
  const recipientId = body.recipientId;

  if (!senderId || !recipientId) {
    return NextResponse.json(
      { error: "Sender and recipient are required" },
      { status: 400 }
    );
  }
  if (senderId === recipientId) {
    return NextResponse.json(
      { error: "Sender and recipient cannot be the same" },
      { status: 400 }
    );
  }

  const sender = await prisma.user.findFirst({ where: { id: senderId } });
  const receipient = await prisma.user.findFirst({
    where: { id: recipientId },
  });
  if (!sender) {
    return NextResponse.json(
      { error: "Sender user does not exist" },
      { status: 404 }
    );
  }
  if (!receipient) {
    return NextResponse.json(
      { error: "Recipient user does not exist" },
      { status: 404 }
    );
  }

  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    },
  });
  if (existingRequest) {
    return NextResponse.json(
      { error: "Friend request already exists" },
      { status: 409 }
    );
  }

  const existingFriendship = await prisma.user.findFirst({
    where: {
      id: senderId,
      friends: {
        some: { id: recipientId },
      },
    },
  });
  if (existingFriendship) {
    return NextResponse.json(
      { error: "Users are already friends" },
      { status: 409 }
    );
  }

  const newFriendRequest = await prisma.friendRequest.create({
    data: {
      senderId,
      recipientId,
    },
  });

  console.log("Created friend request", newFriendRequest);
  return NextResponse.json(newFriendRequest, { status: 201 });
});

/**
 * @route GET /api/friend-request?userId={userId}
 * @description Get all friend requests where the given user is the recipient or sender
 * @returns {200} OK
 * @returns {400} Missing or invalid input
 * @returns {401} Unathorized - Given user's firebase UID doesnt match UID in auth token
 * @returns {404} Not Found - User not found
 */
export const GET = withAuth(async (request: Request, _, uid: string) => {
  const url = new URL(request.url);
  const userIdParam = url.searchParams.get("userId");

  if (!userIdParam) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (userIdParam && isNaN(Number(userIdParam))) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const userId = Number(userIdParam);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.firebaseUid !== uid) {
    return NextResponse.json({ error: "Unathorized" }, { status: 401 });
  }

  const sentRequests = await prisma.friendRequest.findMany({
    where: { senderId: userId },
    select: {
      id: true,
      recipientId: true,
    },
  });
  const receivedRequests = await prisma.friendRequest.findMany({
    where: { recipientId: userId },
    select: {
      id: true,
      senderId: true,
    },
  });

  return NextResponse.json({ sent: sentRequests, received: receivedRequests });
});
