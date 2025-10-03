"use client";
import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";
import NavBar from "./_components/NavBar";
import UserProvider from "./_components/UserProvider";
import { store } from "./_redux/store";
import "./globals.css";

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
    DatePicker: {
      styles: {
        day: {
          "&[data-selected]": {
            backgroundColor: "#FC6288",
            color: "white",
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
  const pathname = usePathname();
  const routesWithoutNav = ["/signup", "/login"];

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
              <Provider store={store}>
                <UserProvider>
                  {!routesWithoutNav.includes(pathname) && <NavBar />}
                  {children}
                </UserProvider>
              </Provider>
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
