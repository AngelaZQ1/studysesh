"use client";
import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import useSesh from "../_hooks/useSesh";
import { Sesh } from "../_types/types";
import NewSeshModal from "./_components/NewSeshModal";
import SeshCalendar from "./_components/SeshCalendar";

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { seshes, fetchSeshes } = useSesh();

  const [seshToEdit, setSeshToEdit] = useState<Sesh | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSeshes();
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    await fetchSeshes();
    setSeshToEdit(null);
    close();
  };

  const handleEditSesh = (sesh: Sesh) => {
    setSeshToEdit(sesh);
    open();
  };

  return (
    <Stack p={30} pt={10} h="100vh" gap={30}>
      <Group grow align="stretch" h={200}>
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

      <SeshCalendar seshes={seshes} handleEdit={handleEditSesh} />

      <NewSeshModal
        opened={opened}
        onSubmit={handleSubmit}
        seshToEdit={seshToEdit}
      />
    </Stack>
  );
}
