import type { ProjectStatus } from "@/lib/types/projects";

const statusMap: Record<
  ProjectStatus,
  { label: string; className: string; icon: string }
> = {
  en_cours: {
    label: "En cours",
    className: "text-bg-primary",
    icon: "bi-play-circle",
  },
  termine: {
    label: "Terminé",
    className: "text-bg-success",
    icon: "bi-check-circle",
  },
  en_retard: {
    label: "En retard",
    className: "text-bg-danger",
    icon: "bi-exclamation-octagon",
  },
};

export function BadgeStatus({ status }: { status: ProjectStatus }) {
  const cfg = statusMap[status];
  return (
    <span
      className={`badge ${cfg.className} d-inline-flex align-items-center gap-1`}
    >
      <i className={`bi ${cfg.icon}`} />
      <span>{cfg.label}</span>
    </span>
  );
}
