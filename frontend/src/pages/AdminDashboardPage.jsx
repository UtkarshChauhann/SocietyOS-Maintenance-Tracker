import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  CloudSun,
  Gauge,
  Layers3,
  Megaphone,
  Plus,
  TimerReset,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Loading } from '../components/Loading.jsx';
import { CountUp } from '../components/Motion.jsx';
import { Surface } from '../components/Surface.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatShortDate, statusClass } from '../utils/format.js';

const Sparkline = ({ value, color = '#0f766e' }) => {
  const points = useMemo(() => {
    const base = Math.max(2, Number(value) || 2);
    return [38, 32, 34, 24, 27, 18, 20, 10].map((y, index) => `${index * 18},${Math.max(5, y - (base % (index + 3)))}`).join(' ');
  }, [value]);

  return (
    <svg className="h-11 w-28" viewBox="0 0 126 46" role="img" aria-label="Recent trend">
      <motion.polyline
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        fill="none"
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
};

const KpiCard = ({ label, value, icon: Icon, tone, trend, sparkColor, to }) => (
  <Surface as={Link} to={to} interactive className="p-5 focus-ring">
    <div className="flex items-start justify-between gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon size={19} /></span>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><TrendingUp size={13} /> {trend}</span>
    </div>
    <div className="mt-5 flex items-end justify-between gap-3">
      <div>
        <p className="text-3xl font-bold text-ink"><CountUp value={value} /></p>
        <p className="mt-1 text-sm font-medium text-muted">{label}</p>
      </div>
      <Sparkline value={value} color={sparkColor} />
    </div>
  </Surface>
);

const isToday = (date) => date && new Date(date).toDateString() === new Date().toDateString();

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/complaints'), api.get('/notices')])
      .then(([summary, complaintList, noticeList]) => {
        setDashboard(summary.data.dashboard);
        setComplaints(complaintList.data.complaints);
        setNotices(noticeList.data.notices);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard" />;

  const total = dashboard ? Object.values(dashboard.byStatus).reduce((sum, count) => sum + count, 0) : 0;
  const resolved = dashboard?.byStatus?.Resolved || 0;
  const inProgress = dashboard?.byStatus?.['In Progress'] || 0;
  const open = dashboard?.byStatus?.Open || 0;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 100;
  const healthScore = Math.max(0, Math.min(100, Math.round(72 + resolutionRate * 0.25 - (dashboard?.overdueCount || 0) * 5)));
  const maxCategory = dashboard ? Math.max(1, ...Object.values(dashboard.byCategory)) : 1;
  const todayNew = complaints.filter((item) => isToday(item.createdAt)).length;
  const todayResolved = complaints.filter((item) => isToday(item.resolvedAt)).length;
  const recentComplaints = complaints.slice(0, 5);
  const recentNotices = notices.slice(0, 3);
  const statusTotal = Math.max(1, open + inProgress + resolved);
  const statusGradient = `conic-gradient(#f59e0b 0 ${(open / statusTotal) * 100}%, #2563eb ${(open / statusTotal) * 100}% ${((open + inProgress) / statusTotal) * 100}%, #10b981 ${((open + inProgress) / statusTotal) * 100}% 100%)`;

  return (
    <section className="grid gap-6">
      <Alert>{error}</Alert>

      <div className="relative overflow-hidden rounded-lg bg-slate-950 px-5 py-7 text-white shadow-soft sm:px-8 sm:py-9">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,118,110,.48),transparent_52%,rgba(37,99,235,.24))]" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-300">Community operations</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Good day, {user?.name?.split(' ')[0]}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Here is the live picture of maintenance activity across your society today.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/admin/complaints" className="bg-white !text-slate-950"><ClipboardList size={17} /> Review complaints</Button>
            <Button as={Link} to="/admin/notices/new" className="border border-white/15 !bg-white/10 text-white shadow-none backdrop-blur hover:!bg-white/15"><Plus size={17} /> Post notice</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total complaints" value={total} icon={ClipboardList} trend="Live" to="/admin/complaints" sparkColor="#0f766e" tone="bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300" />
        <KpiCard label="Open requests" value={open} icon={CircleDot} trend={`${Math.round((open / statusTotal) * 100)}%`} to="/admin/complaints?status=Open" sparkColor="#f59e0b" tone="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" />
        <KpiCard label="In progress" value={inProgress} icon={TimerReset} trend={`${Math.round((inProgress / statusTotal) * 100)}%`} to="/admin/complaints?status=In%20Progress" sparkColor="#2563eb" tone="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" />
        <KpiCard label="Overdue" value={dashboard?.overdueCount || 0} icon={AlertTriangle} trend="Priority" to="/admin/complaints?attention=true" sparkColor="#ef4444" tone="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.55fr)]">
        <Surface className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Community overview</p>
              <h2 className="mt-1 text-lg font-bold text-ink">Complaint health</h2>
            </div>
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 size={12} /> {resolutionRate}% resolved</Badge>
          </div>
          <div className="mt-7 grid gap-7 lg:grid-cols-[190px_1fr] lg:items-center">
            <div className="relative mx-auto grid h-40 w-40 place-items-center rounded-full" style={{ background: statusGradient }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-panel text-center shadow-inner">
                <div><p className="text-3xl font-bold text-ink">{total}</p><p className="text-xs text-muted">Total</p></div>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ['Open', open, 'bg-amber-500'],
                ['In progress', inProgress, 'bg-blue-600'],
                ['Resolved', resolved, 'bg-emerald-500']
              ].map(([label, count, color]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium text-ink"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span><span className="font-semibold text-muted">{count}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${(count / statusTotal) * 100}%` }} transition={{ duration: 0.65 }} className={`h-full rounded-full ${color}`} /></div>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-semibold text-muted">Community health</p><h2 className="mt-1 text-lg font-bold text-ink">Service score</h2></div>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Gauge size={19} /></span>
          </div>
          <div className="mt-8 text-center">
            <div className="relative mx-auto h-36 w-36">
              <svg
                viewBox="0 0 120 120"
                className="-rotate-90 h-full w-full"
              >
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="rgb(30 41 59)"
                  strokeWidth="10"
                />

                {/* Animated progress ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="rgb(45 212 191)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  initial={{
                    strokeDashoffset: 2 * Math.PI * 48,
                  }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 48 * (1 - healthScore / 100),
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-panel">
                  <span className="text-4xl font-black tracking-tight text-ink">
                    <CountUp value={healthScore} />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold text-ink">{healthScore >= 80 ? 'Healthy operations' : healthScore >= 60 ? 'Needs attention' : 'Action required'}</p>
            <p className="mt-1 text-xs leading-5 text-muted">Based on resolution rate and overdue workload.</p>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Surface className="p-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><CalendarClock size={18} /></span><div><p className="text-xs text-muted">Today's summary</p><p className="font-bold text-ink">{todayNew} new, {todayResolved} resolved</p></div></div>
        </Surface>
        <Surface className="p-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"><CloudSun size={18} /></span><div><p className="text-xs text-muted">Local weather</p><p className="font-bold text-ink">Weather service ready</p><p className="text-xs text-muted">Connect a provider to view conditions.</p></div></div>
        </Surface>
        <Surface className="p-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><Layers3 size={18} /></span><div><p className="text-xs text-muted">Active categories</p><p className="font-bold text-ink">{Object.keys(dashboard?.byCategory || {}).length} service areas</p></div></div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Surface className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted">Workload distribution</p><h2 className="mt-1 text-lg font-bold text-ink">Complaints by category</h2></div><Layers3 size={19} className="text-muted" /></div>
          <div className="mt-6 grid gap-4">
            {Object.entries(dashboard?.byCategory || {}).length ? Object.entries(dashboard.byCategory).map(([category, count]) => (
              <div key={category}>
                <div className="mb-2 flex justify-between text-sm"><span className="font-medium text-ink">{category}</span><span className="font-semibold text-muted">{count}</span></div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxCategory) * 100}%` }} transition={{ duration: 0.65 }} className="h-2 rounded-full bg-brand" /></div>
              </div>
            )) : <p className="py-8 text-center text-sm text-muted">Category activity will appear here.</p>}
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line p-5 sm:p-6"><div><p className="text-xs font-semibold text-muted">Activity feed</p><h2 className="mt-1 text-lg font-bold text-ink">Recent complaints</h2></div><Button as={Link} to="/admin/complaints" variant="ghost" size="sm">View all <ArrowRight size={15} /></Button></div>
          <div className="divide-y divide-line">
            {recentComplaints.length ? recentComplaints.map((complaint) => (
              <Link key={complaint._id} to={`/complaints/${complaint._id}`} className="focus-ring flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 sm:px-6">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-muted dark:bg-slate-800"><ClipboardList size={16} /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{complaint.category} · {complaint.resident?.name || 'Resident'}</span><span className="mt-0.5 block text-xs text-muted">#{complaint._id.slice(-6).toUpperCase()} · {formatShortDate(complaint.createdAt)}</span></span>
                <Badge className={statusClass(complaint.status)}>{complaint.status}</Badge>
              </Link>
            )) : <p className="px-6 py-10 text-center text-sm text-muted">No recent complaint activity.</p>}
          </div>
        </Surface>
      </div>

      <Surface className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6"><div><p className="text-xs font-semibold text-muted">Upcoming events</p><h2 className="mt-1 text-lg font-bold text-ink">Recent community notices</h2></div><Button as={Link} to="/notices" variant="ghost" size="sm">Notice board <ArrowUpRight size={15} /></Button></div>
        <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {recentNotices.length ? recentNotices.map((notice) => (
            <article key={notice._id} className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><Megaphone size={16} /></span>{notice.isImportant ? <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">Pinned</Badge> : null}</div>
              <h3 className="mt-4 truncate text-sm font-bold text-ink">{notice.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{notice.content}</p>
              <p className="mt-4 text-xs text-muted">{formatShortDate(notice.createdAt)}</p>
            </article>
          )) : <p className="col-span-3 px-6 py-10 text-center text-sm text-muted">No community notices yet.</p>}
        </div>
      </Surface>
    </section>
  );
};
