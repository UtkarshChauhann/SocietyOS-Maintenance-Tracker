export const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex min-h-6 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold leading-none ${className}`}>
    {children}
  </span>
);
