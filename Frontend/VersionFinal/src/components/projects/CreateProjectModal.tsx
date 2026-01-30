"use client";

import { useMemo, useState } from "react";

import type { Project, ProjectStatus } from "@/lib/types/projects";
import type { NewProjectInput } from "@/lib/services/projects.local";

const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string }> = [
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
  { value: "en_retard", label: "En retard" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewProjectInput) => Promise<Project> | Project;
};

function isIsoDate(v: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export function CreateProjectModal({ open, onClose, onCreate }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [teacher, setTeacher] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("en_cours");
  const [progressPercent, setProgressPercent] = useState(0);
  const [participants, setParticipants] = useState<
    Array<{ fullName: string; classGroup: string }>
  >([{ fullName: "", classGroup: "" }]);

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (!classGroup.trim()) return false;
    if (!teacher.trim()) return false;
    if (!isIsoDate(startDate) || !isIsoDate(endDate)) return false;
    if (endDate < startDate) return false;
    if (progressPercent < 0 || progressPercent > 100) return false;
    return true;
  }, [name, classGroup, teacher, startDate, endDate, progressPercent]);
  const validParticipantsCount = useMemo(() => {
    return participants.filter(
      (p) => p.fullName.trim().length > 0 && p.classGroup.trim().length > 0,
    ).length;
  }, [participants]);

  async function handleCreate() {
    try {
      setIsSaving(true);
      setError(null);

      const created = await onCreate({
        name,
        description,
        classGroup,
        teacher,
        startDate,
        endDate,
        status,
        progressPercent,
        participants,
      });

      // reset
      setName("");
      setDescription("");
      setClassGroup("");
      setTeacher("");
      setStartDate("");
      setEndDate("");
      setStatus("en_cours");
      setProgressPercent(0);
      setParticipants([{ fullName: "", classGroup: "" }]);

      if (created) onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div
          className="modal-content bg-dark border"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Nouveau projet</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
              disabled={isSaving}
            />
          </div>

          <div className="modal-body">
            {error ? <div className="alert alert-danger">{error}</div> : null}

            <div className="row g-2">
              <div className="col-12">
                <label className="form-label">Nom du projet</label>
                <input
                  className="form-control bg-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Projet Robotique"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control bg-transparent"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectifs, livrables, contexte…"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Classe / groupe</label>
                <input
                  className="form-control bg-transparent"
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  placeholder="Ex: 2M-INFO A"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Prof responsable</label>
                <input
                  className="form-control bg-transparent"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Ex: Mme Durand"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Début</label>
                <input
                  className="form-control bg-transparent"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Fin</label>
                <input
                  className="form-control bg-transparent"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Statut</label>
                <select
                  className="form-select bg-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">
                  Progression ({progressPercent}%)
                </label>
                <input
                  className="form-range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                />
              </div>

              <div className="col-12">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label mb-1">
                    Participants (nom + classe)
                  </label>
                  <span className="text-muted-soft small">
                    {validParticipantsCount} ajoutés
                  </span>
                </div>
                <div className="text-muted-soft small mb-2">
                  Laisse une ligne vide si tu ne veux pas ajouter de
                  participants maintenant.
                </div>

                <div className="d-flex flex-column gap-2">
                  {participants.map((p, idx) => (
                    <div key={idx} className="row g-2">
                      <div className="col-12 col-md-7">
                        <input
                          className="form-control bg-transparent"
                          placeholder="Nom complet (ex: Dupont Alice)"
                          value={p.fullName}
                          onChange={(e) => {
                            const v = e.target.value;
                            setParticipants((cur) =>
                              cur.map((x, i) =>
                                i === idx ? { ...x, fullName: v } : x,
                              ),
                            );
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-4">
                        <input
                          className="form-control bg-transparent"
                          placeholder="Classe (ex: 2M-INFO A)"
                          value={p.classGroup}
                          onChange={(e) => {
                            const v = e.target.value;
                            setParticipants((cur) =>
                              cur.map((x, i) =>
                                i === idx ? { ...x, classGroup: v } : x,
                              ),
                            );
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-1 d-flex">
                        <button
                          type="button"
                          className="btn btn-outline-light w-100"
                          title="Retirer"
                          onClick={() =>
                            setParticipants((cur) =>
                              cur.length <= 1
                                ? [{ fullName: "", classGroup: "" }]
                                : cur.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() =>
                      setParticipants((cur) => [
                        ...cur,
                        { fullName: "", classGroup: classGroup || "" },
                      ])
                    }
                  >
                    <i className="bi bi-person-plus me-2" />
                    Ajouter un participant
                  </button>
                </div>
              </div>

              {!isValid ? (
                <div className="col-12">
                  <div className="text-muted-soft small">
                    Complète les champs requis (nom, classe, prof, dates
                    valides).
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onClose}
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={!isValid || isSaving}
            >
              {isSaving ? "Création…" : "Créer le projet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
