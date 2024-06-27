import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode, StrictMode } from "react";
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
