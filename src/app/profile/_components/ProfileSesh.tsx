import useUserContext from "@/app/_hooks/useUserContext";
import { Sesh } from "@/app/_types/types";
import { Avatar, Box, Card, Flex, Stack, Text } from "@mantine/core";
import moment from "moment";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

export default function ProfileSesh({ sesh }: { sesh: Sesh }) {
  const { user } = useUserContext();

  if (!user) return
  return (
    <Card shadow="xs" padding="lg" mb="sm" radius="md" withBorder>
      <Flex key={sesh.id} justify="space-between" align="start" gap={10}>
        <Stack gap="2">
          <Text fw={700}>{sesh.title}</Text>
          <Stack gap="3">
            <Flex gap={3} align="center" w="max-content">
              <FiCalendar color="gray" size={16} />
              <Text size="sm" c="gray.7" sx={{ flexShrink: "0" }}>
                {moment(sesh.start).format("dddd, MMMM D")}
              </Text>
            </Flex>
            {sesh.time && (
              <Flex gap={3} align="center">
                <FiClock color="gray" size={16} />
                <Text size="sm" c="gray.7">
                  {moment(sesh.time, "HH:mm").format("h:mmA")}
                </Text>
              </Flex>
            )}
            <Flex gap={3} align="center">
              <FiMapPin color="gray" size={16} style={{ flexShrink: "0" }} />
              <Text size="sm" c="gray.7">
                {sesh.virtual ? "Virtual" : sesh.location}
              </Text>
            </Flex>
          </Stack>
        </Stack>
        <Stack gap="2" w="30%">
          <Box>
            <Text size="sm" mb={4}>
              Owner
            </Text>
            <Flex align="center" gap="xs">
              {sesh.owner.id === user.id ? (
                <Avatar size="sm" color="pink">
                  {sesh.owner.firstName[0].toUpperCase() +
                    sesh.owner.lastName[0].toUpperCase()}
                </Avatar>
              ) : (
                <Avatar size="sm">
                  {sesh.owner.firstName[0].toUpperCase() +
                    sesh.owner.lastName[0].toUpperCase()}
                </Avatar>
              )}
              <Text size="sm">
                {sesh.owner.firstName + " " + sesh.owner.lastName}
              </Text>
            </Flex>
          </Box>
          {sesh.participants.length > 0 && (
            <Box mt="md">
              <Text size="sm" mb={4}>
                Participants
              </Text>
              {sesh.participants.map((p) => (
                <Flex align="center" gap="xs">
                  {p.id === user.id ? (
                    <Avatar size="sm" color="pink">
                      {p.firstName[0].toUpperCase() +
                        p.lastName[0].toUpperCase()}
                    </Avatar>
                  ) : (
                    <Avatar size="sm">
                      {p.firstName[0].toUpperCase() +
                        p.lastName[0].toUpperCase()}
                    </Avatar>
                  )}
                  <Text size="sm">{p.firstName + " " + p.lastName}</Text>
                </Flex>
              ))}
            </Box>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
