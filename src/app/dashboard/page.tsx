import { Card, Text, Button, Group, Stack } from "@mantine/core";
import SeshCalendar from "./_components/seshCalendar";

export default function Page() {
  return (
    <Stack p={30} h="100vh" gap={30}>
      <Group grow align="stretch" h={200}>
        <Button
          h="inherit"
          variant="gradient"
          gradient={{ from: "#FF9C67", to: "#FC6288", deg: 115 }}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)" }}
        >
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
    </Stack>
  );
}
