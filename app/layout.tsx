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
  description: "基于逸马22年连锁咨询方法论，9大维度全面评估连锁体系成熟度。3,000+会员企业验证，免费诊断。",
  openGraph: {
    title: "逸马连锁成熟度诊断",
    description: "9大维度全面评估你的连锁体系成熟度，30分钟出报告，免费。",
    url: "https://yima777.cn",
    siteName: "逸马诊断",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "https://yima777.cn/api/og?score=88&level=领先型", width: 1200, height: 630 }],
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
