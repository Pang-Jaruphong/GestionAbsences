"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { mockDashboardStats } from "@/lib/mocks/dashboard";
import { useAbsences } from "@/lib/hooks/useAbsences";
import { computeDashboardAbsenceStats } from "@/lib/services/absences.stats";

export default function DashboardPage() {
  const { absences } = useAbsences();
  const absenceStats = computeDashboardAbsenceStats(absences);
  const stats = mockDashboardStats();

  const kpis = absenceStats;
  const absSplit = absenceStats.split;

  const total = absSplit.unjustified + absSplit.justified + absSplit.late;
  const unjustifiedPct =
    total === 0 ? 0 : Math.round((absSplit.unjustified / total) * 100);
  const justifiedPct =
    total === 0 ? 0 : Math.round((absSplit.justified / total) * 100);
  const latePct = Math.max(0, 100 - unjustifiedPct - justifiedPct);

  return (
    <div className="container-fluid py-4">
      <PageHeader title="Dashboard" subtitle="Vue d'ensemble" />

      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon="bi-x-octagon"
            label="Absences injustifiées"
            value={`${kpis.unjustifiedHours} h`}
            tone="danger"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon="bi-check2-circle"
            label="Absences justifiées"
            value={`${kpis.justifiedHours} h`}
            tone="success"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon="bi-clock-history"
            label="Retards"
            value={`${kpis.latePeriods} périodes`}
            tone="warning"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon="bi-people"
            label="Étudiants"
            value={`${kpis.studentsCount} étudiants`}
          />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-7">
          <div className="card app-card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Absence injustifiées - justifiées / retard
              </h5>

              <div className="text-muted-soft small mb-2">
                Absence injustifiées
              </div>
              <div className="progress" style={{ height: 14 }}>
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${unjustifiedPct}%` }}
                />
                <div
                  className="progress-bar"
                  style={{ width: `${justifiedPct}%`, background: "#00d26a" }}
                />
                <div
                  className="progress-bar bg-warning"
                  style={{ width: `${latePct}%` }}
                />
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <span className="badge text-bg-danger">Injustifiées</span>
                <span className="badge" style={{ background: "#00d26a" }}>
                  Justifiées
                </span>
                <span className="badge text-bg-warning">Retard</span>
              </div>

              <div className="card app-card mt-4">
                <div className="card-body">
                  <h6 className="mb-3">Alertes critiques</h6>
                  {absenceStats.alerts.length === 0 ? (
                    <div className="text-muted-soft small">
                      Aucune alerte critique pour le moment.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {absenceStats.alerts.map((a) => (
                        <div
                          key={`${a.title}-${a.detail}`}
                          className="rounded-3 p-3"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div className="fw-semibold">{a.title}</div>
                          <div className="text-muted-soft small">
                            {a.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card app-card h-100">
            <div className="card-body d-flex align-items-center justify-content-center">
              {/* Donut placeholder (ready to be replaced by a chart library once real data is integrated) */}
              <div
                className="rounded-circle"
                style={{
                  width: 260,
                  height: 260,
                  background: `conic-gradient(#dc3545 0 ${unjustifiedPct}%, #00d26a ${unjustifiedPct}% ${unjustifiedPct + justifiedPct}%, #ffc107 ${unjustifiedPct + justifiedPct}% 100%)`,
                }}
                aria-label="Répartition absences"
                title="Répartition absences"
              >
                <div
                  className="rounded-circle"
                  style={{
                    width: 130,
                    height: 130,
                    background: "var(--app-bg)",
                    position: "relative",
                    top: 65,
                    left: 65,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* keep the existing stats mock in the bundle (future wiring) */}
      <div className="visually-hidden">
        {stats.avgAttendance}
        {stats.absences30d}
        {stats.classesCount}
        {stats.activeProjects}
      </div>
    </div>
  );
}
