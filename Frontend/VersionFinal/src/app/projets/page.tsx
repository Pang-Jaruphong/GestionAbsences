"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertInline } from "@/components/ui/AlertInline";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { DeleteProjectModal } from "@/components/projects/DeleteProjectModal";

import type { Project, ProjectStatus } from "@/lib/types/projects";
import {
  getProjectAttendance,
  listProjects,
  computeProjectImpact,
} from "@/lib/services/projects";
import { hasPermission } from "@/lib/services/permissions";
import { createProject, deleteProject } from "@/lib/services/projects.local";

type StatusFilter = ProjectStatus | "all";

export default function ProjetsPage() {
  const canRead = hasPermission("projects:read");
  const canWrite = hasPermission("projects:write");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [search, setSearch] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const classOptions = useMemo(() => {
    const set = new Set(projects.map((p) => p.classGroup));
    return Array.from(set).sort();
  }, [projects]);

  const [impactByProject, setImpactByProject] = useState<
    Record<string, number>
  >({});

  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        if (!canRead) {
          setProjects([]);
          return;
        }

        const result = await listProjects({
          search,
          classGroup: classGroup || undefined,
          status,
          period: { from: periodFrom || undefined, to: periodTo || undefined },
        });

        if (!mounted) return;
        setProjects(result);

        // Precompute impact (presence rate) per project
        const entries = await Promise.all(
          result.map(async (p) => {
            const att = await getProjectAttendance(p.id);
            const impact = computeProjectImpact(att);
            return [p.id, impact.attendanceRate] as const;
          }),
        );

        if (!mounted) return;
        setImpactByProject(Object.fromEntries(entries));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [search, classGroup, status, periodFrom, periodTo, canRead, refreshKey]);

  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Projets"
        subtitle="Suivi projets & impact des absences"
        right={
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setCreateOpen(true)}
              disabled={!canWrite}
            >
              <i className="bi bi-plus-lg me-2" />
              Nouveau projet
            </button>
            <span className="badge text-bg-secondary d-inline-flex align-items-center gap-1">
              <i className="bi bi-shield-check" />
              <span>
                {canWrite
                  ? "Modification"
                  : canRead
                    ? "Lecture"
                    : "Aucun accès"}
              </span>
            </span>
          </div>
        }
      />

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          const created = createProject(input);
          // refresh list + impact
          setRefreshKey((k) => k + 1);
          return created;
        }}
      />

      <DeleteProjectModal
        open={deleteOpen}
        project={deleteTarget}
        isDeleting={isDeleting}
        onClose={() => {
          if (isDeleting) return;
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={async (projectId) => {
          try {
            setIsDeleting(true);

            // custom projects => hard delete, mock/seed projects => soft delete (hidden)
            deleteProject(projectId);

            setDeleteOpen(false);
            setDeleteTarget(null);
            setRefreshKey((k) => k + 1);
          } finally {
            setIsDeleting(false);
          }
        }}
      />

      {!canRead ? (
        <AlertInline
          tone="warning"
          title="Accès restreint"
          message="Vous n’avez pas la permission de consulter les projets."
        />
      ) : null}

      {error ? (
        <div className="mt-3">
          <AlertInline tone="danger" title="Erreur" message={error} />
        </div>
      ) : null}

      <div className="card app-card mt-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent text-muted-soft">
                  <i className="bi bi-search" />
                </span>
                <input
                  className="form-control bg-transparent"
                  placeholder="Rechercher un projet, une description, un prof…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <select
                className="form-select bg-transparent"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
              >
                <option value="">Toutes les classes</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <select
                className="form-select bg-transparent"
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
              >
                <option value="all">Tous les statuts</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="en_retard">En retard</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <input
                className="form-control bg-transparent"
                type="date"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-2">
              <input
                className="form-control bg-transparent"
                type="date"
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="row g-3 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-12 col-md-6 col-xl-4">
              <div className="card app-card" aria-hidden>
                <div className="card-body">
                  <div className="placeholder-glow">
                    <div className="placeholder col-6 mb-2" />
                    <div className="placeholder col-10" />
                    <div className="placeholder col-9" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="Aucun projet trouvé"
            description="Ajuste la recherche ou les filtres pour afficher des projets."
            icon="bi-kanban"
            action={
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => {
                  setSearch("");
                  setClassGroup("");
                  setStatus("all");
                  setPeriodFrom("");
                  setPeriodTo("");
                }}
              >
                Réinitialiser
              </button>
            }
          />
        </div>
      ) : (
        <div className="row g-3 mt-1">
          {projects.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-xl-4">
              <ProjectCard
                project={p}
                impactPct={impactByProject[p.id] ?? 100}
                canDelete={canWrite}
                onDelete={(proj) => {
                  setDeleteTarget(proj);
                  setDeleteOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
