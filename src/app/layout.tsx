import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={"min-h-screen grid grid-rows-[auto_1fr]"}>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
