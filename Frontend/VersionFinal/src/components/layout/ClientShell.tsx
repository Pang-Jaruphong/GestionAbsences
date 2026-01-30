"use client";

import { AppShell } from "@/components/layout/AppShell";

type Props = {
  children: React.ReactNode;
};

export function ClientShell({ children }: Props) {
  return <AppShell>{children}</AppShell>;
}
