
'use client';

import {
  ProjectProgressWidget,
  GoalProgressWidget,
  QuickAddWidget
} from '@/components/dashboard/widgets';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning</h1>
          <p className="text-muted-foreground">Here's an overview of your life operating system.</p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <motion.div variants={item} className="col-span-1 lg:col-span-2">
          <ProjectProgressWidget />
        </motion.div>

        <motion.div variants={item} className="col-span-1">
          <QuickAddWidget />
        </motion.div>

        <motion.div variants={item} className="col-span-1 lg:col-span-3">
          <GoalProgressWidget />
        </motion.div>
      </motion.div>
    </div>
  );
}
