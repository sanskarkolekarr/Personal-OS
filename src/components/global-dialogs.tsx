'use client';

import { useAppStore } from '@/stores/app-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/task-form';
import { ProjectForm } from '@/components/projects/project-form';
import { GoalForm } from '@/components/goals/goal-form';
import { NoteForm } from '@/components/knowledge/note-form';
import { ContentForm } from '@/components/content/content-form';

export function GlobalDialogs() {
  const { quickAddOpen, quickAddType, closeQuickAdd } = useAppStore();

  const getTitle = () => {
    switch (quickAddType) {
      case 'task': return 'Create New Task';
      case 'project': return 'Create New Project';
      case 'goal': return 'Create New Goal';
      case 'note': return 'Create New Note';
      case 'content': return 'Create Content Idea';
      default: return 'Quick Add';
    }
  };

  return (
    <Dialog open={quickAddOpen} onOpenChange={(open) => !open && closeQuickAdd()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {quickAddType === 'task' && <TaskForm />}
          {quickAddType === 'project' && <ProjectForm />}
          {quickAddType === 'goal' && <GoalForm />}
          {quickAddType === 'note' && <NoteForm />}
          {quickAddType === 'content' && <ContentForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
