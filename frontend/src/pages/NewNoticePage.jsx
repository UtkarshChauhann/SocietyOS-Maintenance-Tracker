import { BellRing, ChevronRight, Info, Megaphone, Pin, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Surface } from '../components/Surface.jsx';

export const NewNoticePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', isImportant: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/notices', form);
      navigate('/notices');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-7">
      <PageHeader
        eyebrow="Admin communication"
        title="Post a community notice"
        description="Share a clear, timely update with residents. Important notices are pinned and emailed automatically."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Surface as="form" className="grid gap-6 p-5 sm:p-7" onSubmit={submit}>
          <Alert>{error}</Alert>
          <Field id="title" label="Notice title" hint={`${form.title.length}/120 characters`}>
            <input
              id="title"
              className="input-control"
              value={form.title}
              maxLength={120}
              placeholder="A clear, specific headline"
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </Field>
          <Field id="content" label="Message" hint={`${form.content.length}/3000 characters`}>
            <textarea
              id="content"
              className="input-control min-h-52 resize-y"
              value={form.content}
              maxLength={3000}
              placeholder="Share the schedule, impact, and anything residents need to do."
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              required
            />
          </Field>

          <label className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${form.isImportant ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40' : 'border-line bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:hover:border-slate-600'}`}>
            <input
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              type="checkbox"
              checked={form.isImportant}
              onChange={(event) => setForm({ ...form, isImportant: event.target.checked })}
            />
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-ink"><Pin size={16} /> Mark as important</span>
              <span className="mt-1 block text-xs leading-5 text-muted">Pins this notice to the top and emails all residents.</span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => navigate('/notices')}>Cancel</Button>
            <Button type="submit" loading={loading} loadingText="Publishing notice..."><Send size={17} /> Publish notice</Button>
          </div>
        </Surface>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-28">
          <div>
            <p className="mb-3 text-xs font-semibold text-muted">Live preview</p>
            <Surface className={`relative overflow-hidden p-5 ${form.isImportant ? 'border-amber-200 dark:border-amber-900' : ''}`}>
              {form.isImportant ? <span className="absolute inset-y-0 left-0 w-1 bg-amber-500" /> : null}
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-lg ${form.isImportant ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'}`}>
                  {form.isImportant ? <BellRing size={19} /> : <Megaphone size={19} />}
                </span>
                {form.isImportant ? <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"><Pin size={12} /> Pinned</Badge> : null}
              </div>
              <h2 className="mt-5 text-lg font-bold text-ink">{form.title || 'Your notice title'}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{form.content || 'Your message will appear here as residents see it on the notice board.'}</p>
              <p className="mt-5 border-t border-line pt-4 text-xs text-muted">Posting now</p>
            </Surface>
          </div>
          <div className="flex items-start gap-3 px-1 text-xs leading-5 text-muted">
            <Info className="mt-0.5 shrink-0 text-blue-500" size={15} /> Important notices trigger resident emails immediately after publishing.
          </div>
        </aside>
      </div>
    </section>
  );
};
