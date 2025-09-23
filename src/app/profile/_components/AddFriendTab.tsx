import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import {
  Avatar,
  Box,
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
  const { firebaseUser } = useUserContext();
  const { searchUsers } = useUser();

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
              </Group>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}
