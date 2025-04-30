import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { InputProps } from '@radix-ui/react-label';
import { forwardRef } from 'react';

export const AnimatedInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Input
        ref={ref}
        {...props}
        className={`transition-all duration-200 ${props.className}`}
        style={{
          transformOrigin: 'left'
        }}
      />
    </motion.div>
  );
});

AnimatedInput.displayName = 'AnimatedInput';