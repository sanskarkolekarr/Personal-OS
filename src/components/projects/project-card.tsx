'use client';

import { Project } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, isPast, isToday } from 'date-fns';
import { PRIORITIES, PROJECT_STATUSES } from '@/lib/constants';
import { CalendarIcon, CheckSquare, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const priority = PRIORITIES.find(p => p.value === project.priority);
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  
  const isOverdue = project.deadline && isPast(new Date(project.deadline)) && !isToday(new Date(project.deadline)) && project.status !== 'completed';

  return (
    <Card 
      className="glass-card hover:border-primary/30 transition-all group flex flex-col h-full cursor-pointer"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold leading-none mb-1 line-clamp-1" title={project.name}>{project.name}</h3>
              {status && (
                <span className={cn("text-[10px] font-medium uppercase tracking-wider", status.textColor)}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
          {priority && (
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-none", priority.bgColor, priority.textColor)}>
              {priority.label}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {project.description || 'No description provided.'}
        </p>

        <div className="space-y-3 mt-auto">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Progress</span>
              <span className="text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" title="Linked Tasks">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{project.task_count || 0} tasks</span>
            </div>

            {project.deadline && (
              <div className={cn(
                "flex items-center gap-1.5",
                isOverdue ? "text-destructive font-medium" : ""
              )}>
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
