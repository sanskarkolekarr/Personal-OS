
'use client';

import {
  ProjectProgressWidget,
  GoalProgressWidget,
  QuickAddWidget
} from '@/components/dashboard/widgets';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning</h1>
          <p className="text-muted-foreground">Here's an overview of your life operating system.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="col-span-1 lg:col-span-2">
          <ProjectProgressWidget />
        </div>

        <div className="col-span-1">
          <QuickAddWidget />
        </div>

        <div className="col-span-1 lg:col-span-3">
          <GoalProgressWidget />
        </div>
      </div>
    </div>
  );
}
