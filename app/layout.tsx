import type { Metadata } from "next";
import './globals.css';
import { providers } from './provider';

export const metadata: Metadata = {
  title: "EditSync",
  description: "Smart Content Editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <providers>{children}</providers>
      </body>
    </html>
  );
}
