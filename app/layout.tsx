import type { Metadata } from "next";
import { inter } from "@/app/fonts";
import "./globals.css";


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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
