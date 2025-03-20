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
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import useUser from "./_hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./_components/NavBar";
import { User } from "@prisma/client";

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
  const routesWithoutNav = ["/signup", "/login"];

  const [firebaseUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);

        const user = await getUser({ firebaseUid: firebaseUser.uid });
        setUser(user);

        if (pathname === "/login") {
          router.push("/dashboard"); // Redirect only from login page
        }
      } else {
        if (!routesWithoutNav.includes(pathname)) {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
                <UserContext.Provider value={{ firebaseUser, user }}>
                  {!routesWithoutNav.includes(pathname) && <NavBar />}
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
