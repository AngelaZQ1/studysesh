"use client";

import { Anchor, Avatar, Button, Flex, Menu, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getAuth, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import logo from "../../../public/studyseshLogo.svg";
import useUserContext from "../_hooks/useUserContext";
import classes from "./NavBar.module.css";

export default function NavBar() {
  const router = useRouter();
  const { setFirebaseUser, setUser, user } = useUserContext();

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
        setFirebaseUser(null);
        setUser(null);
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
      <Flex px={30} py={5} pt={9} justify="space-between" gap="md">
        <Image src={logo} alt="logo" width={45} />

        <Flex align="center" gap={50}>
          <Link href="/dashboard">
            <Anchor size="md" c="gray.7" underline="hover">
              Dashboard
            </Anchor>
          </Link>
          {user && (
            <Flex align="center">
              <Avatar color="pink" radius="xl" size={30}>
                {user.firstName[0].toUpperCase() +
                  user.lastName[0].toUpperCase()}
              </Avatar>

              <Menu shadow="md" trigger="hover">
                <Menu.Target>
                  <Button
                    ml={5}
                    px={10}
                    variant="white"
                    color="black"
                    rightSection={<FiChevronDown />}
                  >
                    <Text size="md" fw={500}>
                      {user.firstName} {user.lastName[0]}
                    </Text>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<FiUser size={14} />}
                    onClick={navigateProfilePage}
                  >
                    Profile
                  </Menu.Item>
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
      </Flex>
    </nav>
  );
}
