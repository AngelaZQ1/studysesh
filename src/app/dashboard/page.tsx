"use client";
import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usePusher from "../_hooks/usePusher";
import useUserContext from "../_hooks/useUserContext";
import { Sesh } from "../_types/types";
import NewSeshModal from "./_components/NewSeshModal";
import SeshCalendar from "./_components/SeshCalendar";
import { fetchSeshes } from "../_redux/seshSlice";
import { AppDispatch } from "../_redux/store";

export default function Dashboard() {
  const { firebaseUser, user } = useUserContext();
  usePusher();
  const [opened, { open, close }] = useDisclosure(false);
  const [seshToEdit, setSeshToEdit] = useState<Sesh | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    firebaseUser.getIdToken().then((idToken) => {
      dispatch(fetchSeshes({ idToken, userId: user.id }));
    });
  }, []);

  const handleSubmit = async () => {
    firebaseUser.getIdToken().then((idToken) => {
      dispatch(fetchSeshes({ idToken, userId: user.id }));
    });
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
