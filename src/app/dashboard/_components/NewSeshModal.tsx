"use client";
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React from "react";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Radio } from "@mantine/core";
import { FiMapPin } from "react-icons/fi";
import useNewSeshModal from "@/app/_hooks/useNewSeshModal";
import { Sesh } from "@/app/_types/types";
import { notifications } from "@mantine/notifications";

interface NewSeshModalProps {
  opened: boolean;
  seshToEdit?: Sesh | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function NewSeshModal({
  opened,
  seshToEdit,
  onClose,
  onSubmit,
}: NewSeshModalProps) {
  const {
    handleClose,
    handleSubmit,
    handleUpdate,
    form,
    allUsers,
    fetchUsers,
  } = useNewSeshModal({
    onClose,
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
        autoClose: 3000,
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

        <Flex justify="flex-end" mt="xl" gap={10}>
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
      </form>
    </Modal>
  );
}
