"use client";
import useFriendRequest from "@/app/_hooks/useFriendRequest";
import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { Card, Tabs } from "@mantine/core";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import AddFriendTab from "./AddFriendTab";

interface SentFriendRequest {
  id: number;
  recipientId: number;
}
interface ReceivedFriendRequest {
  id: number;
  senderId: number;
}

export interface FriendRequests {
  sent: SentFriendRequest[];
  received: ReceivedFriendRequest[];
}

export default function Friends() {
  const { firebaseUser, user } = useUserContext();
  const { getUserFriends } = useUser();
  const { getUserFriendRequests } = useFriendRequest();

  const [friends, setFriends] = useState<User[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequests | null>(
    null
  );

  useEffect(() => {
    const fetchFriends = async () => {
      const idToken = await firebaseUser.getIdToken();
      const friendsList = await getUserFriends({ id: user.id, idToken });
      setFriends(friendsList);
    };
    const fetchFriendRequests = async () => {
      const idToken = await firebaseUser.getIdToken();
      const friendsRequests = await getUserFriendRequests({
        userId: user.id,
        idToken,
      });
      setFriendRequests(friendsRequests);
    };
    fetchFriends();
    fetchFriendRequests();
  }, []);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Tabs defaultValue="friends" color="pink" p={5}>
        <Tabs.List
          mb={20}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tabs.Tab value="friends">Your Friends</Tabs.Tab>
          <Tabs.Tab value="add">Add Friend</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="friends">
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
        </Tabs.Panel>
        <Tabs.Panel value="add">
          <AddFriendTab friends={friends} friendRequests={friendRequests} />
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <div>Pending friend requests will show here.</div>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
