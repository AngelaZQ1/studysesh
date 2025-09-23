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

interface SearchResult {
  users: User[];
  total_results: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export default function AddFriendTab() {
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
              bg="gray.1"
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
              </Group>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}
