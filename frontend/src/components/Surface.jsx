import { motion } from "framer-motion";
import { useMemo } from "react";

export const Surface = ({
  as = "article",
  interactive = false,
  className = "",
  children,
  ...props
}) => {
  const MotionComponent = useMemo(() => motion.create(as), [as]);

  return (
    <MotionComponent
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`surface ${
        interactive ? "transition-shadow hover:shadow-lift" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};