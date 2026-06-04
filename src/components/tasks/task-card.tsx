'use client';

import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isPast, isToday } from 'date-fns';
import { PRIORITIES, TASK_CATEGORIES } from '@/lib/constants';
import { CalendarIcon, GripVertical, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/use-tasks';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { updateTask } = useTasks();
  const priority = PRIORITIES.find(p => p.value === task.priority);
  const category = TASK_CATEGORIES.find(c => c.value === task.category);
  
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'completed';
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  return (
    <Card 
      className={cn(
        "glass-card hover:border-primary/30 transition-all cursor-pointer group",
        isDragging && "opacity-50 border-primary scale-[1.02]",
        task.status === 'completed' && "opacity-60 bg-muted/20"
      )}
    >
      <CardContent className="p-3">
        <div className="flex gap-2">
          {/* Drag Handle & Status Toggle */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 mt-0.5">
            <div className="text-muted-foreground/30 group-hover:text-muted-foreground/50 cursor-grab active:cursor-grabbing p-0.5">
              <GripVertical className="h-4 w-4" />
            </div>
            <button 
              onClick={toggleStatus}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              {priority && (
                <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 border-none", priority.bgColor, priority.textColor)}>
                  {priority.label}
                </Badge>
              )}
              {category && (
                <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 border-none", category.bgColor, category.textColor)}>
                  {category.label}
                </Badge>
              )}
            </div>

            {/* Title */}
            <p className={cn(
              "text-sm font-medium leading-snug break-words mb-2",
              task.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </p>

            {/* Date Footer */}
            {task.due_date && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs",
                isOverdue ? "text-destructive font-medium" : 
                isDueToday ? "text-amber-500 font-medium" : 
                "text-muted-foreground"
              )}>
                <CalendarIcon className="h-3 w-3" />
                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
