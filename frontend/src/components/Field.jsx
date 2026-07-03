export const Field = ({ label, id, error, hint, children, className = '' }) => (
  <label className={`grid gap-2 text-sm font-semibold text-ink ${className}`} htmlFor={id}>
    <span>{label}</span>
    {children}
    {hint && !error ? <span className="text-xs font-normal text-muted">{hint}</span> : null}
    {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</span> : null}
  </label>
);
