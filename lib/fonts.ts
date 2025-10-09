import { Geist, Major_Mono_Display } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const majorMono = Major_Mono_Display({
  variable: "--font-major-mono",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});
