import { isBrowser, safeJsonParse } from "@/lib/utils/storage";
import { mockAbsences, type AbsenceRecord } from "@/lib/mocks/absences";
import { emitAbsencesChanged } from "@/lib/hooks/useAbsences";

const STORAGE_KEY = "absencenext.absences.v1";

type Store = {
  overrides: Record<string, Partial<AbsenceRecord> & { id: string }>;
  deleted: string[];
};

function loadStore(): Store {
  if (!isBrowser()) return { overrides: {}, deleted: [] };
  return (
    safeJsonParse<Store>(window.localStorage.getItem(STORAGE_KEY)) ?? {
      overrides: {},
      deleted: [],
    }
  );
}

function saveStore(store: Store) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function listAbsences(): AbsenceRecord[] {
  const store = loadStore();
  const base = mockAbsences.filter((a) => !store.deleted.includes(a.id));
  return base.map((a) => ({ ...a, ...(store.overrides[a.id] ?? {}) }));
}

export function upsertAbsence(absence: AbsenceRecord) {
  const store = loadStore();
  // We store full record as override to keep it simple.
  store.overrides[absence.id] = absence;
  saveStore(store);
  emitAbsencesChanged();
}

export function patchAbsence(id: string, patch: Partial<AbsenceRecord>) {
  const store = loadStore();
  const current = store.overrides[id] ?? ({ id } as any);
  store.overrides[id] = { ...current, ...patch, id };
  saveStore(store);
  emitAbsencesChanged();
}

export function deleteAbsence(id: string) {
  const store = loadStore();
  if (!store.deleted.includes(id)) store.deleted.push(id);
  delete store.overrides[id];
  saveStore(store);
  emitAbsencesChanged();
}

export function clearAbsenceStore() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
