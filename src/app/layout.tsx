import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode, StrictMode } from "react";
import Header from "@/components/Header";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL),
  title: "Tic-tac-toe | Multiplayer",
  description: "Play tic-tac-toe with your friends online!",
  keywords: [
    "Rutger Pronk",
    "Rutger",
    "Pronk",
    "tic-tac-toe",
    "tic-tac-toe multiplayer",
    "multiplayer",
    "online",
    "game",
  ],
  openGraph: {
    title: "Tic-tac-toe | Multiplayer",
    description: "Play tic-tac-toe with your friends online!",
    siteName: "Tic-tac-toe | Multiplayer",
    type: "website",
    locale: "en",
    url: new URL(process.env.BASE_URL),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StrictMode>
          <div className={"min-h-screen grid grid-rows-[auto_1fr]"}>
            <Header />
            {children}
          </div>
        </StrictMode>
      </body>
    </html>
  );
}
