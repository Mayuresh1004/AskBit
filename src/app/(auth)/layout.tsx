"use client"

import { useEffect } from "react";
import { useAuthStore } from "../../store/Auth";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hydrated, verifySession } = useAuthStore();

  useEffect(() => {
    if (hydrated) {
      verifySession();
    }
  }, [hydrated, verifySession]);

  return <>{children}</>;
}