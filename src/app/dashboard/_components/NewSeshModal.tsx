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
import useUserContext from "@/app/_hooks/useUserContext";
import useSesh from "@/app/_hooks/useSesh";

interface NewSeshModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function NewSeshModal({ opened, onClose }: NewSeshModalProps) {
  const { idToken } = useUserContext();
  const { createSesh } = useSesh();

  // title, date, location are required
  // if location is inPerson, locationString is required
  const form = useForm({
    initialValues: {
      title: "",
      date: new Date(),
      time: undefined,
      locationString: "",
      location: "virtual",
    },
    validate: {
      title: (value) =>
        value.trim().length === 0 ? "Title is required" : null,
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
    title: string;
    date: Date; // form only
    time?: string; // form only
    start?: Date; // start and end are optional because they are calculated
    end?: Date;
    location: "virtual" | string;
    locationString: string; // form only
  }) => {
    form.validate();

    const requestBody = getRequestBody(values);
    createSesh(requestBody);

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been created.",
      autoClose: 3000,
      color: "pink",
    });
    handleClose();
  };

  const getRequestBody = (values: {
    title: string;
    date: Date;
    time?: string;
    start?: Date;
    end?: Date;
    location: "virtual" | string;
    locationString: string;
  }) => {
    const isVirtual = values.location === "virtual";
    const location = isVirtual ? null : values.locationString;

    // if time is provided, combine date and time for start
    const start = values.time
      ? new Date(
          values.date.getFullYear(),
          values.date.getMonth(),
          values.date.getDate(),
          ...values.time.split(":").map(Number)
        )
      : values.date;

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const requestBody = {
      title: values.title,
      start,
      end,
      location,
      virtual: isVirtual,
      idToken,
    };

    return requestBody;
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
            key={form.key("title")}
            label="Give your Sesh a title"
            placeholder="Cramming for finals"
            labelProps={{ fw: 600 }}
            {...form.getInputProps("title")}
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
            withAsterisk
          >
            <Stack mt="md">
              <Radio
                value="virtual"
                label="Virtual"
                color="#FC6288"
                size="md"
              />
              <Flex align="center" gap="sm">
                <Radio value="inPerson" color="#FC6288" size="md" />
                <TextInput
                  label="In person"
                  key={form.key("locationString")}
                  placeholder="Snell Library Colab G"
                  disabled={form.getValues().location === "virtual"}
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
