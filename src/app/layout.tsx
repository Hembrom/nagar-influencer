import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grow My Influence — Brand & Creator Campaigns",
  description:
    "Book verified influencer campaigns for your brand, or grow as a creator on Grow My Influence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans text-foreground">{children}</body>
    </html>
  );
}
