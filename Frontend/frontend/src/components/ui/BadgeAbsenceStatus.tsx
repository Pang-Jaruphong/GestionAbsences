import type { AbsenceStatus } from "@/lib/mocks/absences";

const map: Record<
  AbsenceStatus,
  { label: string; className: string; icon: string }
> = {
  justifiee: {
    label: "Justifiée",
    className: "text-bg-success",
    icon: "bi-check-circle",
  },
  non_justifiee: {
    label: "Non justifiée",
    className: "text-bg-danger",
    icon: "bi-x-circle",
  },
  retard: {
    label: "Retard",
    className: "text-bg-warning",
    icon: "bi-clock-history",
  },
};

export function BadgeAbsenceStatus({ status }: { status: AbsenceStatus }) {
  const cfg = map[status];
  return (
    <span
      className={`badge ${cfg.className} d-inline-flex align-items-center gap-1`}
    >
      <i className={`bi ${cfg.icon}`} />
      <span>{cfg.label}</span>
    </span>
  );
}
