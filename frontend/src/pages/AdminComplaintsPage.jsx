import { Filter, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { ComplaintTable } from '../components/ComplaintTable.jsx';
import { Field } from '../components/Field.jsx';
import { Loading } from '../components/Loading.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Surface } from '../components/Surface.jsx';

const initialFilters = { status: '', category: '', priority: '', startDate: '', endDate: '', search: '', attention: '' };

export const AdminComplaintsPage = () => {
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [options, setOptions] = useState({ statuses: [], categories: [], priorities: [] });
  const [filters, setFilters] = useState(() => Object.fromEntries(Object.keys(initialFilters).map((key) => [key, searchParams.get(key) || ''])));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  useEffect(() => {
    api.get('/options').then(({ data }) => setOptions(data)).catch((err) => setError(getErrorMessage(err)));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
        const { data } = await api.get('/complaints', { params, signal: controller.signal });
        setComplaints(data.complaints);
      } catch (err) {
        if (err.name !== 'CanceledError') setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="grid gap-7">
      <PageHeader
        eyebrow="Operations"
        title="All complaints"
        description="Review, prioritize, and resolve every maintenance request across the community. Overdue items stay at the top."
        actions={
          <Badge className="border-line bg-panel px-3 py-2 text-muted shadow-sm">
            {complaints.length} results
          </Badge>
        }
      />

      <Surface className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={17} className="text-muted" />
            <h2 className="text-sm font-bold text-ink">Filter complaints</h2>
            {activeFilterCount ? <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">{activeFilterCount} active</Badge> : null}
            {filters.attention ? <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">High priority or overdue</Badge> : null}
          </div>
          {activeFilterCount ? (
            <Button size="sm" variant="ghost" onClick={() => setFilters(initialFilters)}><X size={15} /> Clear</Button>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Field id="search" label="Search" className="sm:col-span-2 xl:col-span-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                id="search"
                className="input-icon-control"
                value={filters.search}
                placeholder="Description..."
                onChange={(event) => updateFilter('search', event.target.value)}
              />
            </div>
          </Field>
          <Field id="status" label="Status">
            <select id="status" className="input-control" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
              <option value="">All statuses</option>
              {options.statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </Field>
          <Field id="category" label="Category">
            <select id="category" className="input-control" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
              <option value="">All categories</option>
              {options.categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
          <Field id="priority" label="Priority">
            <select id="priority" className="input-control" value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)}>
              <option value="">All priorities</option>
              {options.priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </Field>
          <Field id="startDate" label="From">
            <input id="startDate" className="input-control" type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} />
          </Field>
          <Field id="endDate" label="To">
            <input id="endDate" className="input-control" type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} />
          </Field>
        </div>
      </Surface>

      <Alert>{error}</Alert>
      {loading ? <Loading label="Loading complaints" /> : <ComplaintTable complaints={complaints} showResident emptyMessage="No complaints match these filters" />}
    </section>
  );
};
