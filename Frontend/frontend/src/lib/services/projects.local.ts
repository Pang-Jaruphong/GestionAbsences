import type { Project, ProjectStatus } from "@/lib/types/projects";
import { safeJsonParse, isBrowser } from "@/lib/utils/storage";

const STORAGE_KEY = "absencenext.projects.custom.v1";
const STORAGE_DELETED_KEY = "absencenext.projects.deleted.v1";
const STORAGE_PARTICIPANTS_KEY = "absencenext.projects.participants.v1";

type StoredProject = Project;

type StoredParticipant = {
  id: string;
  firstName: string;
  lastName: string;
  classGroup: string;
};

type StoredParticipantsByProject = Record<string, StoredParticipant[]>;

function loadCustomProjects(): StoredProject[] {
  if (!isBrowser()) return [];
  return (
    safeJsonParse<StoredProject[]>(window.localStorage.getItem(STORAGE_KEY)) ??
    []
  );
}

function saveCustomProjects(projects: StoredProject[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadDeletedProjectIds(): string[] {
  if (!isBrowser()) return [];
  return (
    safeJsonParse<string[]>(window.localStorage.getItem(STORAGE_DELETED_KEY)) ??
    []
  );
}

function saveDeletedProjectIds(ids: string[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(ids));
}

function loadParticipantsByProject(): StoredParticipantsByProject {
  if (!isBrowser()) return {};
  return (
    safeJsonParse<StoredParticipantsByProject>(
      window.localStorage.getItem(STORAGE_PARTICIPANTS_KEY),
    ) ?? {}
  );
}

function saveParticipantsByProject(map: StoredParticipantsByProject) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(map));
}

export type NewProjectInput = {
  name: string;
  description: string;
  classGroup: string;
  teacher: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progressPercent: number;
  participants?: Array<{
    fullName: string;
    classGroup: string;
  }>;
};

export function listCustomProjects(): Project[] {
  return loadCustomProjects();
}

export function listDeletedProjectIds(): string[] {
  return loadDeletedProjectIds();
}

export function isProjectDeleted(projectId: string): boolean {
  return loadDeletedProjectIds().includes(projectId);
}

export function softDeleteProject(projectId: string): void {
  const current = loadDeletedProjectIds();
  if (current.includes(projectId)) return;
  saveDeletedProjectIds([projectId, ...current]);
}

export function restoreProject(projectId: string): void {
  const current = loadDeletedProjectIds();
  if (!current.includes(projectId)) return;
  saveDeletedProjectIds(current.filter((id) => id !== projectId));
}

export function createProject(input: NewProjectInput): Project {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  const slug = input.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  const id = `pjt-${slug || "project"}-${y}${m}${d}-${Math.random().toString(16).slice(2, 8)}`;

  const project: Project = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    classGroup: input.classGroup.trim(),
    teacher: input.teacher.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    status: input.status,
    progressPercent: input.progressPercent,
  };

  const current = loadCustomProjects();
  saveCustomProjects([project, ...current]);

  // Store participants separately (used to build attendance/students list on detail page)
  const rawParticipants = (input.participants ?? [])
    .map((p) => ({
      fullName: p.fullName.trim(),
      classGroup: p.classGroup.trim(),
    }))
    .filter((p) => p.fullName.length > 0 && p.classGroup.length > 0);

  if (rawParticipants.length > 0) {
    const participants: StoredParticipant[] = rawParticipants.map((p, idx) => {
      const parts = p.fullName.split(/\s+/).filter(Boolean);
      const firstName = parts.slice(1).join(" ") || parts[0] || "";
      const lastName = parts[0] || "";
      return {
        id: `stu-${project.id}-${idx + 1}`,
        firstName,
        lastName,
        classGroup: p.classGroup,
      };
    });

    const map = loadParticipantsByProject();
    map[project.id] = participants;
    saveParticipantsByProject(map);
  }

  return project;
}

export function deleteProject(projectId: string): void {
  // If it's a locally created project, hard-delete it.
  const current = loadCustomProjects();
  const isCustom = current.some((p) => p.id === projectId);
  if (isCustom) {
    saveCustomProjects(current.filter((p) => p.id !== projectId));

    // cleanup participants if any
    const map = loadParticipantsByProject();
    if (map[projectId]) {
      delete map[projectId];
      saveParticipantsByProject(map);
    }
    return;
  }

  // Otherwise, soft-delete (hide) it. This keeps seed/mock projects intact.
  softDeleteProject(projectId);
}

export function listProjectParticipants(
  projectId: string,
): StoredParticipant[] {
  const map = loadParticipantsByProject();
  return map[projectId] ?? [];
}
