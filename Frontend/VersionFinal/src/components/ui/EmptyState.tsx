type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon = "bi-inbox",
}: Props) {
  return (
    <div className="card app-card">
      <div className="card-body text-center py-5">
        <div className="mb-3" style={{ fontSize: 34, opacity: 0.9 }}>
          <i className={`bi ${icon}`} />
        </div>
        <h3 className="h6 mb-1">{title}</h3>
        {description ? (
          <p className="text-muted-soft mb-3">{description}</p>
        ) : null}
        {action ? (
          <div className="d-flex justify-content-center">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
