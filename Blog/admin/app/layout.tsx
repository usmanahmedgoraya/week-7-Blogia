import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/Components/Specific_Component/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Theme } from "@/Theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel ",
  description: "This is admin Panel of Blogia App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <html lang="en">
        <body className={`${inter.className} container`}>
          <Sidebar />
          {children}</body>
      </html>
    </ThemeProvider>
  );
}
