import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ButtonProps } from '@radix-ui/react-dropdown-menu';

export function AnimatedButton({ children, ...props }: ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
}