import useFriendRequest from "@/app/_hooks/useFriendRequest";
import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { UserPlusIcon } from "@heroicons/react/16/solid";
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Group,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FriendRequests } from "./Friends";

interface SearchResult {
  users: User[];
  total_results: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface AddFriendTabProps {
  friends: User[] | null;
  friendRequests: FriendRequests | null;
}

export default function AddFriendTab({
  friends,
  friendRequests,
}: AddFriendTabProps) {
  const { firebaseUser, user } = useUserContext();
  const { searchUsers } = useUser();
  const { createFriendRequest } = useFriendRequest();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(async () => {
      const idToken = await firebaseUser.getIdToken();
      const result = await searchUsers({
        query: search,
        idToken,
      });

      // exclude current friends
      if (friends && friends.length > 0) {
        result.users = result.users.filter((user: User) =>
          friends.find((f) => f.id !== user.id)
        );
      }
      setSearchResult(result);
    }, 300);
    return () => clearTimeout(timer);
  }, [firebaseUser, search]);

  const handleAdd = async (otherUserId: number) => {
    const idToken = await firebaseUser.getIdToken();
    await createFriendRequest({
      senderId: user.id,
      recipientId: otherUserId,
      idToken,
    });
  };

  // returns true if there is a friend request between the current user
  // and the given userId
  const friendRequestExists = (userId: number) => {
    const received = friendRequests?.received.find(
      (req) => req.senderId === userId
    );
    const sent = friendRequests?.sent.find((req) => req.recipientId === userId);
    return received || sent;
  };

  return (
    <Box>
      <TextInput
        placeholder="Search users by name..."
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      {searchResult && (
        <>
          <Center>
            <Text size="xs" my="xs" c="gray">
              {searchResult.total_results === 1
                ? "1 result"
                : searchResult.total_results + " results"}
            </Text>
          </Center>
          {searchResult.users.map((user: User) => (
            <Card
              key={user.id}
              bg="gray.0"
              p="sm"
              mb="8"
              withBorder
              radius="md"
              shadow="none"
            >
              <Group justify="space-between">
                <Group gap="sm">
                  <Avatar
                    name={
                      user.firstName[0].toUpperCase() +
                      user.lastName[0].toUpperCase()
                    }
                    color="initials"
                    size={35}
                  ></Avatar>
                  <Text size="sm">{user.firstName + " " + user.lastName}</Text>
                </Group>
                {friendRequestExists(user.id) ? (
                  <Button
                    size="xs"
                    variant="default"
                    px="xs"
                    style={{ border: "1px solid rgb(222, 226, 230)" }}
                    disabled
                  >
                    Pending
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    variant="default"
                    px="xs"
                    onClick={() => handleAdd(user.id)}
                  >
                    <Group gap="4" mt="2">
                      <UserPlusIcon className="size-4" />
                      Add
                    </Group>
                  </Button>
                )}
              </Group>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}
