"use client";
import { Notifications } from "@mantine/notifications";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import {
  Center,
  ColorSchemeScript,
  Flex,
  Loader,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";
import UserContext from "./_contexts/UserContext";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import useUser from "./_hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./_components/NavBar";

const theme = createTheme({
  components: {
    Button: {
      styles: {
        root: {
          '&[data-variant="primary"]': {
            backgroundImage:
              "linear-gradient(to bottom right, #FF9C67, #FC6288)",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const routesWithNav = ["/dashboard"];

  const [firebaseUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);

        const user = await getUser({ firebaseUid: firebaseUser.uid });
        setUserId(user.id);
      } else {
        // if user is on a route that requires auth and is not logged in, redirect to login
        if (routesWithNav.includes(pathname)) {
          router.push("/login");
        }
      }
      setLoading(false);
    });
  }, [getUser, pathname, router]);

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <RootStyleRegistry>
          <MantineEmotionProvider>
            <MantineProvider stylesTransform={emotionTransform} theme={theme}>
              <Notifications />
              {loading ? (
                <Flex h="100vh" align="center" justify="center">
                  <Center mt={10}>
                    <Loader mr={10} size="xs" />
                    Loading...
                  </Center>
                </Flex>
              ) : (
                <UserContext.Provider value={{ firebaseUser, userId }}>
                  {routesWithNav.includes(pathname) && <NavBar />}
                  {children}
                </UserContext.Provider>
              )}
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
