"use client";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./globals.css";

import {
  Center,
  ColorSchemeScript,
  createTheme,
  Flex,
  Loader,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { User } from "@prisma/client";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { auth } from "../../firebase";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";
import NavBar from "./_components/NavBar";
import UserContext from "./_contexts/UserContext";
import useUser from "./_hooks/useUser";
import store from "./store";

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
  const { getUserByUid } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const routesWithoutNav = ["/signup", "/login"];

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        const user = await getUserByUid({ firebaseUid: firebaseUser.uid });
        setUser(user);

        if (pathname === "/login") {
          router.push("/dashboard"); // If the user logs in, navigate to dashboard
        }
        setLoading(false);
      } else {
        // Only navigate if not on signup or login page
        if (!routesWithoutNav.includes(pathname)) {
          router.push("/login");
        }
        setLoading(false);
      }
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
                <UserContext.Provider
                  value={{ firebaseUser, setFirebaseUser, user, setUser }}
                >
                  <Provider store={store}>
                    {!routesWithoutNav.includes(pathname) && <NavBar />}
                    {children}
                  </Provider>
                </UserContext.Provider>
              )}
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
