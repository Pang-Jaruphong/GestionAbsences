type Props = {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  message: string;
};

export function AlertInline({ tone = "info", title, message }: Props) {
  return (
    <div className={`alert alert-${tone} mb-0`} role="alert">
      {title ? <div className="fw-semibold">{title}</div> : null}
      <div>{message}</div>
    </div>
  );
}
