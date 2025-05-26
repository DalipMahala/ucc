import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/assets/img/favicon.svg', // Path must start with "/"
  },
};

// Optimized font loading - only load essential weights initially
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // Only load these weights initially
  weight: ['400', '600'], // Regular and SemiBold
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ['400', '600'], // Regular and SemiBold
  display: 'swap',
});
// export const metadata: Metadata = {
//   title: "UC Cricket - Live Scores, IPL 2025, T20, ODI, Test News &amp; Stats",
//   description: "Stay updated with UC Cricket live cricket scores, match schedules, news, stats, and videos on UcCricket.live. Follow all the action from IPL, T20 World Cup, and your favorite cricket tournaments.",
//   robots: "nofollow, noindex",
//   alternates: {
//     canonical: "https://uccricket.live/",
//   },
// };


const notoSansDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/NotoSansDisplay-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansDisplay-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-noto-sans-display',
  preload: true,
})





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

       <head>
        {/* ✅ Preload local fonts manually */}
        <link rel="preload" href="/fonts/NotoSansDisplay-Thin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NotoSansDisplay-Black.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      
      <body
        className={` ${notoSansDisplay.variable} font-sans   ${geistSans.variable} ${geistMono.variable} antialiased`} 
      >
        {/* {children} */}
        {/* <WebSocketProvider> */}
          {children}
        {/* </WebSocketProvider> */}
        
      </body>
      
    </html>
  );
}
