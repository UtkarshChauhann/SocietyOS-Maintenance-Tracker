import { Building2 } from 'lucide-react';

export const Logo = ({ compact = false }) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-button text-white shadow-md shadow-teal-900/15 dark:text-slate-950">
      <img src="/Nestra.png" alt="Nestra" className="h-10 w-10 rounded-lg object-contain"/>
    </span>
    {!compact ? (
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">Nestra</p>
        <p className="truncate text-xs text-muted">Community operations</p>
      </div>
    ) : null}
  </div>
);
