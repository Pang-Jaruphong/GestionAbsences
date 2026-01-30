import type {
  Project,
  ProjectAttendance,
  ProjectImpact,
  ProjectStatus,
} from "@/lib/types/projects";
import { mockProjects, mockProjectAttendance } from "@/lib/mocks/projects";
import {
  listCustomProjects,
  isProjectDeleted,
  listProjectParticipants,
} from "@/lib/services/projects.local";
import { safeJsonParse, isBrowser } from "@/lib/utils/storage";

export type ProjectsQuery = {
  search?: string;
  classGroup?: string;
  status?: ProjectStatus | "all";
  period?: { from?: string; to?: string };
};

// Contract:
// - Today: mock data
// - Later: swap implementation with REST calls without changing the UI.

export async function listProjects(
  query: ProjectsQuery = {},
): Promise<Project[]> {
  const search = (query.search ?? "").trim().toLowerCase();
  const classGroup = (query.classGroup ?? "").trim();
  const status = query.status ?? "all";

  const allProjects = [...listCustomProjects(), ...mockProjects];

  return allProjects
    .filter((p) => !isProjectDeleted(p.id))
    .filter((p) =>
      search
        ? `${p.name} ${p.description} ${p.teacher}`
            .toLowerCase()
            .includes(search)
        : true,
    )
    .filter((p) => (classGroup ? p.classGroup === classGroup : true))
    .filter((p) => (status === "all" ? true : p.status === status))
    .filter((p) => {
      const from = query.period?.from;
      const to = query.period?.to;
      if (!from && !to) return true;
      const s = p.startDate;
      const e = p.endDate;
      if (from && e < from) return false;
      if (to && s > to) return false;
      return true;
    });
}

export async function getProject(projectId: string): Promise<Project | null> {
  if (isProjectDeleted(projectId)) return null;
  return (
    [...listCustomProjects(), ...mockProjects].find(
      (p) => p.id === projectId,
    ) ?? null
  );
}

export async function getProjectAttendance(
  projectId: string,
): Promise<ProjectAttendance> {
  // For locally created projects, build attendance grid from stored participants.
  const custom = listCustomProjects().find((p) => p.id === projectId);
  if (custom) {
    const students = listProjectParticipants(projectId);

    const dates = dateRangeInclusive(custom.startDate, custom.endDate).filter(
      (d) => {
        const day = new Date(`${d}T00:00:00`).getDay();
        return day !== 0 && day !== 6;
      },
    );

    const savedCells = loadAttendanceOverrides(projectId);
    const cellKey = (studentId: string, date: string) =>
      `${studentId}__${date}`;

    const cells = students.flatMap((s) =>
      dates.map((date) => {
        const saved = savedCells[cellKey(s.id, date)];
        return {
          studentId: s.id,
          date,
          absent: saved?.absent ?? false,
          comment: saved?.comment,
        };
      }),
    );

    return { projectId, dates, students, cells };
  }

  // For mock/seed projects: apply local overrides (absent/comment) so user edits persist.
  const base = mockProjectAttendance(projectId);
  const savedCells = loadAttendanceOverrides(projectId);
  const cellKey = (studentId: string, date: string) => `${studentId}__${date}`;

  const cells = base.cells.map((c) => {
    const saved = savedCells[cellKey(c.studentId, c.date)];
    if (!saved) return c;
    return {
      ...c,
      absent: saved.absent,
      comment: saved.comment,
    };
  });

  // In case overrides exist for cells not present in base (edge case), append them
  // only if the student/date exists in the grid.
  const validStudentIds = new Set(base.students.map((s) => s.id));
  const validDates = new Set(base.dates);
  for (const [k, v] of Object.entries(savedCells)) {
    const [studentId, date] = k.split("__");
    if (!studentId || !date) continue;
    if (!validStudentIds.has(studentId) || !validDates.has(date)) continue;
    const exists = cells.some(
      (c) => c.studentId === studentId && c.date === date,
    );
    if (!exists) {
      cells.push({ studentId, date, absent: v.absent, comment: v.comment });
    }
  }

  return { ...base, cells };
}

// ---- local helpers (avoids touching mock seed data) ----
type AttendanceOverride = { absent: boolean; comment?: string };
type AttendanceOverrideMap = Record<string, AttendanceOverride>;
const ATTENDANCE_OVERRIDES_PREFIX = "absencenext.projects.attendance.v1.";

function dateRangeInclusive(start: string, end: string): string[] {
  const out: string[] = [];
  const startD = new Date(`${start}T00:00:00`);
  const endD = new Date(`${end}T00:00:00`);

  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    out.push(`${yyyy}-${mm}-${dd}`);
  }

  return out;
}

function loadAttendanceOverrides(projectId: string): AttendanceOverrideMap {
  if (!isBrowser()) return {};
  return (
    safeJsonParse<AttendanceOverrideMap>(
      window.localStorage.getItem(`${ATTENDANCE_OVERRIDES_PREFIX}${projectId}`),
    ) ?? {}
  );
}

export function saveAttendanceOverride(
  projectId: string,
  studentId: string,
  date: string,
  patch: AttendanceOverride,
) {
  if (!isBrowser()) return;
  const key = `${studentId}__${date}`;
  const current = loadAttendanceOverrides(projectId);
  current[key] = { absent: patch.absent, comment: patch.comment };
  window.localStorage.setItem(
    `${ATTENDANCE_OVERRIDES_PREFIX}${projectId}`,
    JSON.stringify(current),
  );
}

export function computeProjectImpact(att: ProjectAttendance): ProjectImpact {
  const totalSlots = att.students.length * att.dates.length;
  const totalAbsences = att.cells.reduce(
    (acc, c) => acc + (c.absent ? 1 : 0),
    0,
  );
  const attendanceRate =
    totalSlots === 0
      ? 100
      : Math.round(((totalSlots - totalAbsences) / totalSlots) * 100);
  return {
    projectId: att.projectId,
    totalAbsences,
    totalSlots,
    attendanceRate,
  };
}
