import { motion } from "framer-motion";

export const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white/[0.03] border border-white/10 rounded-[24px] backdrop-blur-xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);