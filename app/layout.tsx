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
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-title" content="TYA-SRMAP" />
      <meta name="mobile-web-app-fullscreen" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-title" content="TYA-SRMAP" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <link rel="apple-touch-icon" sizes="180x180" href="/Icon-180.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2048-2732.jpeg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2732-2048.jpeg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1668-2388.jpeg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2388-1668.jpeg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1536-2048.jpeg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2048-1536.jpeg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1488-2266.jpeg" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2266-1488.jpeg" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1640-2360.jpeg" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2360-1640.jpeg" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1668-2224.jpeg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2224-1668.jpeg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1620-2160.jpeg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2160-1620.jpeg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1290-2796.jpeg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2796-1290.jpeg" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1179-2556.jpeg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2556-1179.jpeg" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1284-2778.jpeg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2778-1284.jpeg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1170-2532.jpeg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2532-1170.jpeg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1125-2436.jpeg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2436-1125.jpeg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1242-2688.jpeg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2688-1242.jpeg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-828-1792.jpeg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1792-828.jpeg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1242-2208.jpeg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-2208-1242.jpeg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-750-1334.jpeg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1334-750.jpeg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-640-1136.jpeg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-1136-640.jpeg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2048-2732.jpeg" media="(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2732-2048.jpeg" media="(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1668-2388.jpeg" media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2388-1668.jpeg" media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1536-2048.jpeg" media="(prefers-color-scheme: dark) and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2048-1536.jpeg" media="(prefers-color-scheme: dark) and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1488-2266.jpeg" media="(prefers-color-scheme: dark) and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2266-1488.jpeg" media="(prefers-color-scheme: dark) and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1640-2360.jpeg" media="(prefers-color-scheme: dark) and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2360-1640.jpeg" media="(prefers-color-scheme: dark) and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1668-2224.jpeg" media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2224-1668.jpeg" media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1620-2160.jpeg" media="(prefers-color-scheme: dark) and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2160-1620.jpeg" media="(prefers-color-scheme: dark) and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1290-2796.jpeg" media="(prefers-color-scheme: dark) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2796-1290.jpeg" media="(prefers-color-scheme: dark) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1179-2556.jpeg" media="(prefers-color-scheme: dark) and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2556-1179.jpeg" media="(prefers-color-scheme: dark) and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1284-2778.jpeg" media="(prefers-color-scheme: dark) and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2778-1284.jpeg" media="(prefers-color-scheme: dark) and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1170-2532.jpeg" media="(prefers-color-scheme: dark) and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2532-1170.jpeg" media="(prefers-color-scheme: dark) and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1125-2436.jpeg" media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2436-1125.jpeg" media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1242-2688.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2688-1242.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-828-1792.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1792-828.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1242-2208.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-2208-1242.jpeg" media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-750-1334.jpeg" media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1334-750.jpeg" media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-640-1136.jpeg" media="(prefers-color-scheme: dark) and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      <link rel="apple-touch-startup-image" href="/ios-splash-screens/apple-splash-dark-1136-640.jpeg" media="(prefers-color-scheme: dark) and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
