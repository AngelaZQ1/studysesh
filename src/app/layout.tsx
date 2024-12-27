import { Notifications } from "@mantine/notifications";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";

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
              {children}
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
