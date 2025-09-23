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
 * @route GET /api/friend-request?recipientId={userId}
 * @description Get all friend requests where the given user is the recipient
 * @returns {200} OK
 * @returns {400} Missing or invalid input
 * @returns {401} Unathorized - recipientId not equal to userId
 * @returns {404} Not Found - User with recipientId not found
 */
export const GET = withAuth(async (request: Request, _, uid: string) => {
  const url = new URL(request.url);
  const recipientIdParam = url.searchParams.get("recipientId");

  if (!recipientIdParam) {
    return NextResponse.json(
      { error: "Recipient ID is required" },
      { status: 400 }
    );
  }

  if (isNaN(Number(recipientIdParam))) {
    return NextResponse.json(
      { error: "Invalid recipient ID" },
      { status: 400 }
    );
  }

  const recipientId = Number(recipientIdParam);

  const recipientUser = await prisma.user.findUnique({
    where: { id: recipientId },
  });

  if (!recipientUser) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  if (recipientUser.firebaseUid !== uid) {
    return NextResponse.json(
      { error: "Unathorized to view recipient ID friend requests" },
      { status: 401 }
    );
  }

  const friendRequests = await prisma.friendRequest.findMany({
    where: { recipientId },
  });

  return NextResponse.json(friendRequests);
});
