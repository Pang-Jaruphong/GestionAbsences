import type { ProjectStatus } from "@/lib/types/projects";

export type AbsenceStatus = "justifiee" | "non_justifiee" | "retard";

export type AbsenceRecord = {
  id: string;
  studentName: string;
  classGroup: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  status: AbsenceStatus;
  reason?: string;
  project?: {
    id: string;
    name: string;
    status: ProjectStatus;
  };
  teacher?: string;
};

export type ClassSummary = {
  id: string;
  name: string;
  teacher: string;
  studentsCount: number;
  absencesToday: number;
  absencesWeek: number;
  alerts: number;
  lastUpdated: string; // ISO date time-ish
};

export const mockAbsences: AbsenceRecord[] = [
  {
    id: "abs-001",
    studentName: "Bernasconi Lina",
    classGroup: "2M-INFO A",
    date: "2026-01-27",
    startTime: "08:15",
    endTime: "09:00",
    status: "retard",
    reason: "Bus en retard",
    project: {
      id: "pjt-swiss-history",
      name: "Expo Histoire Suisse",
      status: "en_cours",
    },
    teacher: "Mme Durand",
  },
  {
    id: "abs-002",
    studentName: "Gachet Noah",
    classGroup: "2M-INFO A",
    date: "2026-01-27",
    startTime: "10:10",
    endTime: "11:55",
    status: "non_justifiee",
    reason: "",
    project: {
      id: "pjt-robotics",
      name: "Mini-projet Robotique",
      status: "en_retard",
    },
    teacher: "M. Rossi",
  },
  {
    id: "abs-003",
    studentName: "Morel Inès",
    classGroup: "2M-INFO A",
    date: "2026-01-26",
    startTime: "13:15",
    endTime: "15:00",
    status: "justifiee",
    reason: "Rendez-vous médical",
    teacher: "M. Rossi",
  },
  {
    id: "abs-004",
    studentName: "Dubois Sarah",
    classGroup: "3M-INFO B",
    date: "2026-01-23",
    startTime: "08:15",
    endTime: "11:55",
    status: "justifiee",
    reason: "Certificat médical",
    project: {
      id: "pjt-eco-report",
      name: "Rapport Économie & Société",
      status: "termine",
    },
    teacher: "M. Meyer",
  },
  {
    id: "abs-005",
    studentName: "Monnier Lucas",
    classGroup: "2M-INFO A",
    date: "2026-01-22",
    startTime: "08:15",
    endTime: "09:00",
    status: "non_justifiee",
    teacher: "Mme Durand",
  },
];

export const mockClasses: ClassSummary[] = [
  {
    id: "cls-2m-info-a",
    name: "2M-INFO A",
    teacher: "Mme Durand",
    studentsCount: 18,
    absencesToday: 2,
    absencesWeek: 7,
    alerts: 1,
    lastUpdated: "2026-01-27 11:30",
  },
  {
    id: "cls-3m-info-b",
    name: "3M-INFO B",
    teacher: "M. Meyer",
    studentsCount: 16,
    absencesToday: 0,
    absencesWeek: 3,
    alerts: 0,
    lastUpdated: "2026-01-27 11:30",
  },
  {
    id: "cls-2m-design",
    name: "2M-DESIGN",
    teacher: "Mme Favre",
    studentsCount: 20,
    absencesToday: 1,
    absencesWeek: 5,
    alerts: 2,
    lastUpdated: "2026-01-27 11:30",
  },
];
