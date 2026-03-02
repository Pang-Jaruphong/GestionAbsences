type Props = {
  icon: string;
  label: string;
  value: string;
  trend?: number;
  tone?: "default" | "warning" | "danger" | "success";
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  tone = "default",
}: Props) {
  const toneClass =
    tone === "warning"
      ? "text-warning"
      : tone === "danger"
        ? "text-danger"
        : tone === "success"
          ? "text-success"
          : "text-primary";

  const borderGlow =
    tone === "danger"
      ? "0 0 0 1px rgba(220,53,69,0.75), 0 0 22px rgba(220,53,69,0.25)"
      : tone === "success"
        ? "0 0 0 1px rgba(0,210,106,0.75), 0 0 22px rgba(0,210,106,0.25)"
        : tone === "warning"
          ? "0 0 0 1px rgba(255,193,7,0.75), 0 0 22px rgba(255,193,7,0.22)"
          : "0 0 0 1px rgba(13,110,253,0.55), 0 0 22px rgba(13,110,253,0.18)";

  const trendBadge =
    typeof trend === "number" ? (
      <span
        className={`badge ${trend >= 0 ? "text-bg-success" : "text-bg-danger"} ms-2`}
      >
        {trend >= 0 ? `+${trend}%` : `${trend}%`}
      </span>
    ) : null;

  return (
    <div className="card app-card h-100">
      <div
        className="card-body"
        style={{ boxShadow: borderGlow, borderRadius: "0.9rem" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted-soft small">{label}</div>
            <div
              className={`display-6 mb-0 ${toneClass}`}
              style={{ fontWeight: 700, letterSpacing: "0.2px" }}
            >
              {value}
              {trendBadge}
            </div>
          </div>
          <div
            className="rounded-3 d-inline-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <i className={`bi ${icon}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
