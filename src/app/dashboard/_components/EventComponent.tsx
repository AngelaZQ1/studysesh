import useUserContext from "@/app/_hooks/useUserContext";
import { Sesh } from "@/app/_types/types";
import { Box, Button, Flex, HoverCard, Stack, Text } from "@mantine/core";
import moment from "moment";
import { FiCalendar, FiClock, FiEdit3, FiMapPin } from "react-icons/fi";
import { PiUsersBold } from "react-icons/pi";

const EventComponent = ({
  event,
  handleEdit,
}: {
  event: Sesh;
  handleEdit: (sesh: Sesh) => void;
}) => {
  const { user } = useUserContext();
  const participantsString = event.participants
    .map((p) => `${p.firstName} ${p.lastName}`)
    .join(", ");

  const handleClick = (e: React.MouseEvent) => {
    if (event.ownerId === user.id) {
      handleEdit(event);
    }
  };

  if (!user) return;

  return (
    <HoverCard position="top" shadow="sm" offset={12}>
      <HoverCard.Target>
        <Box p={5} onClick={handleClick}>
          {event.title}
        </Box>
      </HoverCard.Target>
      <HoverCard.Dropdown maw={300}>
        <Stack gap={6}>
          <Text fw="bold" maw="100%">
            {event.title}
          </Text>
          <Stack gap="3">
            <Flex gap={3} align="center" w="max-content">
              <FiCalendar color="gray" size={16} />
              <Text size="sm" c="gray.7" sx={{ flexShrink: "0" }}>
                {moment(event.start).format("dddd, MMMM D")}
              </Text>
            </Flex>
            {event.time && (
              <Flex gap={3} align="center">
                <FiClock color="gray" size={16} />
                <Text size="sm" c="gray.7">
                  {moment(event.time, "HH:mm").format("h:mmA")}
                </Text>
              </Flex>
            )}
            <Flex gap={3} align="center">
              <FiMapPin color="gray" size={16} style={{ flexShrink: "0" }} />
              <Text size="sm" c="gray.7">
                {event.virtual ? "Virtual" : event.location}
              </Text>
            </Flex>
            {event.participants.length > 0 && (
              <Flex gap={3} align="center">
                <PiUsersBold
                  color="gray"
                  size={16}
                  style={{ flexShrink: "0" }}
                />
                <Text size="sm" c="gray.7">
                  {participantsString}
                </Text>
              </Flex>
            )}
          </Stack>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default EventComponent;
