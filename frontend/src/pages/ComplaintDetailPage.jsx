import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Mail,
  Save,
  UserRound,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, getErrorMessage, UPLOADS_URL } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { Loading } from '../components/Loading.jsx';
import { Surface } from '../components/Surface.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, priorityClass, statusClass } from '../utils/format.js';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [options, setOptions] = useState({ statuses: [], priorities: [] });
  const [form, setForm] = useState({ status: '', priority: '', note: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [detail, opts] = await Promise.all([api.get(`/complaints/${id}`), api.get('/options')]);
      setComplaint(detail.data.complaint);
      setOptions(opts.data);
      setForm({
        status: detail.data.complaint.status,
        priority: detail.data.complaint.priority,
        note: ''
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateComplaint = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.put(`/complaints/${id}`, form);
      setComplaint(data.complaint);
      setForm({ status: data.complaint.status, priority: data.complaint.priority, note: '' });
      setSuccess('Complaint updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading complaint details" />;

  const backTo = isAdmin ? '/admin/complaints' : '/complaints';

  return (
    <section className="grid gap-6">
      <Link className="focus-ring inline-flex w-fit items-center gap-2 rounded-lg text-sm font-semibold text-muted transition hover:text-brand" to={backTo}>
        <ArrowLeft size={17} /> Back to complaints
      </Link>
      <Alert>{error}</Alert>
      <Alert type="success" onDismiss={() => setSuccess('')}>{success}</Alert>

      {complaint ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 gap-5">
            <Surface className="overflow-hidden">
              <div className="border-b border-line bg-slate-50/70 p-5 dark:bg-slate-900/50 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                      <span>#{complaint._id.slice(-6).toUpperCase()}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{complaint.category}</span>
                    </div>
                    <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Complaint details</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> Created {formatDate(complaint.createdAt)}</span>
                      {complaint.resolvedAt ? <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} /> Resolved {formatDate(complaint.resolvedAt)}</span> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusClass(complaint.status)}><span className="h-1.5 w-1.5 rounded-full bg-current" />{complaint.status}</Badge>
                    <Badge className={priorityClass(complaint.priority)}>{complaint.priority} priority</Badge>
                    {complaint.isOverdue ? <Badge className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"><Clock3 size={12} /> Overdue</Badge> : null}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <p className="text-xs font-semibold text-muted">Description</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink sm:text-base">{complaint.description}</p>

                {complaint.photoUrl ? (
                  <figure className="mt-7 overflow-hidden rounded-lg border border-line bg-slate-50 dark:bg-slate-900">
                    <img
                      className="max-h-[480px] w-full object-cover"
                      src={complaint.photoUrl.startsWith('http') ? complaint.photoUrl : `${UPLOADS_URL}${complaint.photoUrl}`}
                      alt={`Submitted evidence for ${complaint.category} complaint`}
                    />
                    <figcaption className="flex items-center gap-2 border-t border-line px-4 py-3 text-xs text-muted"><Camera size={14} /> Resident attachment</figcaption>
                  </figure>
                ) : null}
              </div>
            </Surface>

            <Surface className="p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Wrench size={19} /></span>
                <div>
                  <h2 className="text-lg font-bold text-ink">Activity timeline</h2>
                  <p className="mt-1 text-sm text-muted">A complete record of status and priority changes.</p>
                </div>
              </div>

              <div className="mt-7">
                {complaint.history?.length ? (
                  complaint.history.map((item, index) => (
                    <article key={item._id} className="relative grid grid-cols-[32px_1fr] gap-3 pb-7 last:pb-0">
                      {index < complaint.history.length - 1 ? <span className="absolute bottom-0 left-[15px] top-8 w-px bg-line" /> : null}
                      <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-panel text-brand shadow-sm">
                        {index === 0 ? <CheckCircle2 size={15} /> : <Clock3 size={14} />}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-semibold text-ink">{item.changedBy?.name || 'Administrator'} updated this request</p>
                          <time className="text-xs text-muted">{formatDate(item.createdAt)}</time>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          {item.oldStatus !== item.newStatus ? (
                            <><Badge className={statusClass(item.oldStatus)}>{item.oldStatus}</Badge><ArrowRight size={14} className="text-muted" /><Badge className={statusClass(item.newStatus)}>{item.newStatus}</Badge></>
                          ) : null}
                          {item.oldPriority !== item.newPriority ? (
                            <><Badge className={priorityClass(item.oldPriority)}>{item.oldPriority}</Badge><ArrowRight size={14} className="text-muted" /><Badge className={priorityClass(item.newPriority)}>{item.newPriority}</Badge></>
                          ) : null}
                        </div>
                        {item.note ? <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-6 text-muted dark:bg-slate-900">{item.note}</p> : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-line px-5 py-8 text-center">
                    <p className="text-sm font-semibold text-ink">Awaiting the first update</p>
                    <p className="mt-1 text-xs text-muted">Status changes and admin notes will appear here.</p>
                  </div>
                )}
              </div>
            </Surface>
          </div>

          <aside className="grid h-fit gap-5 xl:sticky xl:top-28">
            {isAdmin ? (
              <Surface className="p-5">
                <h2 className="text-lg font-bold text-ink">Manage complaint</h2>
                <p className="mt-1 text-sm leading-6 text-muted">Update progress and leave a clear note for the resident.</p>
                {complaint.status === 'Resolved' ? (
                  <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                    <CheckCircle2 className="mb-2" size={20} /> This complaint is resolved and closed.
                  </div>
                ) : (
                  <form className="mt-5 grid gap-4" onSubmit={updateComplaint}>
                    <Field id="status" label="Status">
                      <select id="status" className="input-control" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                        {options.statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </Field>
                    <Field id="priority" label="Priority">
                      <select id="priority" className="input-control" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                        {options.priorities.map((priority) => <option key={priority}>{priority}</option>)}
                      </select>
                    </Field>
                    <Field id="note" label="Resident note" hint="Optional, but recommended for clarity.">
                      <textarea
                        id="note"
                        className="input-control min-h-28 resize-y"
                        value={form.note}
                        onChange={(event) => setForm({ ...form, note: event.target.value })}
                        placeholder="Add context about the work or next step..."
                      />
                    </Field>
                    <Button type="submit" loading={saving} loadingText="Saving update..." className="mt-1 w-full"><Save size={17} /> Save update</Button>
                  </form>
                )}
              </Surface>
            ) : null}

            {complaint.resident ? (
              <Surface className="p-5">
                <p className="text-xs font-semibold text-muted">Submitted by</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-muted dark:bg-slate-800"><UserRound size={18} /></span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{complaint.resident.name}</p>
                    {isAdmin ? <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted"><Mail size={12} /> {complaint.resident.email}</p> : <p className="text-xs text-muted">Resident</p>}
                  </div>
                </div>
              </Surface>
            ) : null}
          </aside>
        </div>
      ) : null}
    </section>
  );
};
