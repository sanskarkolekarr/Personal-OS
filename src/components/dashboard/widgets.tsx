'use client';

import { useProjects } from '@/hooks/use-projects';
import { useGoals } from '@/hooks/use-goals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Target, Plus, BookOpen, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';

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
