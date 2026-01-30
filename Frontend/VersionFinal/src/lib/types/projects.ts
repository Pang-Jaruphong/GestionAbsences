export type ProjectStatus = "en_cours" | "termine" | "en_retard";

export type Project = {
  id: string;
  name: string;
  description: string;
  classGroup: string;
  teacher: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: ProjectStatus;
  progressPercent: number; // 0..100
};

export type ProjectStudent = {
  id: string;
  firstName: string;
  lastName: string;
  classGroup: string;
};

export type ProjectAttendanceCell = {
  studentId: string;
  date: string; // YYYY-MM-DD
  absent: boolean;
  comment?: string;
};

export type ProjectAttendance = {
  projectId: string;
  dates: string[];
  students: ProjectStudent[];
  cells: ProjectAttendanceCell[];
};

export type ProjectImpact = {
  projectId: string;
  totalAbsences: number;
  totalSlots: number;
  attendanceRate: number; // 0..100
};
