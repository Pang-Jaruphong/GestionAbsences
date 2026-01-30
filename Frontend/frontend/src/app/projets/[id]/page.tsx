"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { PageHeader } from "@/components/ui/PageHeader";
import { AlertInline } from "@/components/ui/AlertInline";
import { EmptyState } from "@/components/ui/EmptyState";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { AttendanceMatrix } from "@/components/projects/AttendanceMatrix";

import type { Project, ProjectAttendance } from "@/lib/types/projects";
import {
  computeProjectImpact,
  getProject,
  getProjectAttendance,
} from "@/lib/services/projects";
import { formatDateLong } from "@/lib/utils/dates";
import { hasPermission } from "@/lib/services/permissions";

export default function ProjetDetailsPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const canRead = hasPermission("projects:read");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [attendance, setAttendance] = useState<ProjectAttendance | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        if (!canRead || !projectId) return;

        const p = await getProject(projectId);
        const a = await getProjectAttendance(projectId);

        if (!mounted) return;
        setProject(p);
        setAttendance(a);
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
  }, [projectId, canRead]);

  const impact = useMemo(
    () => (attendance ? computeProjectImpact(attendance) : null),
    [attendance],
  );

  if (!canRead) {
    return (
      <div className="container-fluid py-4">
        <PageHeader title="Projet" subtitle="Accès restreint" />
        <AlertInline
          tone="warning"
          title="Accès restreint"
          message="Vous n’avez pas la permission de consulter les projets."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <PageHeader title="Projet" subtitle="Chargement…" />
        <div className="card app-card">
          <div className="card-body">
            <div className="placeholder-glow">
              <div className="placeholder col-7 mb-2" />
              <div className="placeholder col-9" />
              <div className="placeholder col-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <PageHeader title="Projet" subtitle="Erreur" />
        <AlertInline tone="danger" title="Erreur" message={error} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-fluid py-4">
        <PageHeader title="Projet" subtitle="Introuvable" />
        <EmptyState
          title="Projet introuvable"
          description="Vérifie l’URL ou retourne à la liste des projets."
          icon="bi-search"
        />
      </div>
    );
  }

  const impactPct = impact?.attendanceRate ?? 100;
  const impactTone =
    impactPct >= 95
      ? "bg-success"
      : impactPct >= 90
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className="container-fluid py-4">
      <PageHeader
        title={project.name}
        subtitle={`${project.classGroup} • ${project.teacher}`}
        right={
          <div className="d-flex align-items-center gap-2">
            <Link
              href="/projets"
              className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-2"
              aria-label="Retour à la liste des projets"
              title="Retour aux projets"
            >
              <i className="bi bi-arrow-left" />
              <span className="d-none d-md-inline">Retour</span>
            </Link>
            <BadgeStatus status={project.status} />
          </div>
        }
      />

      <div className="row g-3">
        <div className="col-12 col-xl-5">
          <div className="card app-card h-100">
            <div className="card-body">
              <h3 className="h6 mb-2">Informations générales</h3>
              <p className="text-muted-soft small mb-3">
                {project.description}
              </p>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <div className="text-muted-soft small">Début</div>
                  <div className="fw-semibold">
                    {formatDateLong(project.startDate)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-muted-soft small">Fin</div>
                  <div className="fw-semibold">
                    {formatDateLong(project.endDate)}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="d-flex align-items-center justify-content-between small mb-1">
                  <span className="text-muted-soft">Progression globale</span>
                  <span className="text-muted-soft">
                    {project.progressPercent}%
                  </span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-3">
                <div className="d-flex align-items-center justify-content-between small mb-1">
                  <span className="text-muted-soft">Impact des absences</span>
                  <span className="text-muted-soft">{impactPct}% présence</span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className={`progress-bar ${impactTone}`}
                    style={{ width: `${impactPct}%` }}
                  />
                </div>
                <div className="text-muted-soft small mt-1">
                  Absences projet: {impact?.totalAbsences ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          {attendance ? (
            <div className="card app-card h-100">
              <div className="card-body">
                <h3 className="h6 mb-2">Élèves du projet</h3>
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle app-table mb-0">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Classe</th>
                        <th className="text-end">Présence</th>
                        <th className="text-end">Absences</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.students.map((s) => {
                        const totalSlots = attendance.dates.length;
                        const abs = attendance.cells.filter(
                          (c) => c.studentId === s.id && c.absent,
                        ).length;
                        const presenceRate =
                          totalSlots === 0
                            ? 100
                            : Math.round(
                                ((totalSlots - abs) / totalSlots) * 100,
                              );
                        const tone =
                          presenceRate >= 95
                            ? "text-success"
                            : presenceRate >= 90
                              ? "text-warning"
                              : "text-danger";

                        return (
                          <tr key={s.id}>
                            <td className="fw-semibold">
                              {s.lastName} {s.firstName}
                            </td>
                            <td className="text-muted-soft">{s.classGroup}</td>
                            <td className={`text-end fw-semibold ${tone}`}>
                              {presenceRate}%
                            </td>
                            <td className="text-end">{abs}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Aucune donnée"
              description="Données d’absences indisponibles."
              icon="bi-database-x"
            />
          )}
        </div>
      </div>

      <div className="mt-3">
        {attendance ? (
          <AttendanceMatrix attendance={attendance} onChange={setAttendance} />
        ) : null}
      </div>
    </div>
  );
}
