import useUserContext from "@/app/_hooks/useUserContext";
import { Sesh } from "@/app/_types/types";
import { Avatar, Box, Card, Flex, Stack, Text } from "@mantine/core";
import moment from "moment";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

export default function ProfileSesh({ sesh }: { sesh: Sesh }) {
  const { user: currentUser } = useUserContext();

  if (!currentUser) return;
  return (
    <Card shadow="sm" padding="lg" mb="sm" radius="md" withBorder>
      <Flex key={sesh.id} justify="space-between" align="start" gap={10}>
        <Stack gap="8">
          <Text fw={700}>{sesh.title}</Text>
          <Stack gap="3">
            <Flex gap={3} align="center" w="max-content">
              <FiCalendar color="gray" size={16} />
              <Text size="sm" c="gray.7" sx={{ flexShrink: "0" }}>
                {moment(sesh.start).format("dddd, MMMM D")}
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <FiClock color="gray" size={16} />
              <Text size="sm" c="gray.7">
                {moment(sesh.start).format("h:mmA")}
              </Text>
            </Flex>
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
            <Flex align="center" gap={5}>
              {sesh.owner.id === currentUser.id ? (
                <>
                  <Avatar size="sm" color="pink">
                    {sesh.owner.firstName[0].toUpperCase() +
                      sesh.owner.lastName[0].toUpperCase()}
                  </Avatar>
                  <Text size="xs" fw={700}>
                    YOU
                  </Text>
                </>
              ) : (
                <>
                  <Avatar size="sm">
                    {sesh.owner.firstName[0].toUpperCase() +
                      sesh.owner.lastName[0].toUpperCase()}
                  </Avatar>
                  <Text size="xs">
                    {sesh.owner.firstName + " " + sesh.owner.lastName}
                  </Text>
                </>
              )}
            </Flex>
          </Box>
          {sesh.participants.length > 0 && (
            <Box mt="md">
              <Text size="sm" mb={4}>
                Participants
              </Text>
              <Stack gap={7}>
                {sesh.participants.map((p) => (
                  <Flex align="center" gap={5}>
                    {p.id === currentUser.id ? (
                      <>
                        <Avatar size="sm" color="pink">
                          {p.firstName[0].toUpperCase() +
                            p.lastName[0].toUpperCase()}
                        </Avatar>
                        <Text size="xs" fw={700}>
                          YOU
                        </Text>
                      </>
                    ) : (
                      <>
                        <Avatar size="sm">
                          {p.firstName[0].toUpperCase() +
                            p.lastName[0].toUpperCase()}
                        </Avatar>
                        <Text size="sm">{p.firstName + " " + p.lastName}</Text>
                      </>
                    )}
                  </Flex>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
