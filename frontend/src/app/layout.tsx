import type { Metadata } from "next";
import { Montserrat, Open_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "YouthCamping Traveler Platform",
  description: "Adventure Travel portal by YouthCamping.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${openSans.variable} ${dancingScript.variable} font-body antialiased selection:bg-primary selection:text-white`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
