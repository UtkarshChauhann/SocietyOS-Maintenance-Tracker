import { ArrowUpRight, CheckCircle2, CircleDot, Clock3, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { ComplaintTable } from '../components/ComplaintTable.jsx';
import { Loading } from '../components/Loading.jsx';
import { CountUp } from '../components/Motion.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Surface } from '../components/Surface.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const StatCard = ({ label, value, icon: Icon, tone, to }) => (
  <Surface as={Link} to={to} interactive className="p-5 focus-ring">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-2 text-3xl font-bold text-ink"><CountUp value={value} /></p>
      </div>
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon size={19} /></span>
    </div>
  </Surface>
);

export const ResidentComplaintsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/complaints/me')
      .then(({ data }) => setComplaints(data.complaints))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: complaints.length,
      open: complaints.filter((item) => item.status === 'Open').length,
      progress: complaints.filter((item) => item.status === 'In Progress').length,
      resolved: complaints.filter((item) => item.status === 'Resolved').length
    }),
    [complaints]
  );
  const statusFilter = searchParams.get('status') || '';
  const visibleComplaints = useMemo(
    () => statusFilter ? complaints.filter((item) => item.status === statusFilter) : complaints,
    [complaints, statusFilter]
  );
  const viewLabel = statusFilter === 'Open' ? 'Open requests' : statusFilter === 'In Progress' ? 'In-progress requests' : statusFilter === 'Resolved' ? 'Resolved requests' : 'My complaints';

  return (
    <section className="grid gap-7">
      <div className="relative overflow-hidden rounded-lg bg-slate-950 px-5 py-7 text-white shadow-soft sm:px-7 sm:py-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,118,110,.48),transparent_50%,rgba(37,99,235,.2))]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-300">Resident workspace</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Keep track of every maintenance request and its progress from one calm workspace.</p>
          </div>
          <Button as={Link} to="/complaints/new" className="w-full bg-white !text-slate-950 sm:w-auto">
            <PlusCircle size={18} /> Raise a complaint
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All requests" value={stats.total} to="/complaints" icon={ArrowUpRight} tone="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" />
        <StatCard label="Open" value={stats.open} to="/complaints?status=Open" icon={CircleDot} tone="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" />
        <StatCard label="In progress" value={stats.progress} to="/complaints?status=In%20Progress" icon={Clock3} tone="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" />
        <StatCard label="Resolved" value={stats.resolved} to="/complaints?status=Resolved" icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" />
      </div>

      <div className="grid gap-5">
        <PageHeader
          eyebrow="Request history"
          title={viewLabel}
          description={statusFilter ? `Showing your ${statusFilter.toLowerCase()} maintenance requests.` : 'Review status, priority, and resolution updates for every issue you have reported.'}
          actions={
            <Button as={Link} to="/complaints/new" variant="secondary">
              <PlusCircle size={17} /> New complaint
            </Button>
          }
        />
        <Alert>{error}</Alert>
        {loading ? <Loading label="Loading complaints" /> : <ComplaintTable complaints={visibleComplaints} emptyMessage={statusFilter ? `No ${statusFilter.toLowerCase()} complaints yet` : 'No complaints yet'} />}
      </div>
    </section>
  );
};
