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

interface NewSeshModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function NewSeshModal({ opened, onClose }: NewSeshModalProps) {
  const { handleClose, handleSubmit, form, allUsers } =
    useNewSeshModal(onClose);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Plan a Sesh"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="auto"
      centered
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex>
          <Stack gap="xl">
            <TextInput
              key={form.key("title")}
              label="Give your Sesh a title"
              placeholder="Cramming for finals"
              labelProps={{ fw: 600 }}
              {...form.getInputProps("title")}
              withAsterisk
            />
            <Box>
              <Text size="sm" fw={600}>
                Pick a date <span style={{ color: "red" }}>*</span>
              </Text>
              <DatePicker
                key={form.key("date")}
                {...form.getInputProps("date")}
                firstDayOfWeek={0}
                numberOfColumns={2}
                minDate={new Date()}
                highlightToday
                allowDeselect
              />
              {form.errors.date && <Text c="red">{form.errors.date}</Text>}

              <Text size="sm" fw={600} mt="sm">
                What time?
              </Text>
              <TimeInput
                key={form.key("time")}
                {...form.getInputProps("time")}
              />
            </Box>

            <Radio.Group
              label="Where is the Sesh happening?"
              labelProps={{ fw: 600 }}
              {...form.getInputProps("location")}
              withAsterisk
            >
              <Stack mt="md">
                <Radio value="virtual" label="Virtual" color="#FC6288" />
                <Flex align="center" gap="sm">
                  <Radio value="inPerson" color="#FC6288" />
                  <TextInput
                    label="In person"
                    key={form.key("locationString")}
                    placeholder="Snell Library Colab G"
                    disabled={form.getValues().location === "virtual"}
                    leftSectionPointerEvents="none"
                    leftSection={<FiMapPin />}
                    {...form.getInputProps("locationString")}
                  />
                </Flex>
              </Stack>
            </Radio.Group>
          </Stack>

          <Divider orientation="vertical" mx="md" />

          <MultiSelect
            key={form.key("participantIds")}
            label="Add friends to your Sesh"
            placeholder="Search by name..."
            // value={selectedUserIds}
            // onChange={setSelectedUserIds}
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

        <Group justify="flex-end" mt="xl" gap={10}>
          <Button variant="white" c="gray.7" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: "#FF9C67", to: "#FC6288", deg: 115 }}
          >
            Plan Sesh
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
