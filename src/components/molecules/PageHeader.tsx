import React from 'react';
import { motion } from 'framer-motion';

export interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <motion.div
    className="page-header flex flex-col gap-1 text-[var(--white-color)] mt-2"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <motion.h2
      className='font-bold text-2xl'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      {title}
    </motion.h2>
    <motion.p
      className='text-sm font-medium'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      {subtitle}
    </motion.p>
  </motion.div>
);

export default PageHeader;
