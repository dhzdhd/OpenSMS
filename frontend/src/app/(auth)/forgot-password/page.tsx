"use client";

import LogoImage from "@/components/auth/Logo";
import { Toaster } from "@/components/ui/toaster";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  // TODO: Prevent tauri apps from accessing this (web only)
  // TODO: Add custom email (https://payloadcms.com/docs/authentication/config#forgot-password)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <ForgotPasswordForm />
        <div className="hidden bg-muted lg:block max-h-screen">
          <LogoImage />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
