"use client";

import type { Project } from "@/lib/types/projects";

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void> | void;
  isDeleting?: boolean;
};

export function DeleteProjectModal({
  open,
  project,
  onClose,
  onConfirm,
  isDeleting,
}: Props) {
  if (!open || !project) return null;

  return (
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
            <h5 className="modal-title">Supprimer le projet ?</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
              disabled={isDeleting}
            />
          </div>

          <div className="modal-body">
            <p className="mb-2">
              Tu es sur le point de supprimer{" "}
              <span className="fw-semibold">{project.name}</span>.
            </p>
            <div className="text-muted-soft small">
              Cette action supprime le projet de la liste (données mock /
              localStorage). Elle pourra être remplacée par un appel API plus
              tard.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onClose}
              disabled={isDeleting}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(project.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
