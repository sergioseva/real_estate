"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { WhatsAppButton } from "./whatsapp-button";
import type { ReactNode } from "react";

export function PublicShell({
  children,
  footer,
  whatsappNumber,
}: {
  children: ReactNode;
  footer: ReactNode;
  whatsappNumber: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      {footer}
      <WhatsAppButton phoneNumber={whatsappNumber} />
    </>
  );
}
