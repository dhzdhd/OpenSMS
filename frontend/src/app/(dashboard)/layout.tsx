"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, AuthState, useAuth } from "@/components/AuthProvider";
import Template from "./template";
import { useEffect, useState } from "react";
import AuthError from "@/components/AuthError";
import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-row min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="h-16 absolute w-full flex justify-between p-3 border border-b-1">
            <div className="flex items-center justify-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <div className="py-16">
                    <Navbar />
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="flex text-xl items-center justify-center">
                OpenSMS
              </h1>
            </div>
            <ThemeToggle />
          </header>
          <aside className="hidden md:flex flex-col min-w-56 max-w-56 w-56 mt-16 border border-t-0 py-2">
            <Navbar />
          </aside>
          <AuthProvider>
            <Template key="dashboard">{children}</Template>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
