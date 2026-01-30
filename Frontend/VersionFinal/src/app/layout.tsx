import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import { ClientShell } from "@/components/layout/ClientShell";

export const metadata: Metadata = {
  title: "Gestion d'absences",
  description: "Application de gestion des absences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-bs-theme="dark">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
