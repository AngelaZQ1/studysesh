"use client";
import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePusher from "../_hooks/usePusher";
import useUserContext from "../_hooks/useUserContext";
import { fetchSeshes } from "../_redux/seshSlice";
import { AppDispatch } from "../_redux/store";
import { Sesh } from "../_types/types";
import NewSeshModal from "./_components/NewSeshModal";
import SeshCalendar from "./_components/SeshCalendar";

export default function Dashboard() {
  const router = useRouter();
  const { firebaseUser, user } = useUserContext();
  usePusher();
  const [opened, { open, close }] = useDisclosure(false);
  const [seshToEdit, setSeshToEdit] = useState<Sesh | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const effectRan = useRef(false); // to prevent useEffect running twice

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    if (!firebaseUser) {
      router.push("/login");
      notifications.show({
        title: "Error",
        message: "Please log in.",
        autoClose: 5000,
        color: "pink",
      });
      return;
    }
    dispatch(fetchSeshes({ userId: user.id }));
  }, []);

  const handleSubmit = async () => {
    await dispatch(fetchSeshes({ userId: user.id }));
    setSeshToEdit(null);
    close();
  };

  const handleEditSesh = (sesh: Sesh) => {
    setSeshToEdit(sesh);
    open();
  };

  return (
    <Stack p={30} pt={10} h="93vh" gap={30}>
      <Group grow align="stretch" h={100}>
        <Button onClick={open} h="inherit" variant="primary">
          Plan a Sesh
        </Button>
        <Card withBorder radius="md">
          <Text fw={700}>Your Next Sesh</Text>
        </Card>
        <Card withBorder radius="md">
          <Stack align="center" justify="center" h="100%" gap="0" c="gray.6">
            <Text fw={700}>Under Construction...</Text>
            <Text size="sm">Check back later!</Text>
          </Stack>
        </Card>
      </Group>

      <SeshCalendar handleEdit={handleEditSesh} />

      <NewSeshModal
        opened={opened}
        onSubmit={handleSubmit}
        seshToEdit={seshToEdit}
      />
    </Stack>
  );
}
