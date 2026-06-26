import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "逸马连锁成熟度诊断",
  description: "基于逸马22年连锁咨询方法论，9大维度全面评估连锁体系成熟度。免费诊断，15-20分钟出报告。",
  openGraph: {
    title: "逸马连锁成熟度诊断 - 免费评估你的连锁体系",
    description: "9大维度全面评估你的连锁体系成熟度，15-20分钟完成，即时出报告。3,000+企业已体验。",
    url: "https://yima777.cn",
    siteName: "逸马诊断",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "https://yima777.cn/api/og", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
