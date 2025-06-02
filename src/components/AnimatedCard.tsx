import { motion } from 'framer-motion';

export default function AnimatedCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="border rounded-lg p-4 hover:shadow-lg"
    >
      {children}
    </motion.div>
  );
}
