import { Camera, CheckCircle2, ChevronRight, FileImage, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Surface } from '../components/Surface.jsx';

export const NewComplaintPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: '', description: '', photo: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const previewUrl = useMemo(() => (form.photo ? URL.createObjectURL(form.photo) : ''), [form.photo]);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  useEffect(() => {
    api
      .get('/options')
      .then(({ data }) => {
        setCategories(data.categories);
        setForm((current) => ({ ...current, category: data.categories[0] || '' }));
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const payload = new FormData();
    payload.append('category', form.category);
    payload.append('description', form.description);
    if (form.photo) payload.append('photo', form.photo);

    try {
      const { data } = await api.post('/complaints', payload);
      navigate(`/complaints/${data.complaint._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-7">
      <PageHeader
        eyebrow="Maintenance request"
        title="Tell us what needs attention"
        description="Share the essential details so the society team can route and resolve your request quickly."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Surface as="form" className="grid gap-6 p-5 sm:p-7" onSubmit={submit}>
          <Alert>{error}</Alert>
          <Field id="category" label="Issue category">
            <select
              id="category"
              className="input-control"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              required
            >
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>

          <Field id="description" label="What happened?" hint={`${form.description.length}/1000 characters`}>
            <textarea
              id="description"
              className="input-control min-h-40 resize-y"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Describe the issue, where it is located, and anything the team should know."
              minLength={10}
              maxLength={1000}
              required
            />
          </Field>

          <Field id="photo" label="Supporting photo" hint="JPG, PNG, GIF, or WebP up to 5 MB.">
            <div className="relative rounded-lg border border-dashed border-line bg-slate-50 p-4 transition hover:border-brand dark:bg-slate-900">
              <input
                id="photo"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                onChange={(event) => setForm({ ...form, photo: event.target.files?.[0] || null })}
                aria-describedby="photo-help"
              />
              {previewUrl ? (
                <div className="flex items-center gap-4">
                  <img className="h-20 w-20 rounded-lg object-cover" src={previewUrl} alt="Selected complaint attachment preview" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{form.photo.name}</p>
                    <p className="mt-1 text-xs text-muted">{(form.photo.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    className="focus-ring relative z-20 grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-muted hover:text-rose-600"
                    type="button"
                    onClick={() => setForm({ ...form, photo: null })}
                    aria-label="Remove selected photo"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <div className="grid place-items-center py-5 text-center">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><UploadCloud size={21} /></span>
                  <p className="mt-3 text-sm font-semibold text-ink">Choose a photo to upload</p>
                  <p id="photo-help" className="mt-1 text-xs text-muted">A clear photo helps the team assess the issue faster.</p>
                </div>
              )}
            </div>
          </Field>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => navigate('/complaints')}>Cancel</Button>
            <Button type="submit" loading={loading} loadingText="Submitting request...">
              Submit complaint <ChevronRight size={17} />
            </Button>
          </div>
        </Surface>

        <aside className="grid h-fit gap-4 lg:sticky lg:top-28">
          <Surface className="p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><ShieldCheck size={19} /></span>
            <h2 className="mt-4 font-bold text-ink">What happens next</h2>
            <ol className="mt-4 grid gap-4">
              {[
                ['Request logged', 'Your issue is added to the maintenance queue.'],
                ['Team review', 'An admin reviews and prioritizes the request.'],
                ['Progress updates', 'Every status change appears in your timeline.']
              ].map(([title, description], index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-muted dark:bg-slate-800">{index + 1}</span>
                  <span><span className="block text-sm font-semibold text-ink">{title}</span><span className="mt-1 block text-xs leading-5 text-muted">{description}</span></span>
                </li>
              ))}
            </ol>
          </Surface>
          <div className="flex items-center gap-3 px-1 text-xs text-muted">
            <CheckCircle2 size={16} className="text-emerald-500" /> Your request is visible only to you and society admins.
          </div>
        </aside>
      </div>
    </section>
  );
};
