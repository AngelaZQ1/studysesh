"use client";
import { Sesh } from "@/app/_types/types";
import useNewSeshModal from "@/app/dashboard/_components/useNewSeshModal";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  MultiSelect,
  Popover,
  Radio,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { FiMapPin } from "react-icons/fi";
import { LuCalendarX2 } from "react-icons/lu";

interface NewSeshModalProps {
  opened: boolean;
  seshToEdit?: Sesh | null;
  onSubmit: () => void;
}

export default function NewSeshModal({
  opened,
  seshToEdit,
  onSubmit,
}: NewSeshModalProps) {
  const {
    handleClose,
    handleSubmit,
    handleUpdate,
    handleCancelSesh,
    popoverOpened,
    setPopoverOpened,
    form,
    allUsers,
    fetchUsers,
  } = useNewSeshModal({
    onSubmit,
    seshToEdit,
  });

  const handleFormSubmit = async (values: typeof form.values) => {
    await handleSubmit(values);
    onSubmit();
  };

  const handleFormUpdate = async () => {
    if (!seshToEdit) {
      notifications.show({
        title: "Error",
        message: "An error occurred while updating the Sesh.",
        autoClose: 5000,
        color: "red",
      });
      return;
    }
    await handleUpdate({ ...form.values, id: seshToEdit.id });
    onSubmit();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={seshToEdit ? "Edit Sesh" : "Plan a Sesh"}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="auto"
      centered
    >
      <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
        <Flex>
          <Stack gap="xl">
            <TextInput
              key={form.key("title")}
              label="Title"
              placeholder="Cramming for finals"
              labelProps={{ fw: 600 }}
              {...form.getInputProps("title")}
              size="xs"
              withAsterisk
            />
            <Box>
              <Text size="xs" fw={600}>
                Date <span style={{ color: "red" }}>*</span>
              </Text>
              <DatePicker
                key={form.key("date")}
                {...form.getInputProps("date")}
                firstDayOfWeek={0}
                numberOfColumns={2}
                size="xs"
                minDate={new Date()}
                highlightToday
                allowDeselect
              />
              {form.errors.date && <Text c="red">{form.errors.date}</Text>}

              <Text size="xs" fw={600} mt="sm">
                Time
              </Text>
              <TimeInput
                key={form.key("time")}
                size="xs"
                {...form.getInputProps("time")}
              />
            </Box>

            <Radio.Group
              label="Location"
              size="xs"
              labelProps={{ fw: 600 }}
              {...form.getInputProps("location")}
              withAsterisk
            >
              <Stack mt="md" gap="xs">
                <Radio
                  value="virtual"
                  label="Virtual"
                  color="#FC6288"
                  size="xs"
                />
                <Flex align="center" gap="sm">
                  <Radio value="inPerson" color="#FC6288" size="xs" />
                  <TextInput
                    label="In person"
                    key={form.key("locationString")}
                    placeholder="Snell Library Colab G"
                    disabled={form.getValues().location === "virtual"}
                    leftSectionPointerEvents="none"
                    leftSection={<FiMapPin />}
                    sx={{ label: { fontWeight: 400 } }}
                    size="xs"
                    {...form.getInputProps("locationString")}
                  />
                </Flex>
              </Stack>
            </Radio.Group>
          </Stack>

          <Divider orientation="vertical" mx="md" />

          <MultiSelect
            key={form.key("participantIds")}
            label="Participants"
            size="xs"
            placeholder="Search by name..."
            onClick={fetchUsers}
            data={allUsers.map((user) => ({
              value: user.id.toString(),
              label: `${user.firstName} ${user.lastName}`,
            }))}
            w={300}
            checkIconPosition="right"
            nothingFoundMessage="Nothing found..."
            searchable
            {...form.getInputProps("participantIds")}
          />
        </Flex>

        <Flex justify="space-between" mt="xl">
          {seshToEdit && (
            <Popover
              opened={popoverOpened}
              onChange={setPopoverOpened}
              position="top"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <Button
                  onClick={() => setPopoverOpened(true)}
                  variant="subtle"
                  color="red"
                  leftSection={<LuCalendarX2 size={18} />}
                >
                  Cancel Sesh
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="xs">
                  Are you sure you want to cancel this Sesh?
                </Text>
                <Center mt="xs">
                  <Button
                    onClick={() => setPopoverOpened(false)}
                    size="xs"
                    variant="subtle"
                    color="black"
                    mr="xs"
                  >
                    Keep Sesh
                  </Button>
                  <Button
                    onClick={handleCancelSesh}
                    size="xs"
                    variant=""
                    color="red"
                  >
                    Cancel Sesh
                  </Button>
                </Center>
              </Popover.Dropdown>
            </Popover>
          )}
          <Flex ml="auto" gap={10}>
            <Button variant="white" c="gray.7" onClick={handleClose}>
              Cancel
            </Button>
            {seshToEdit ? (
              <Button
                onClick={handleFormUpdate}
                variant="gradient"
                gradient={{ from: "#FF9C67", to: "#FC6288", deg: 115 }}
              >
                Update Sesh
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: "#FF9C67", to: "#FC6288", deg: 115 }}
              >
                Plan Sesh
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
}
