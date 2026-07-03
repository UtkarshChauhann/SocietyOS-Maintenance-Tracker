import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Alert = ({ type = 'error', children, onDismiss }) => {
  if (!children) return null;
  const variants = {
    success: {
      styles: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200',
      icon: CheckCircle2
    },
    info: {
      styles: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-200',
      icon: Info
    },
    error: {
      styles: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200',
      icon: AlertCircle
    }
  };
  const current = variants[type] || variants.error;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${current.styles}`}
        role="alert"
      >
        <Icon className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <span className="flex-1">{children}</span>
        {onDismiss ? (
          <button className="focus-ring rounded p-0.5" type="button" onClick={onDismiss} aria-label="Dismiss message">
            <X size={16} />
          </button>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};
