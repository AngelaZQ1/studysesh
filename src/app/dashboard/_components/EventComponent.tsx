import useUserContext from "@/app/_hooks/useUserContext";
import { Event } from "@/app/_types/types";
import { Popover, Text, Box, Stack, Flex, Button } from "@mantine/core";
import moment from "moment";
import { FiCalendar, FiClock, FiEdit3, FiMapPin } from "react-icons/fi";

const EventComponent = ({ event }: { event: Event }) => {
  const { userId } = useUserContext();
  return (
    <Popover withArrow position="top" withinPortal>
      <Popover.Target>
        <Box p={5}>{event.title}</Box>
      </Popover.Target>
      <Popover.Dropdown maw={300}>
        <Text fw="bold" maw="100%">
          {event.title}
        </Text>
        <Flex align="end" mt="xs" wrap="nowrap">
          <Stack gap={4}>
            <Flex gap={3} align="center" w="max-content">
              <FiCalendar color="gray" size={16} />
              <Text size="sm" c="gray.7" sx={{ flexShrink: "0" }}>
                {moment(event.start).format("dddd, MMMM D")}
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <FiClock color="gray" size={16} />
              <Text size="sm" c="gray.7">
                {moment(event.start).format("h:mma")}
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <FiMapPin color="gray" size={16} style={{ flexShrink: "0" }} />
              <Text size="sm" c="gray.7">
                {event.virtual ? "Virtual" : event.location}
              </Text>
            </Flex>
          </Stack>
          {event.ownerId === userId ? (
            <Button
              variant="outline"
              color="gray.5"
              c="gray.6"
              size="xs"
              ml="sm"
              flex="0 0 auto"
              leftSection={<FiEdit3 size={14} />}
            >
              Edit Sesh
            </Button>
          ) : null}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default EventComponent;
