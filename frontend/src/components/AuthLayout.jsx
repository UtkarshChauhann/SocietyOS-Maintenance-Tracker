import { motion } from 'framer-motion';
import { CheckCircle2, Moon, ShieldCheck, Sun, UsersRound } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const AuthLayout = ({ eyebrow, title, description, children, footer }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,.95fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:min-h-screen lg:flex-col xl:p-14">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,118,110,.34),transparent_48%,rgba(37,99,235,.18))]" />
        <div className="relative z-10">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 my-auto max-w-xl"
        >
          <p className="text-sm font-semibold text-teal-300">A better run community</p>
          <h2 className="mt-4 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
            Every request. Clearly tracked. Thoughtfully resolved.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            A calm, transparent workspace for residents and society teams to keep everyday operations moving.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <ShieldCheck className="text-teal-300" size={22} />
              <p className="mt-3 text-sm font-semibold">Secure by design</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Protected accounts and role-based access.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
              <UsersRound className="text-blue-300" size={22} />
              <p className="mt-3 text-sm font-semibold">Built for community</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">One shared source of truth for every update.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-3 text-xs text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-400" />
          Society services are online
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="absolute right-5 top-5 flex items-center gap-2 lg:right-8 lg:top-8">
          <button
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-panel text-muted shadow-sm transition hover:text-ink"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden"><Logo /></div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-7 text-sm text-muted">{footer}</div> : null}
        </motion.div>
      </section>
    </main>
  );
};
