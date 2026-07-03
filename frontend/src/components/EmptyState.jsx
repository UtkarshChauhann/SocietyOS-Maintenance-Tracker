import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="surface grid min-h-64 place-items-center border-dashed p-8 text-center"
  >
    <div className="max-w-sm">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  </motion.div>
);
