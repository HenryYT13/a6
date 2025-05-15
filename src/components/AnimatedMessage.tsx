import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function AnimatedMessage({ message, type }: AnimatedMessageProps) {
  const bgColor = {
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100',
    error: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
  }[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 p-4 rounded text-center font-inter ${bgColor}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}