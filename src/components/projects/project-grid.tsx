'use client';

import { Project } from '@/types';
import { ProjectCard } from './project-card';
import { cn } from '@/lib/utils';

interface ProjectGridProps {
  projects: Project[];
  isListView?: boolean;
}

export function ProjectGrid({ projects, isListView }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-20">
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4 pb-6",
      isListView ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    )}>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
