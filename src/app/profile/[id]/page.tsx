"use client";

import { Sesh } from "@/app/_types/types";
import ProfileSesh from "@/app/profile/_components/ProfileSesh";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { FiEdit3 } from "react-icons/fi";
import useProfilePage from "./useProfilePage";

export default function Page() {
  const {
    user,
    isCurrentUser,
    currentUser,
    isLoading,
    futureSeshes,
    pastSeshes,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isEditing,
    setIsEditing,
    handleSave,
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
              <Flex align="center">
                <Avatar color="pink" radius="xl" size={50}>
                  {currentUser.firstName[0].toUpperCase() +
                    currentUser.lastName[0].toUpperCase()}
                </Avatar>
                {isEditing ? (
                  <>
                    <TextInput
                      label="First"
                      value={firstName}
                      onChange={(e) => setFirstName(e.currentTarget.value)}
                      flex="1"
                      ml="xs"
                      mr={5}
                      mb={10}
                    />
                    <TextInput
                      label="Last"
                      value={lastName}
                      onChange={(e) => setLastName(e.currentTarget.value)}
                      flex="1"
                      mb={10}
                    />
                  </>
                ) : (
                  <Text size="xl" ml="xs">
                    {currentUser.firstName + " " + currentUser.lastName}
                  </Text>
                )}
                {!isEditing && (
                  <Button
                    variant="default"
                    onClick={() => setIsEditing(!isEditing)}
                    leftSection={<FiEdit3 size={16} />}
                    ml="auto"
                  >
                    Edit
                  </Button>
                )}
              </Flex>
              {isEditing && (
                <Group gap={5} sx={{ alignSelf: "flex-end" }}>
                  <Button
                    variant="default"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="pink"
                    onClick={handleSave}
                    disabled={firstName == "" && lastName == ""}
                  >
                    Save
                  </Button>
                </Group>
              )}
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

          <Divider mt={40} mb={30} />

          <Text size="xl" c="gray.7" fw={700}>
            {isCurrentUser
              ? "Your Seshes:"
              : `Your Seshes with ${user.firstName + " " + user.lastName}:`}
          </Text>
          <Box mt={50}>
            <Text size="lg" mb="sm" fw={700}>
              Upcoming
            </Text>
            {futureSeshes.map((sesh: Sesh) => (
              <ProfileSesh key={sesh.id} sesh={sesh} />
            ))}
            {futureSeshes.length === 0 && (
              <Text size="sm" c="gray.6" mb="sm">
                No upcoming Seshes
              </Text>
            )}
          </Box>
          <Box mt={40}>
            <Text size="lg" mb="sm" fw={700}>
              Past
            </Text>
            <Stack gap={0}>
              {pastSeshes.map((sesh: Sesh) => (
                <ProfileSesh key={sesh.id} sesh={sesh} />
              ))}
              {pastSeshes.length === 0 && (
                <Text size="sm" c="gray.6" mb="sm">
                  No past Seshes
                </Text>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Container>
  );
}
