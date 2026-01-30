import type {
  Project,
  ProjectAttendance,
  ProjectStudent,
} from "@/lib/types/projects";

export const mockProjects: Project[] = [
  {
    id: "pjt-swiss-history",
    name: "Expo Histoire Suisse",
    description:
      "Création d’une exposition interactive (affiches, quiz, présentation) autour des cantons et événements clés.",
    classGroup: "2M-INFO A",
    teacher: "Mme Durand",
    startDate: "2026-01-13",
    endDate: "2026-02-07",
    status: "en_cours",
    progressPercent: 62,
  },
  {
    id: "pjt-eco-report",
    name: "Rapport Économie & Société",
    description:
      "Travail de groupe : analyse d’un thème socio-économique et production d’un rapport structuré.",
    classGroup: "3M-INFO B",
    teacher: "M. Meyer",
    startDate: "2025-12-02",
    endDate: "2026-01-10",
    status: "termine",
    progressPercent: 100,
  },
  {
    id: "pjt-robotics",
    name: "Mini-projet Robotique",
    description:
      "Prototype robot (capteurs + logique) avec démonstration finale. Suivi strict des présences en atelier.",
    classGroup: "2M-INFO A",
    teacher: "M. Rossi",
    startDate: "2026-01-20",
    endDate: "2026-02-28",
    status: "en_retard",
    progressPercent: 38,
  },
];

export const mockProjectStudents: Record<string, ProjectStudent[]> = {
  "pjt-swiss-history": [
    {
      id: "stu-01",
      firstName: "Lina",
      lastName: "Bernasconi",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-02",
      firstName: "Noah",
      lastName: "Gachet",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-03",
      firstName: "Maya",
      lastName: "Santos",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-04",
      firstName: "Ethan",
      lastName: "Keller",
      classGroup: "2M-INFO A",
    },
  ],
  "pjt-eco-report": [
    {
      id: "stu-11",
      firstName: "Sarah",
      lastName: "Dubois",
      classGroup: "3M-INFO B",
    },
    {
      id: "stu-12",
      firstName: "Yanis",
      lastName: "Müller",
      classGroup: "3M-INFO B",
    },
    {
      id: "stu-13",
      firstName: "Julien",
      lastName: "Perrin",
      classGroup: "3M-INFO B",
    },
  ],
  "pjt-robotics": [
    {
      id: "stu-01",
      firstName: "Lina",
      lastName: "Bernasconi",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-02",
      firstName: "Noah",
      lastName: "Gachet",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-05",
      firstName: "Inès",
      lastName: "Morel",
      classGroup: "2M-INFO A",
    },
    {
      id: "stu-06",
      firstName: "Lucas",
      lastName: "Monnier",
      classGroup: "2M-INFO A",
    },
  ],
};

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

function seededRandom(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

export function mockProjectAttendance(projectId: string): ProjectAttendance {
  const project = mockProjects.find((p) => p.id === projectId);
  if (!project) {
    return { projectId, dates: [], students: [], cells: [] };
  }

  const students = mockProjectStudents[projectId] ?? [];
  const dates = dateRangeInclusive(project.startDate, project.endDate).filter(
    (d) => {
      const day = new Date(`${d}T00:00:00`).getDay();
      return day !== 0 && day !== 6; // weekdays only
    },
  );

  const rand = seededRandom(
    projectId.length * 97 + students.length * 31 + dates.length,
  );

  const cells = students.flatMap((s) =>
    dates.map((date) => {
      const absent = rand() < (project.status === "en_retard" ? 0.12 : 0.07);
      return {
        studentId: s.id,
        date,
        absent,
        comment:
          absent && rand() < 0.25 ? "Justification en attente" : undefined,
      };
    }),
  );

  return { projectId, dates, students, cells };
}
