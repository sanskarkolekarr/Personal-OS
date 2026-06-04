'use client';

import { Goal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isToday } from 'date-fns';
import { CalendarIcon, Target, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
}

const STATUS_COLORS = {
  active: 'text-primary bg-primary/10',
  completed: 'text-emerald-500 bg-emerald-500/10',
  abandoned: 'text-muted-foreground bg-muted',
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  yearly:    { bg: 'bg-violet-500/10', text: 'text-violet-500' },
  quarterly: { bg: 'bg-amber-500/10',  text: 'text-amber-500' },
  monthly:   { bg: 'bg-sky-500/10',    text: 'text-sky-500' },
  weekly:    { bg: 'bg-emerald-500/10',text: 'text-emerald-500' },
  daily:     { bg: 'bg-rose-500/10',   text: 'text-rose-500' },
};

export function GoalCard({ goal }: GoalCardProps) {
  const typeColor = TYPE_COLORS[goal.type] || { bg: 'bg-primary/10', text: 'text-primary' };
  const isOverdue = goal.deadline
    && !isToday(new Date(goal.deadline))
    && isPast(new Date(goal.deadline))
    && goal.status !== 'completed';

  const completedMilestones = goal.milestones?.filter(m => m.completed).length ?? 0;
  const totalMilestones = goal.milestones?.length ?? 0;
  const progress = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : goal.progress;

  return (
    <Card className="glass-card hover:border-primary/30 transition-all group flex flex-col h-full overflow-hidden">
      {/* Accent bar */}
      <div className={cn('h-1 w-full', typeColor.bg)} />

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold leading-snug line-clamp-2">{goal.title}</h3>
            <span className={cn('text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm', STATUS_COLORS[goal.status])}>
              {goal.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {goal.description || 'No description provided.'}
        </p>

        {/* Progress */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Progress</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden border border-border/50">
            <div
              className="bg-gradient-primary h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Milestones preview */}
        {totalMilestones > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {goal.milestones.slice(0, 4).map(m => (
              <div key={m.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                {m.completed
                  ? <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  : <Circle className="h-3 w-3" />}
                <span className={cn('line-clamp-1', m.completed && 'line-through opacity-50')}>{m.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
          <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5 border-none', typeColor.bg, typeColor.text)}>
            {goal.type}
          </Badge>

          {goal.deadline && (
            <div className={cn(
              'flex items-center gap-1.5 text-xs',
              isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
            )}>
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(new Date(goal.deadline), 'MMM yyyy')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
