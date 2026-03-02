import Link from "next/link";

import type { Project } from "@/lib/types/projects";
import { BadgeStatus } from "@/components/ui/BadgeStatus";

export function ProjectCard({
  project,
  impactPct,
  canDelete,
  onDelete,
}: {
  project: Project;
  impactPct: number;
  canDelete?: boolean;
  onDelete?: (project: Project) => void;
}) {
  const showDelete = typeof onDelete === "function";
  const isDeleteEnabled = Boolean(canDelete);
  const impactTone =
    impactPct >= 95
      ? "bg-success"
      : impactPct >= 90
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className="card app-card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="h6 mb-0">{project.name}</h3>
              <BadgeStatus status={project.status} />
            </div>
            <div className="text-muted-soft small mt-1">
              {project.classGroup} • {project.teacher}
            </div>
          </div>
        </div>

        <p className="text-muted-soft small mt-3 mb-3" style={{ flexGrow: 1 }}>
          {project.description}
        </p>

        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between small mb-1">
            <span className="text-muted-soft">Impact absences</span>
            <span className="text-muted-soft">{impactPct}% présence</span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div
              className={`progress-bar ${impactTone}`}
              style={{ width: `${impactPct}%` }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="text-muted-soft small">
            {project.startDate} → {project.endDate}
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link
              href={`/projets/${project.id}`}
              className="btn btn-sm btn-outline-light"
            >
              Voir détails
            </Link>
            {showDelete ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                title={
                  isDeleteEnabled
                    ? "Supprimer"
                    : "Suppression disponible uniquement pour les projets créés localement"
                }
                disabled={!isDeleteEnabled}
                onClick={() => {
                  if (!isDeleteEnabled) return;
                  onDelete?.(project);
                }}
              >
                <i className="bi bi-trash" />
                <span className="ms-2">Supprimer</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
