"use client";

import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { Sesh, User } from "@/app/_types/types";
import { fetchAllSeshes } from "@/app/seshSlice";
import {
  Avatar,
  Box,
  Center,
  Container,
  Divider,
  Flex,
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
    const fetchUser = async () => {
      const res = await getUserById({ id: userId }).then((res) => {
        if (res.error) {
          setUser(null);
        } else {
          setUser(res);
        }
      });
    };
    const fetchSeshes = async () => {
      firebaseUser.getIdToken().then((idToken) => {
        dispatch(fetchAllSeshes(idToken));
      });
    };

    fetchUser();
    fetchSeshes();
  }, []);

  const futureSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) > new Date()
  );
  const pastSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) < new Date()
  );

  return user === null ? (
    <Center>
      <Text size="xl" c="gray.7" mt={30} fw={700}>
        This user doesnt exist!
      </Text>
    </Center>
  ) : (
    <Container size="sm" mt={100}>
      {isCurrentUser ? (
        <>
          <Avatar color="pink" radius="xl" size={50} mb={20}>
            {currentUser.firstName[0] + currentUser.lastName[0]}
          </Avatar>
          <Flex gap={10}>
            <TextInput label="First" placeholder={currentUser.firstName} />
            <TextInput label="Last" placeholder={currentUser.lastName} />
          </Flex>

          <Box mt={50}>
            <Text size="xl">Upcoming Seshes</Text>
          </Box>
          {futureSeshes.map((sesh) => (
            <Box key={sesh.id} mt={10}>
              <Text size="sm">{sesh.title}</Text>
              <Divider />
            </Box>
          ))}

          <Box mt={50}>
            <Text size="xl">Past Seshes</Text>
          </Box>
          {pastSeshes.map((sesh) => (
            <Box key={sesh.id} mt={10}>
              <Text size="sm">{sesh.title}</Text>
              <Divider />
            </Box>
          ))}
        </>
      ) : (
        user && (
          <Flex align="center" gap={10}>
            <Avatar color="pink" radius="xl" size={50}>
              {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
            </Avatar>
            <Text size="xl">{user.firstName + " " + user.lastName}</Text>
          </Flex>
        )
      )}
    </Container>
  );
}
