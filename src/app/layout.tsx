import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { AppWalletProvider } from "@/components/wallet-provider";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OBSIDIAN PAY — Global Payroll on Solana",
  description:
    "Pay distributed teams in Solana USDC. Report in their native currency. Powered by Dodo Payments billing and Solana devnet settlement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${bodyFont.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
