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
import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notifications } from "@mantine/notifications";

export default function Page() {
  const router = useRouter();
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
      password: (value): string | null =>
        !value
          ? "Password is required"
          : value.length < 6
          ? "Password must be at least 6 characters long"
          : value !== form.values.confirmPassword
          ? "Passwords do not match"
          : null,
      confirmPassword: (value): string | null =>
        !value
          ? "Confirm password is required"
          : value !== form.values.password
          ? "Passwords do not match"
          : null,
    },
  });

  const handleSubmit = (values: {
    first: string;
    last: string;
    email: string;
    password: string;
  }) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Firebase user created:", user);

        const requestBody = {
          firebaseUid: user.uid,
          firstName: values.first,
          lastName: values.last,
          email: values.email,
        };

        await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify({ ...requestBody }),
        });

        router.push("/dashboard");

        notifications.show({
          title: "Success!",
          message: "Account successfully created. Welcome!",
          autoClose: 5000,
          color: "pink",
        });
      })
      .catch((error) => {
        console.log("Firebase error:", error);
        if (error.code === "auth/email-already-in-use") {
          notifications.show({
            title: "Error",
            message: "Email already in use. Try logging in instead.",
            autoClose: 5000,
            color: "red",
          });
        }
      });
  };

  return (
    <Center
      h="100vh"
      style={{
        background: "linear-gradient(to bottom right, #FF9C67, #FC6288)",
        opacity: 0.9,
      }}
    >
      <Card shadow="lg" padding="xl" py={50}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
              <Link href="/login">
                <Anchor c="black" underline="always">
                  Log in here
                </Anchor>
              </Link>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
