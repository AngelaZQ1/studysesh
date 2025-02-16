"use client";

import { Avatar, Button, Flex, Menu, Text } from "@mantine/core";
import Image from "next/image";
import logo from "../../../public/studyseshLogo.svg";
import useUser from "../_hooks/useUser";
import useUserContext from "../_hooks/useUserContext";
import { useState, useEffect } from "react";
import { User } from "../_types/types";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import classes from "./NavBar.module.css";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const { firebaseUser } = useUserContext();
  const { getUser } = useUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!firebaseUser) return;

    async function fetchUser() {
      const fetchedUser = await getUser({ firebaseUid: firebaseUser.uid });
      setUser(fetchedUser);
    }

    fetchUser();
  }, [firebaseUser]);

  const navigateProfilePage = () => {
    router.push(`/profile/${user?.id}`);
  };

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        notifications.show({
          title: "Success!",
          message: "Successfully signed out.",
          autoClose: 5000,
          color: "pink",
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Error",
          message: "An unknown error occurred while trying to sign out.",
          autoClose: 5000,
          color: "red",
        });
        console.log("sign out error", error);
      });
  };

  return (
    <nav className={classes.nav}>
      <Flex px={30} py={5} pt={8} justify="space-between" gap="md">
        <Image src={logo} alt="logo" width={40} />

        {user && (
          <Flex align="center">
            <Avatar color="pink" radius="xl" size={30}>
              {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
            </Avatar>

            <Menu shadow="md" width={150} trigger="hover">
              <Menu.Target>
                <Button
                  ml={5}
                  px={10}
                  variant="subtle"
                  color="black"
                  rightSection={<FiChevronDown />}
                >
                  <Text size="xs" fw={500}>
                    {user.firstName} {user.lastName[0]}
                  </Text>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={navigateProfilePage}>Profile</Menu.Item>
                <Menu.Item
                  leftSection={<FiLogOut size={14} />}
                  onClick={handleLogOut}
                >
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        )}
      </Flex>
    </nav>
  );
}
