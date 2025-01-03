// import useUserContext from "@/app/_hooks/useUserContext";
import { Event } from "@/app/_types/types";
import { Popover, Text, Box, Stack, Flex } from "@mantine/core";
import moment from "moment";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

const EventComponent = ({ event }: { event: Event }) => {
  // const { userId } = useUserContext();

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
            <Flex gap={3} align="center">
              <Flex w={20} h={20} justify="center" align="center">
                <FiCalendar color="gray" size={16} />
              </Flex>
              <Text size="sm" c="gray.7">
                {moment(event.start).format("dddd, MMMM D")}
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Flex w={20} h={20} justify="center" align="center">
                <FiClock color="gray" size={16} />
              </Flex>
              <Text size="sm" c="gray.7">
                {moment(event.start).format("h:mma")}
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Flex w={20} h={20} justify="center" align="center">
                <FiMapPin color="gray" size={16} />
              </Flex>
              <Text size="sm" c="gray.7">
                {event.virtual ? "Virtual" : event.location}
              </Text>
            </Flex>
          </Stack>
          {/* {event.ownerId === userId ? (
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
          ) : null} */}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
};

export default EventComponent;
