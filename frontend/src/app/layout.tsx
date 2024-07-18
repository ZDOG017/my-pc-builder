import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Сборка компьютера с помощью ИИ - QuryltAI",
  description: "Наше приложение от QuryltAI использует искусственный интеллект для помощи пользователям в сборке компьютеров, подбирая оптимальные компоненты на основе заданного бюджета и предпочтений.",
  keywords: "сборка компьютера, искусственный интеллект, ПК, подбор компонентов, бюджетные сборки, высокопроизводительные ПК, ПК для игр, сборка ПК на заказ",
  authors: [{ name: "QuryltAI" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Сборка компьютера с помощью ИИ - QuryltAI",
    description: "Используйте наше приложение для создания идеального компьютера с помощью ИИ. Мы подберем лучшие компоненты на основе вашего бюджета и потребностей.",
    url: "https://my-pc-builder.vercel.app",
    siteName: "QuryltAI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title?.toString()}</title>
        <meta name="description" content={metadata.description || ""} />
        <meta name="keywords" content={Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords || ""} />
        <meta property="og:title" content={metadata.openGraph?.title?.toString() || ""} />
        <meta property="og:description" content={metadata.openGraph?.description || ""} />
        <meta property="og:url" content={metadata.openGraph?.url?.toString() || ""} />
        <meta property="og:site_name" content={metadata.openGraph?.siteName || ""} />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics/>
        </body>
    </html>
  );
}