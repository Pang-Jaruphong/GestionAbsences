"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/absences", label: "Absences", icon: "bi-calendar2-week" },
  { href: "/classes", label: "Classes", icon: "bi-people" },
  { href: "/projets", label: "Projets", icon: "bi-kanban" },
];

export function AppShell({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className="app-shell d-flex">
      <aside className="app-sidebar d-none d-lg-flex flex-column p-3 position-sticky top-0 vh-100">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-3 d-inline-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              background: "rgba(124, 92, 255, 0.2)",
              border: "1px solid rgba(124, 92, 255, 0.35)",
            }}
          >
            <i className="bi bi-mortarboard" />
          </div>
          <div className="fw-semibold">Gestion d'absence</div>
        </div>

        <nav className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`}
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="app-content flex-grow-1">
        <header className="app-topbar px-3 py-2 d-flex align-items-center justify-content-between">
          <div className="d-lg-none fw-semibold">AbsenceNext</div>
          <div />
        </header>

        {children}
      </main>
    </div>
  );
}
