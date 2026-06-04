'use client';

import { useTasks } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { useGoals } from '@/hooks/use-goals';
import { useAnalytics } from '@/hooks/use-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, FolderKanban, Target, TrendingUp, Activity, Plus, BookOpen, Pen } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { PRIORITIES, TASK_CATEGORIES } from '@/lib/constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

// Helper to get priority color dot
const getPriorityColor = (value: string) => {
  return PRIORITIES.find(p => p.value === value)?.dotColor || 'bg-slate-500';
};

// 1. Priorities Card
export function PrioritiesCard() {
  const { tasks } = useTasks();
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').slice(0, 3);

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-red-500" />
          Top Priorities
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {highPriority.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            No high priority tasks!
          </div>
        ) : (
          highPriority.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {task.due_date ? format(new Date(task.due_date), 'MMM d') : 'No date'}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// 2. Pending Tasks
export function PendingTasksWidget() {
  const { pendingTasks } = useTasks();
  
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="h-5 w-5 text-blue-500" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{pendingTasks.length}</div>
        <p className="text-xs text-muted-foreground mt-1">Require your attention</p>
      </CardContent>
    </Card>
  );
}

// 3. Upcoming Deadlines
export function UpcomingDeadlinesWidget() {
  const { upcomingDeadlines } = useTasks();

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-amber-500" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {upcomingDeadlines.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No upcoming deadlines
          </div>
        ) : (
          upcomingDeadlines.slice(0, 4).map(task => {
            const isTaskToday = task.due_date && isToday(new Date(task.due_date));
            return (
              <div key={task.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate flex-1">{task.title}</span>
                <Badge variant={isTaskToday ? "destructive" : "secondary"} className="shrink-0 text-[10px] px-1.5 py-0.5">
                  {task.due_date ? format(new Date(task.due_date), 'MMM d') : ''}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// 4. Project Progress
export function ProjectProgressWidget() {
  const { activeProjects } = useProjects();
  
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderKanban className="h-5 w-5 text-purple-500" />
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeProjects.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No active projects
          </div>
        ) : (
          activeProjects.slice(0, 3).map(project => (
            <div key={project.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate pr-2">{project.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// 5. Goal Progress
export function GoalProgressWidget() {
  const { activeGoals } = useGoals();
  const topGoals = activeGoals.sort((a, b) => b.progress - a.progress).slice(0, 2);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-emerald-500" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {topGoals.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No active goals
          </div>
        ) : (
          topGoals.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate pr-2">{goal.title}</span>
                <span className="text-xs font-bold text-primary shrink-0">{goal.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden border border-border/50">
                <div 
                  className="bg-gradient-primary h-full transition-all duration-500" 
                  style={{ width: `${goal.progress}%` }} 
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// 6. Productivity Score Chart
export function ProductivityScoreWidget() {
  const { data } = useAnalytics();
  
  // Format data for Recharts
  const chartData = data.weeklyProductivity.map((count, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - index));
    return {
      name: ['S','M','T','W','T','F','S'][d.getDay()],
      tasks: count
    };
  });

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Output
        </CardTitle>
        <CardDescription>Tasks completed in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[120px] pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.18 270)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="oklch(0.65 0.18 270)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: 'oklch(0.13 0.015 270)', borderColor: 'oklch(0.2 0.02 270)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="tasks" stroke="oklch(0.65 0.18 270)" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// 7. Focus Area Widget
export function FocusAreaWidget() {
  const { data } = useAnalytics();
  
  const topCategory = data.categoryBreakdown.length > 0 
    ? data.categoryBreakdown.reduce((prev, current) => (prev.count > current.count) ? prev : current).category 
    : 'operations';
    
  const categoryDef = TASK_CATEGORIES.find(c => c.value === topCategory);

  return (
    <Card className="glass-card h-full bg-gradient-to-br from-background to-secondary/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-indigo-500" />
          Current Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold capitalize gradient-text pb-1">
            {categoryDef?.label || 'General'}
          </span>
          <span className="text-sm text-muted-foreground">
            Most active category this week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// 8. Quick Add Widget
export function QuickAddWidget() {
  const { openQuickAdd } = useAppStore();

  return (
    <Card className="glass-card h-full border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-14 flex flex-col gap-1" onClick={() => openQuickAdd('task')}>
            <CheckSquare className="h-4 w-4" />
            <span className="text-xs">Task</span>
          </Button>
          <Button variant="outline" className="h-14 flex flex-col gap-1" onClick={() => openQuickAdd('note')}>
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Note</span>
          </Button>
          <Button variant="outline" className="h-14 flex flex-col gap-1" onClick={() => openQuickAdd('project')}>
            <FolderKanban className="h-4 w-4" />
            <span className="text-xs">Project</span>
          </Button>
          <Button variant="outline" className="h-14 flex flex-col gap-1" onClick={() => openQuickAdd('content')}>
            <Pen className="h-4 w-4" />
            <span className="text-xs">Idea</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
