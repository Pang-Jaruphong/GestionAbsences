"use client";

import { useEffect, useMemo, useState } from "react";

import type { AbsenceRecord } from "@/lib/mocks/absences";
import { listAbsences } from "@/lib/services/absences.local";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("absencenext:absences", handler as any);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("absencenext:absences", handler as any);
  };
}

export function emitAbsencesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("absencenext:absences"));
}

export function useAbsences() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return subscribe(() => setVersion((v) => v + 1));
  }, []);

  const absences: AbsenceRecord[] = useMemo(() => listAbsences(), [version]);

  return { absences };
}
