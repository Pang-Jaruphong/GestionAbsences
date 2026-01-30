"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { BadgeAbsenceStatus } from "@/components/ui/BadgeAbsenceStatus";
import { BadgeStatus } from "@/components/ui/BadgeStatus";

import { type AbsenceRecord, type AbsenceStatus } from "@/lib/mocks/absences";
import { patchAbsence } from "@/lib/services/absences.local";
import { useAbsences } from "@/lib/hooks/useAbsences";

type StatusFilter = AbsenceStatus | "all";

export default function AbsencesPage() {
  const [search, setSearch] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { absences } = useAbsences();

  // Optimistic UI: apply immediate local overrides so the row reflects the change
  // even before the store-driven refresh rehydrates the list.
  const [optimisticStatusById, setOptimisticStatusById] = useState<
    Record<string, AbsenceStatus>
  >({});

  const classOptions = useMemo(() => {
    return Array.from(new Set(absences.map((a) => a.classGroup))).sort();
  }, [absences]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return absences
      .map((a) => {
        const optimistic = optimisticStatusById[a.id];
        return optimistic ? { ...a, status: optimistic } : a;
      })
      .filter((a) =>
        q
          ? `${a.studentName} ${a.classGroup} ${a.reason ?? ""} ${a.teacher ?? ""}`
              .toLowerCase()
              .includes(q)
          : true,
      )
      .filter((a) => (classGroup ? a.classGroup === classGroup : true))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) => {
        if (from && a.date < from) return false;
        if (to && a.date > to) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [absences, optimisticStatusById, search, classGroup, status, from, to]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const justified = filtered.filter((a) => a.status === "justifiee").length;
    const unjustified = filtered.filter(
      (a) => a.status === "non_justifiee",
    ).length;
    const late = filtered.filter((a) => a.status === "retard").length;
    return { total, justified, unjustified, late };
  }, [filtered]);

  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Absences"
        subtitle="Aperçu fictif (UI finale). Connexion API à venir."
      />

      <div className="row g-3">
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Aujourd’hui (fictif)</div>
              <div className="display-6 fw-bold mt-1">{kpis.total}</div>
              <div className="text-muted-soft small">enregistrements</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Non justifiées</div>
              <div className="display-6 fw-bold mt-1 text-danger">
                {kpis.unjustified}
              </div>
              <div className="text-muted-soft small">à traiter</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Justifiées</div>
              <div className="display-6 fw-bold mt-1 text-success">
                {kpis.justified}
              </div>
              <div className="text-muted-soft small">validées</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card app-card h-100">
            <div className="card-body">
              <div className="text-muted-soft small">Retards</div>
              <div className="display-6 fw-bold mt-1 text-warning">
                {kpis.late}
              </div>
              <div className="text-muted-soft small">à surveiller</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card app-card mt-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-12 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-transparent text-muted-soft">
                  <i className="bi bi-search" />
                </span>
                <input
                  className="form-control bg-transparent"
                  placeholder="Rechercher un élève, une classe, un prof, une raison…"
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
                <option value="all">Tous statuts</option>
                <option value="non_justifiee">Non justifiée</option>
                <option value="justifiee">Justifiée</option>
                <option value="retard">Retard</option>
              </select>
            </div>
            <div className="col-6 col-lg-1">
              <input
                className="form-control bg-transparent"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-lg-1">
              <input
                className="form-control bg-transparent"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="col-12 col-lg-1">
              <button
                type="button"
                className="btn btn-outline-light w-100"
                onClick={() => {
                  setSearch("");
                  setClassGroup("");
                  setStatus("all");
                  setFrom("");
                  setTo("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card app-card mt-3">
        <div className="card-body">
          {filtered.length === 0 ? (
            <EmptyState
              title="Aucune absence"
              description="Aucune absence ne correspond aux filtres actuels."
              icon="bi-calendar-x"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle app-table mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Élève</th>
                    <th>Classe</th>
                    <th>Statut</th>
                    <th>Projet</th>
                    <th>Prof</th>
                    <th className="text-end">Créneau</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a: AbsenceRecord) => (
                    <tr key={a.id}>
                      <td className="fw-semibold">{a.date}</td>
                      <td>{a.studentName}</td>
                      <td className="text-muted-soft">{a.classGroup}</td>
                      <td>
                        <BadgeAbsenceStatus status={a.status} />
                      </td>
                      <td>
                        {a.project ? (
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              href={`/projets/${a.project.id}`}
                              className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                            >
                              {a.project.name}
                            </Link>
                            <BadgeStatus status={a.project.status} />
                          </div>
                        ) : (
                          <span className="text-muted-soft">—</span>
                        )}
                      </td>
                      <td className="text-muted-soft">{a.teacher ?? "—"}</td>
                      <td className="text-end text-muted-soft">
                        {a.startTime && a.endTime
                          ? `${a.startTime} → ${a.endTime}`
                          : "—"}
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm bg-transparent"
                          value={a.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as AbsenceStatus;
                            setOptimisticStatusById((prev) => ({
                              ...prev,
                              [a.id]: nextStatus,
                            }));

                            patchAbsence(a.id, {
                              status: nextStatus,
                            });
                          }}
                        >
                          <option value="non_justifiee">Non justifiée</option>
                          <option value="justifiee">Justifiée</option>
                          <option value="retard">Retard</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
