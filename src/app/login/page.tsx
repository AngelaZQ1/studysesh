"use client";
import {
  Stack,
  Text,
  Button,
  Card,
  Center,
  TextInput,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

export default function Page() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        !value
          ? "Email is required"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email",
      password: (value) => (!value ? "Password is required" : null),
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
      <Card shadow="lg" padding="xl" w="450" py={50}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack>
            <Title order={1} ta="center">
              Welcome back!
            </Title>
            <Text ta="center" c="gray.7" mb={20}>
              Ready to plan a Sesh?
            </Text>
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
            <Button fullWidth h={50} mt={30} type="submit" variant="primary">
              Log in
            </Button>
            <Text size="sm" ta="center" mt={10}>
              Don't have an account?{" "}
              <Anchor href="/signup/" underline="always" c="black">
                Sign up here
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
