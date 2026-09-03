import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { fontClassNames } from "./fonts";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClassNames}>
      <body className="bg-paper text-ink min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
