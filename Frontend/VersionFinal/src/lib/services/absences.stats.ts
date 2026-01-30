import type { AbsenceRecord } from "@/lib/mocks/absences";

export type DashboardAbsenceStats = {
  unjustifiedHours: number;
  justifiedHours: number;
  latePeriods: number;
  studentsCount: number;
  split: {
    unjustified: number;
    justified: number;
    late: number;
  };
  alerts: Array<{ title: string; detail: string }>;
};

function durationHours(a: AbsenceRecord): number {
  if (!a.startTime || !a.endTime) return 1;
  const [sh, sm] = a.startTime.split(":").map(Number);
  const [eh, em] = a.endTime.split(":").map(Number);
  if (
    Number.isNaN(sh) ||
    Number.isNaN(sm) ||
    Number.isNaN(eh) ||
    Number.isNaN(em)
  ) {
    return 1;
  }
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const minutes = Math.max(0, end - start);
  // in this app we count in hours (rounded)
  return Math.max(1, Math.round(minutes / 60));
}

export function computeDashboardAbsenceStats(
  absences: AbsenceRecord[],
): DashboardAbsenceStats {
  const uniqueStudents = new Set(
    absences.map((a) => `${a.studentName}__${a.classGroup}`),
  );
  const unjustifiedHours = absences
    .filter((a) => a.status === "non_justifiee")
    .reduce((acc, a) => acc + durationHours(a), 0);

  const justifiedHours = absences
    .filter((a) => a.status === "justifiee")
    .reduce((acc, a) => acc + durationHours(a), 0);

  const latePeriods = absences.filter((a) => a.status === "retard").length;

  const split = {
    unjustified: unjustifiedHours,
    justified: justifiedHours,
    late: latePeriods,
  };

  // toy alerts: any student with >=2 unjustified in dataset
  const byStudent: Record<string, { name: string; count: number }> = {};
  for (const a of absences) {
    if (a.status !== "non_justifiee") continue;
    const key = `${a.studentName}__${a.classGroup}`;
    byStudent[key] = byStudent[key] ?? {
      name: `${a.studentName} (${a.classGroup})`,
      count: 0,
    };
    byStudent[key].count++;
  }
  const alerts = Object.values(byStudent)
    .filter((x) => x.count >= 2)
    .slice(0, 5)
    .map((x) => ({
      title: x.name,
      detail: `${x.count} absences non justifiées`,
    }));

  return {
    unjustifiedHours,
    justifiedHours,
    latePeriods,
    studentsCount: uniqueStudents.size,
    split,
    alerts,
  };
}
