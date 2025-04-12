// import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { WebSocketProvider } from "./components/WebSocketProvider";
import GoogleAnalytics from "./components/GoogleAnalytics";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
// export const metadata: Metadata = {
//   title: "UC Cricket - Live Scores, IPL 2025, T20, ODI, Test News &amp; Stats",
//   description: "Stay updated with UC Cricket live cricket scores, match schedules, news, stats, and videos on UcCricket.live. Follow all the action from IPL, T20 World Cup, and your favorite cricket tournaments.",
//   robots: "nofollow, noindex",
//   alternates: {
//     canonical: "https://uccricket.live/",
//   },
// };



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* {children} */}
        {/* <WebSocketProvider> */}
          {children}
        {/* </WebSocketProvider> */}
        <GoogleAnalytics />
      </body>
      
    </html>
  );
}
