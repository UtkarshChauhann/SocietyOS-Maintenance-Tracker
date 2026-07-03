import { animate, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const CountUp = ({ value, className = '' }) => {
  const numericValue = Number(value) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return controls.stop;
  }, [numericValue]);

  return <span className={className}>{display}</span>;
};
