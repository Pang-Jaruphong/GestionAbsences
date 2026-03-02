"use client";

import { useMemo, useState } from "react";

import type {
  ProjectAttendance,
  ProjectAttendanceCell,
  ProjectStudent,
} from "@/lib/types/projects";
import { formatDateShort } from "@/lib/utils/dates";
import { hasPermission } from "@/lib/services/permissions";
import { saveAttendanceOverride } from "@/lib/services/projects";

type Update = {
  studentId: string;
  date: string;
  absent: boolean;
  comment?: string;
};

type Props = {
  attendance: ProjectAttendance;
  onChange: (next: ProjectAttendance) => void;
};

function key(studentId: string, date: string) {
  return `${studentId}__${date}`;
}

function computeStudentAbsences(
  student: ProjectStudent,
  dates: string[],
  cellsByKey: Record<string, ProjectAttendanceCell>,
) {
  let absences = 0;
  for (const d of dates) {
    if (cellsByKey[key(student.id, d)]?.absent) absences++;
  }
  return absences;
}

export function AttendanceMatrix({ attendance, onChange }: Props) {
  const canWrite = hasPermission("projects:write");

  const cellsByKey = useMemo(() => {
    const dict: Record<string, ProjectAttendanceCell> = {};
    for (const c of attendance.cells) dict[key(c.studentId, c.date)] = c;
    return dict;
  }, [attendance.cells]);

  const [commentDraft, setCommentDraft] = useState("");
  const [commentTarget, setCommentTarget] = useState<{
    studentId: string;
    date: string;
  } | null>(null);

  const totals = useMemo(() => {
    const totalSlots = attendance.students.length * attendance.dates.length;
    const totalAbsences = attendance.cells.reduce(
      (acc, c) => acc + (c.absent ? 1 : 0),
      0,
    );
    const attendanceRate =
      totalSlots === 0
        ? 100
        : Math.round(((totalSlots - totalAbsences) / totalSlots) * 100);
    return { totalSlots, totalAbsences, attendanceRate };
  }, [attendance]);

  const impactTone =
    totals.attendanceRate >= 95
      ? "bg-success"
      : totals.attendanceRate >= 90
        ? "bg-warning"
        : "bg-danger";

  function applyUpdate(update: Update) {
    const nextCells = attendance.cells.map((c) => {
      if (c.studentId === update.studentId && c.date === update.date) {
        return { ...c, absent: update.absent, comment: update.comment };
      }
      return c;
    });

    // if the cell didn't exist (edge case), add it
    const exists = nextCells.some(
      (c) => c.studentId === update.studentId && c.date === update.date,
    );
    const finalCells = exists
      ? nextCells
      : [
          ...nextCells,
          {
            studentId: update.studentId,
            date: update.date,
            absent: update.absent,
            comment: update.comment,
          },
        ];

    // persist (for locally created projects; harmless for mock projects)
    saveAttendanceOverride(
      attendance.projectId,
      update.studentId,
      update.date,
      {
        absent: update.absent,
        comment: update.comment,
      },
    );

    onChange({ ...attendance, cells: finalCells });
  }

  function openComment(studentId: string, date: string) {
    const cell = cellsByKey[key(studentId, date)];
    setCommentDraft(cell?.comment ?? "");
    setCommentTarget({ studentId, date });
  }

  function saveComment() {
    if (!commentTarget) return;
    const cell = cellsByKey[key(commentTarget.studentId, commentTarget.date)];
    applyUpdate({
      studentId: commentTarget.studentId,
      date: commentTarget.date,
      absent: cell?.absent ?? false,
      comment: commentDraft.trim() || undefined,
    });
    setCommentTarget(null);
  }

  function cellClass(absent: boolean) {
    if (!absent) return "bg-success-subtle";
    return "bg-danger-subtle";
  }

  return (
    <div className="card app-card">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <h3 className="h6 mb-1">Absences par projet</h3>
            <div className="text-muted-soft small">
              Lignes = élèves • Colonnes = dates • Coche = absent
            </div>
          </div>
          <div style={{ minWidth: 220 }}>
            <div className="d-flex align-items-center justify-content-between small mb-1">
              <span className="text-muted-soft">Présence projet</span>
              <span className="text-muted-soft">{totals.attendanceRate}%</span>
            </div>
            <div className="progress" style={{ height: 8 }}>
              <div
                className={`progress-bar ${impactTone}`}
                style={{ width: `${totals.attendanceRate}%` }}
              />
            </div>
            <div className="text-muted-soft small mt-1">
              Absences: {totals.totalAbsences} / {totals.totalSlots}
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3" style={{ maxHeight: 520 }}>
          <table className="table table-sm table-hover align-middle app-table mb-0">
            <thead
              className="sticky-top"
              style={{ background: "rgba(11,18,32,0.9)" }}
            >
              <tr>
                <th style={{ minWidth: 220 }}>Élève</th>
                {attendance.dates.map((d) => (
                  <th
                    key={d}
                    className="text-center"
                    style={{ minWidth: 52 }}
                    title={d}
                  >
                    {formatDateShort(d)}
                  </th>
                ))}
                <th className="text-end" style={{ minWidth: 90 }}>
                  Abs.
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.students.map((s) => {
                const abs = computeStudentAbsences(
                  s,
                  attendance.dates,
                  cellsByKey,
                );
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="fw-semibold">
                        {s.lastName} {s.firstName}
                      </div>
                      <div className="text-muted-soft small">
                        {s.classGroup}
                      </div>
                    </td>
                    {attendance.dates.map((d) => {
                      const c = cellsByKey[key(s.id, d)];
                      const absent = Boolean(c?.absent);
                      const hasComment = Boolean(c?.comment);

                      return (
                        <td
                          key={d}
                          className={`text-center ${cellClass(absent)}`}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              checked={absent}
                              disabled={!canWrite}
                              onChange={(e) => {
                                applyUpdate({
                                  studentId: s.id,
                                  date: d,
                                  absent: e.target.checked,
                                  comment: c?.comment,
                                });
                              }}
                              title={canWrite ? "Absent ?" : "Lecture seule"}
                            />
                            <button
                              type="button"
                              className={`btn btn-sm ${hasComment ? "btn-outline-warning" : "btn-outline-secondary"}`}
                              disabled={!canWrite && !hasComment}
                              onClick={() => openComment(s.id, d)}
                              title={
                                hasComment
                                  ? "Voir / éditer commentaire"
                                  : "Ajouter commentaire"
                              }
                              style={{ padding: "0.05rem 0.35rem" }}
                            >
                              <i className="bi bi-chat-left-text" />
                            </button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-end fw-semibold">{abs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!canWrite ? (
          <div className="text-muted-soft small mt-2">
            Mode lecture seule (permissions).
          </div>
        ) : null}
      </div>

      {commentTarget ? (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content bg-dark border"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Justification / commentaire</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setCommentTarget(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="text-muted-soft small mb-2">
                  {commentTarget.studentId} • {commentTarget.date}
                </div>
                <textarea
                  className="form-control bg-transparent"
                  rows={4}
                  placeholder="Ex: Certificat médical, maladie, rendez-vous…"
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setCommentTarget(null)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveComment}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
