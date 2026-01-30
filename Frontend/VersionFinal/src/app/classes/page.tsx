"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

import { mockClasses, type ClassSummary } from "@/lib/mocks/absences";

export default function ClassesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockClasses
      .filter((c) =>
        q ? `${c.name} ${c.teacher}`.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search]);

  const totals = useMemo(() => {
    const students = filtered.reduce((acc, c) => acc + c.studentsCount, 0);
    const today = filtered.reduce((acc, c) => acc + c.absencesToday, 0);
    const week = filtered.reduce((acc, c) => acc + c.absencesWeek, 0);
    const alerts = filtered.reduce((acc, c) => acc + c.alerts, 0);
    return { students, today, week, alerts };
  }, [filtered]);

  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Classes"
        subtitle="Aperçu fictif (UI finale). Connexion API à venir."
        right={
          <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm" style={{ width: 320 }}>
              <span className="input-group-text bg-transparent text-muted-soft">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control bg-transparent"
                placeholder="Rechercher une classe ou un prof…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="badge text-bg-secondary d-inline-flex align-items-center gap-1">
              <i className="bi bi-database" />
              <span>Données fictives</span>
            </span>
          </div>
        }
      />

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Élèves</div>
              <div className="display-6 fw-bold mt-1">{totals.students}</div>
              <div className="text-muted-soft small">
                sur les classes affichées
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Absences aujourd’hui</div>
              <div className="display-6 fw-bold mt-1">{totals.today}</div>
              <div className="text-muted-soft small">toutes classes</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Absences (7j)</div>
              <div className="display-6 fw-bold mt-1">{totals.week}</div>
              <div className="text-muted-soft small">tendance</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Alertes</div>
              <div className="display-6 fw-bold mt-1 text-warning">
                {totals.alerts}
              </div>
              <div className="text-muted-soft small">à surveiller</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card app-card mt-3">
        <div className="card-body">
          {filtered.length === 0 ? (
            <EmptyState
              title="Aucune classe"
              description="Aucune classe ne correspond à la recherche."
              icon="bi-people"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle app-table mb-0">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Prof référent</th>
                    <th className="text-end">Élèves</th>
                    <th className="text-end">Abs. (aujourd’hui)</th>
                    <th className="text-end">Abs. (7j)</th>
                    <th className="text-end">Alertes</th>
                    <th className="text-end">MAJ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: ClassSummary) => (
                    <tr key={c.id}>
                      <td className="fw-semibold">{c.name}</td>
                      <td className="text-muted-soft">{c.teacher}</td>
                      <td className="text-end">{c.studentsCount}</td>
                      <td className="text-end">{c.absencesToday}</td>
                      <td className="text-end">{c.absencesWeek}</td>
                      <td className="text-end">
                        {c.alerts > 0 ? (
                          <span className="badge text-bg-warning d-inline-flex align-items-center gap-1">
                            <i className="bi bi-exclamation-triangle" />
                            <span>{c.alerts}</span>
                          </span>
                        ) : (
                          <span className="text-muted-soft">0</span>
                        )}
                      </td>
                      <td className="text-end text-muted-soft">
                        {c.lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-xl-6">
          <div className="card app-card h-100">
            <div className="card-body">
              <h3 className="h6 mb-2">Alertes (fictif)</h3>
              <div className="text-muted-soft small">
                Exemple: élèves avec absences répétées / justificatifs
                manquants.
              </div>
              <ul className="mt-3 mb-0 text-muted-soft small">
                <li>2M-DESIGN: 2 élèves à +3 absences sur 7 jours</li>
                <li>2M-INFO A: 1 justificatif manquant depuis 48h</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="card app-card h-100">
            <div className="card-body">
              <h3 className="h6 mb-2">Répartition (fictif)</h3>
              <div className="text-muted-soft small mb-3">
                Placeholder du futur graphique (barres / donut).
              </div>
              <div className="d-flex flex-column gap-2">
                {filtered.map((c) => {
                  const max = Math.max(
                    ...filtered.map((x) => x.absencesWeek),
                    1,
                  );
                  const pct = Math.round((c.absencesWeek / max) * 100);
                  return (
                    <div key={c.id}>
                      <div className="d-flex align-items-center justify-content-between small mb-1">
                        <span className="text-muted-soft">{c.name}</span>
                        <span className="text-muted-soft">
                          {c.absencesWeek} abs.
                        </span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar bg-info"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
