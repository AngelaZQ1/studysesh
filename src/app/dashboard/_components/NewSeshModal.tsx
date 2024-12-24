"use client";
import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Radio } from "@mantine/core";
import { FiMapPin } from "react-icons/fi";

interface NewSeshModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function NewSeshModal({ opened, onClose }: NewSeshModalProps) {
  const form = useForm({
    initialValues: {
      name: "",
      date: null,
      time: null,
      locationString: "",
      location: "virtually",
    },
    validate: {
      name: (value) => (value.trim().length === 0 ? "Name is required" : null),
      date: (value) => (!value ? "Date is required" : null),
      locationString: (value): string | null =>
        form.getValues().location === "inPerson" && value.trim().length === 0
          ? "Location cannot be empty"
          : null,
    },
  });

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onClose();
  };

  const handleSubmit = async (values: {
    name: string;
    date?: null;
    time?: null;
    location?: any;
    locationString?: any;
  }) => {
    form.validate();

    const requestBody =
      values.location === "virtually"
        ? { ...values, virtual: true, location: null, locationString: null }
        : {
            ...values,
            virtual: false,
            location: values.locationString,
            locationString: null,
          };

    const res = await fetch("/api/sesh", {
      method: "POST",
      body: JSON.stringify({ ...requestBody, ownerId: 1 }), // TODO remove ownerID
    });

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been created.",
      autoClose: 3000,
      color: "pink",
    });
    handleClose();
  };

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
        <Stack gap="xl">
          <TextInput
            key={form.key("name")}
            label="Give your Sesh a name"
            placeholder="Cramming for finals"
            radius={7}
            labelProps={{ fw: 600 }}
            {...form.getInputProps("name")}
            size="md"
            withAsterisk
          />
          <Box>
            <Text size="md" fw={600}>
              When? <span style={{ color: "red" }}>*</span>
            </Text>
            <DatePicker
              key={form.key("date")}
              {...form.getInputProps("date")}
              firstDayOfWeek={0}
              numberOfColumns={2}
              size="md"
              minDate={new Date()}
              highlightToday
              allowDeselect
            />
            {form.errors.date && (
              <Text c="red" size="sm">
                {form.errors.date}
              </Text>
            )}
          </Box>

          <Box>
            <Text size="md" fw={600}>
              What time?
            </Text>
            <TimeInput
              key={form.key("time")}
              {...form.getInputProps("time")}
              size="md"
            />
          </Box>
          <Radio.Group
            label="Where is the Sesh happening?"
            labelProps={{ fw: 600 }}
            size="md"
            {...form.getInputProps("location")}
          >
            <Stack mt="md">
              <Radio
                value="virtually"
                label="Virtually"
                color="#FC6288"
                size="md"
              />
              <Flex align="center" gap="sm">
                <Radio value="inPerson" color="#FC6288" size="md" />
                <TextInput
                  label="In person"
                  key={form.key("locationString")}
                  placeholder="Snell Library Colab G"
                  disabled={form.getValues().location === "virtually"}
                  radius={7}
                  leftSectionPointerEvents="none"
                  leftSection={<FiMapPin />}
                  size="md"
                  {...form.getInputProps("locationString")}
                />
              </Flex>
            </Stack>
          </Radio.Group>
        </Stack>

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
