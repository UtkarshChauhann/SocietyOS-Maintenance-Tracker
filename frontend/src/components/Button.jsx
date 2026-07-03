import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  loading = false,
  loadingText,
  ...props
}) => {
  const variants = {
    primary: 'bg-brand-button text-white shadow-md shadow-teal-900/10 hover:shadow-lg hover:shadow-teal-900/20 dark:text-slate-950',
    secondary: 'border border-line bg-panel text-ink shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-800',
    ghost: 'text-muted hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white shadow-md shadow-rose-900/10 hover:bg-rose-700 hover:shadow-lg'
  };
  const sizes = {
    sm: 'min-h-9 px-3 py-1.5 text-xs',
    md: 'min-h-11 px-4 py-2.5 text-sm',
    lg: 'min-h-12 px-5 py-3 text-sm'
  };
  const isDisabled = props.disabled || loading;
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      whileHover={isDisabled ? undefined : { y: -2 }}
      whileTap={isDisabled ? undefined : { y: 0, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className={`button-ripple focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : null}
      {loading && loadingText ? loadingText : children}
    </MotionComponent>
  );
};
