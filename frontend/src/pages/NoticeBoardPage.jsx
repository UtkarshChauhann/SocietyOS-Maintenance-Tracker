import { BellRing, CalendarDays, Megaphone, Pin, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Loading } from '../components/Loading.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Surface } from '../components/Surface.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../utils/format.js';

export const NoticeBoardPage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/notices')
      .then(({ data }) => setNotices(data.notices))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filteredNotices = useMemo(
    () => (filter === 'important' ? notices.filter((notice) => notice.isImportant) : notices),
    [filter, notices]
  );

  return (
    <section className="grid gap-7">
      <PageHeader
        eyebrow="Community updates"
        title="Notice board"
        description="Stay informed about maintenance schedules, service changes, and important society announcements."
        actions={user?.role === 'admin' ? (
          <Button as={Link} to="/admin/notices/new"><PlusCircle size={17} /> Post notice</Button>
        ) : null}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-lg border border-line bg-panel p-1 shadow-sm" role="tablist" aria-label="Notice filters">
          {[
            ['all', 'All notices'],
            ['important', 'Important']
          ].map(([value, label]) => (
            <button
              key={value}
              className={`focus-ring rounded-md px-3 py-2 text-xs font-semibold transition ${filter === value ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-muted hover:text-ink'}`}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">{filteredNotices.length} {filteredNotices.length === 1 ? 'announcement' : 'announcements'}</p>
      </div>

      <Alert>{error}</Alert>
      {loading ? (
        <Loading label="Loading notices" />
      ) : filteredNotices.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredNotices.map((notice) => (
            <Surface
              key={notice._id}
              interactive
              className={`relative overflow-hidden p-5 sm:p-6 ${notice.isImportant ? 'border-amber-200 dark:border-amber-900' : ''}`}
            >
              {notice.isImportant ? <span className="absolute inset-y-0 left-0 w-1 bg-amber-500" /> : null}
              <div className="flex items-start justify-between gap-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${notice.isImportant ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'}`}>
                  {notice.isImportant ? <BellRing size={20} /> : <Megaphone size={20} />}
                </span>
                {notice.isImportant ? <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"><Pin size={12} /> Pinned</Badge> : null}
              </div>
              <h2 className="mt-5 text-lg font-bold text-ink sm:text-xl">{notice.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{notice.content}</p>
              <footer className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs text-muted">
                <span>By {notice.postedBy?.name || 'Administrator'}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {formatDate(notice.createdAt)}</span>
              </footer>
            </Surface>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Megaphone}
          title={filter === 'important' ? 'No important notices' : 'No notices yet'}
          description={filter === 'important' ? 'Pinned announcements will appear here.' : 'Community announcements will appear here when posted.'}
        />
      )}
    </section>
  );
};
