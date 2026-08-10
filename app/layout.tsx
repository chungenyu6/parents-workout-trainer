import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "自在動一點｜爸媽的運動紀錄",
  description: "用安全、規律、做得到的居家肌力活動，累積爸媽的身體信任。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${notoSans.variable} ${notoSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
