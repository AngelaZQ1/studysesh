"use client";

import { Sesh } from "@/app/_types/types";
import ProfileSesh from "@/app/profile/_components/ProfileSesh";
import {
  Avatar,
  Box,
  Center,
  Container,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import useProfilePage from "./useProfilePage";

export default function Page() {
  const {
    user,
    isCurrentUser,
    currentUser,
    isLoading,
    futureSeshes,
    pastSeshes,
  } = useProfilePage();

  return (
    <Container size={550} mt={100}>
      {isLoading ? (
        <Center>
          <Loader mr="sm" /> Fetching Profile...
        </Center>
      ) : user === null ? (
        <Text size="xl" c="gray.7" mt={30} fw={700}>
          This user doesnt exist!
        </Text>
      ) : (
        <>
          {isCurrentUser ? (
            <Stack gap={0}>
              <Avatar color="pink" radius="xl" size={50} mb={20}>
                {currentUser.firstName[0].toUpperCase() +
                  currentUser.lastName[0].toUpperCase()}
              </Avatar>
              <Flex gap={10}>
                <TextInput
                  label="First Name"
                  value={currentUser.firstName}
                  flex="1"
                />
                <TextInput
                  label="Last Name"
                  value={currentUser.lastName}
                  flex="1"
                />
              </Flex>
            </Stack>
          ) : (
            <Flex align="center" gap={10}>
              <Avatar color="pink" radius="xl" size={50}>
                {user.firstName[0].toUpperCase() +
                  user.lastName[0].toUpperCase()}
              </Avatar>
              <Text size="xl">{user.firstName + " " + user.lastName}</Text>
            </Flex>
          )}
          <Box mt={50}>
            <Text size="xl" mb="sm" fw={700}>
              Upcoming Seshes
            </Text>
            {futureSeshes.map((sesh: Sesh) => (
              <ProfileSesh key={sesh.id} sesh={sesh} />
            ))}
          </Box>
          <Box mt={40}>
            <Text size="xl" mb="sm" fw={700}>
              Past Seshes
            </Text>
            <Stack gap={0}>
              {pastSeshes.map((sesh: Sesh) => (
                <ProfileSesh key={sesh.id} sesh={sesh} />
              ))}
            </Stack>
          </Box>
          {futureSeshes.length === 0 && pastSeshes.length === 0 && (
            <Text size="xl" c="gray.7" mt={30} fw={700}>
              This user has no seshes!
            </Text>
          )}
        </>
      )}
    </Container>
  );
}
