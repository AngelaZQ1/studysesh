"use client";
import { Card, Text, Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NewSeshModal from "./_components/NewSeshModal";
import SeshCalendar from "./_components/SeshCalendar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });

  if (!auth.currentUser) {
    return null;
  }

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

      <SeshCalendar />

      <NewSeshModal opened={opened} onClose={close} />
    </Stack>
  );
}
