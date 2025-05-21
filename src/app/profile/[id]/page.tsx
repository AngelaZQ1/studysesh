"use client";

import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { Sesh, User } from "@/app/_types/types";
import ProfileSesh from "@/app/profile/_components/ProfileSesh";
import { fetchSeshesForCurrentUser } from "@/app/seshSlice";
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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const { firebaseUser, user: currentUser } = useUserContext();
  const dispatch = useDispatch();
  const { seshes } = useSelector((state) => state.sesh);

  const { getUserById } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const userId = Number(pathname.split("/")[2]);

  useEffect(() => {
    if (firebaseUser === null) {
      router.push("/login");
    }
  }, [firebaseUser, router]);

  const isCurrentUser = currentUser && currentUser.id === userId;

  useEffect(() => {
    const fetchUserAndSeshes = async () => {
      const fetchUser = async () => {
        const res = await getUserById({ id: userId });
        if (res.error) {
          setUser(null);
        } else {
          setUser(res);
        }
      };

      const fetchSeshes = async () => {
        const idToken = await firebaseUser.getIdToken();
        await dispatch(fetchSeshesForCurrentUser(idToken));
      };

      await Promise.all([fetchUser(), fetchSeshes()]);
      setIsLoading(false);
    };

    fetchUserAndSeshes();
  }, []);

  const futureSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) > new Date()
  );
  const pastSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) < new Date()
  );

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
      ) : isCurrentUser ? (
        <Stack>
          <Box>
            <Avatar color="pink" radius="xl" size={50} mb={20}>
              {currentUser.firstName[0] + currentUser.lastName[0]}
            </Avatar>
            <Flex gap={10}>
              <TextInput
                label="First Name"
                placeholder={currentUser.firstName}
                flex="1"
              />
              <TextInput
                label="Last Name"
                placeholder={currentUser.lastName}
                flex="1"
              />
            </Flex>
          </Box>

          <Box mt="xl">
            <Text size="xl" mb="sm" fw={700}>
              Upcoming Seshes
            </Text>
            {futureSeshes.map((sesh: Sesh) => (
              <ProfileSesh sesh={sesh} />
            ))}
          </Box>

          <Box>
            <Text size="xl" mb="sm" fw={700}>
              Past Seshes
            </Text>
            <Stack gap={0}>
              {pastSeshes.map((sesh: Sesh) => (
                <ProfileSesh sesh={sesh} />
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Flex align="center" gap={10}>
          <Avatar color="pink" radius="xl" size={50}>
            {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
          </Avatar>
          <Text size="xl">{user.firstName + " " + user.lastName}</Text>
        </Flex>
      )}
    </Container>
  );
}
