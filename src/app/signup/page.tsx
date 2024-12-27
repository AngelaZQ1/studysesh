"use client";
import {
  Stack,
  Text,
  Button,
  Card,
  Center,
  TextInput,
  Group,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

export default function Page() {
  const form = useForm({
    initialValues: {
      first: "",
      last: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      first: (value) =>
        value.trim().length === 0 ? "First name is required" : null,
      last: (value) =>
        value.trim().length === 0 ? "Last name is required" : null,
      email: (value) =>
        !value
          ? "Email is required"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email",
      password: (value) => (!value ? "Password is required" : null),
      confirmPassword: (value): string | null =>
        !value
          ? "Confirm password is required"
          : value !== form.values.password
          ? "Passwords do not match"
          : null,
    },
  });
  return (
    <Center
      h="100vh"
      style={{
        background: "linear-gradient(to bottom right, #FF9C67, #FC6288)",
        opacity: 0.9,
      }}
    >
      <Card shadow="lg" padding="xl" py={50}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack>
            <Title order={1} ta="center">
              Hi there!
            </Title>
            <Text ta="center" c="gray.7" mb={20}>
              Sign up with StudySesh
            </Text>
            <Group>
              <TextInput
                key={form.key("first")}
                label="First name"
                placeholder="John"
                withAsterisk
                {...form.getInputProps("first")}
              />
              <TextInput
                key={form.key("last")}
                label="Last name"
                placeholder="Doe"
                withAsterisk
                {...form.getInputProps("last")}
              />
            </Group>
            <TextInput
              key={form.key("email")}
              label="Email"
              placeholder="johndoe@gmail.com"
              withAsterisk
              {...form.getInputProps("email")}
            />
            <TextInput
              key={form.key("password")}
              label="Password"
              type="password"
              placeholder="Password"
              withAsterisk
              {...form.getInputProps("password")}
            />
            <TextInput
              key={form.key("confirmPassword")}
              label="Confirm password"
              type="password"
              placeholder="Confirm password"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
            />
            <Button fullWidth h={50} mt={30} type="submit" variant="primary">
              Sign up
            </Button>
            <Text size="sm" ta="center">
              Already have an account?{" "}
              <Anchor href="/login" c="black" underline="always">
                Log in here
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
