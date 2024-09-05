import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globals.css";


// Suppress console.warn
console.warn = () => {};

// Suppress console.error
console.error = () => {};

export const metadata: Metadata = {
  title: "TYA-SRMAP",
  description: "A Place to track your Attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
      <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
