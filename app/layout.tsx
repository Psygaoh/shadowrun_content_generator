import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { geistSans, majorMono } from "@/lib/fonts";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Shadowrun Content Creator Assistant",
  description:
    "Generate Shadowrun-ready NPCs, locations, and ambiences in seconds with a cyberpunk-focused toolkit for game masters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${majorMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="sr4"
          themes={["sr4", "sr5", "sr6", "darkAnarchy", "matrix", "lightAnarchy"]}
          value={{
            sr4: "theme-sr4",
            sr5: "theme-sr5",
            sr6: "theme-sr6",
            darkAnarchy: "theme-darkAnarchy",
            matrix: "theme-matrix",
            lightAnarchy: "theme-lightAnarchy",
          }}
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
