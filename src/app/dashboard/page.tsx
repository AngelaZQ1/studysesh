"use client";
import { Card, Text, Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NewSeshModal from "./_components/NewSeshModal";
import SeshCalendar from "./_components/SeshCalendar";
import useSesh from "../_hooks/useSesh";
import { Sesh } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [opened, { open, close }] = useDisclosure(false);
  const { getAllSeshes } = useSesh();
  const [seshes, setSeshes] = useState<Sesh[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const seshes = await getAllSeshes();
      setSeshes(seshes);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const seshes = await getAllSeshes();
    setSeshes(seshes);
  };

  return (
    <Stack p={30} h="100vh" gap={30}>
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

      <SeshCalendar seshes={seshes} />

      <NewSeshModal opened={opened} onClose={close} onSubmit={handleSubmit} />
    </Stack>
  );
}
