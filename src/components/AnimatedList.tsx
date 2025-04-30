import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
}

export function AnimatedList({ children }: AnimatedListProps) {
  return (
    <div className="space-y-4">
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}