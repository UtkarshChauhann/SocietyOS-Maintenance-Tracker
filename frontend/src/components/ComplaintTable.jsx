import { ChevronLeft, ChevronRight, Clock3, Eye, Inbox, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatShortDate, priorityClass, statusClass } from '../utils/format.js';
import { Badge } from './Badge.jsx';
import { EmptyState } from './EmptyState.jsx';

const PAGE_SIZE = 8;

const ComplaintBadges = ({ complaint }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge className={statusClass(complaint.status)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {complaint.status}
    </Badge>
    <Badge className={priorityClass(complaint.priority)}>{complaint.priority}</Badge>
    {complaint.isOverdue ? (
      <Badge className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
        <Clock3 size={12} /> Overdue
      </Badge>
    ) : null}
  </div>
);

export const ComplaintTable = ({ complaints, emptyMessage = 'No complaints found.', showResident = false }) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(complaints.length / PAGE_SIZE));

  useEffect(() => setPage(1), [complaints]);

  const visibleComplaints = useMemo(
    () => complaints.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [complaints, page]
  );

  if (!complaints.length) {
    return <EmptyState icon={Inbox} title={emptyMessage} description="New items will appear here as soon as they are submitted." />;
  }

  return (
    <div className="surface overflow-hidden">
      <div className="hidden max-h-[650px] overflow-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-line bg-slate-50/95 text-xs font-semibold text-muted backdrop-blur dark:bg-slate-900/95">
            <tr>
              <th className="px-5 py-4">Complaint</th>
              {showResident ? <th className="px-5 py-4">Resident</th> : null}
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visibleComplaints.map((complaint) => (
              <tr
                key={complaint._id}
                className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                  complaint.isOverdue ? 'bg-rose-50/35 dark:bg-rose-950/10' : 'bg-panel'
                }`}
              >
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">#{complaint._id.slice(-6).toUpperCase()}</p>
                  <p className="mt-1 max-w-xs truncate text-xs text-muted">{complaint.description}</p>
                </td>
                {showResident ? (
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-ink">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-muted dark:bg-slate-800">
                        <UserRound size={15} />
                      </span>
                      <span className="font-medium">{complaint.resident?.name || 'Resident'}</span>
                    </div>
                  </td>
                ) : null}
                <td className="px-5 py-4 text-muted">{complaint.category}</td>
                <td className="px-5 py-4"><ComplaintBadges complaint={complaint} /></td>
                <td className="whitespace-nowrap px-5 py-4 text-muted">{formatShortDate(complaint.createdAt)}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-panel px-3 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
                    to={`/complaints/${complaint._id}`}
                  >
                    <Eye size={15} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-line md:hidden">
        {visibleComplaints.map((complaint) => (
          <article key={complaint._id} className="bg-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted">#{complaint._id.slice(-6).toUpperCase()}</p>
                <h3 className="mt-1 truncate font-bold text-ink">{complaint.category}</h3>
                {showResident ? <p className="mt-1 text-xs text-muted">{complaint.resident?.name || 'Resident'}</p> : null}
              </div>
              <Link
                className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted"
                to={`/complaints/${complaint._id}`}
                aria-label={`View complaint ${complaint._id.slice(-6)}`}
              >
                <Eye size={16} />
              </Link>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{complaint.description}</p>
            <div className="mt-4"><ComplaintBadges complaint={complaint} /></div>
            <p className="mt-3 text-xs text-muted">Created {formatShortDate(complaint.createdAt)}</p>
          </article>
        ))}
      </div>

      <footer className="flex flex-col gap-3 border-t border-line bg-slate-50/70 px-4 py-3 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, complaints.length)} of {complaints.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={17} />
          </button>
          <span className="min-w-16 text-center text-xs font-semibold text-ink">{page} / {pageCount}</span>
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </footer>
    </div>
  );
};
