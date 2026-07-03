import { motion } from 'framer-motion';

export const PageHeader = ({ eyebrow, title, description, actions, children }) => (
  <motion.header
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
  >
    <div className="max-w-2xl">
      {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-6 text-muted sm:text-base">{description}</p> : null}
      {children}
    </div>
    {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
  </motion.header>
);
