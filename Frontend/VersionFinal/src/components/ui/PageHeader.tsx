type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div className="d-flex align-items-start align-items-md-center justify-content-between gap-3 mb-3">
      <div>
        <h1 className="h4 mb-0">{title}</h1>
        {subtitle ? (
          <div className="text-muted-soft small mt-1">{subtitle}</div>
        ) : null}
      </div>
      {right ? (
        <div className="d-flex align-items-center gap-2">{right}</div>
      ) : null}
    </div>
  );
}
