'use client';

import { useAppStore } from '@/stores/app-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProjectForm } from '@/components/projects/project-form';
import { GoalForm } from '@/components/goals/goal-form';
import { NoteForm } from '@/components/knowledge/note-form';
import { ContentForm } from '@/components/content/content-form';

export function GlobalDialogs() {
  const { quickAddOpen, quickAddType, activeItem, closeQuickAdd } = useAppStore();

  const getTitle = () => {
    const action = activeItem ? 'Edit' : 'Create New';
    switch (quickAddType) {
      case 'project': return `${action} Project`;
      case 'goal': return `${action} Goal`;
      case 'note': return `${action} Note`;
      case 'content': return activeItem ? 'Edit Content Idea' : 'Create Content Idea';
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
          {quickAddType === 'project' && <ProjectForm project={activeItem} />}
          {quickAddType === 'goal' && <GoalForm goal={activeItem} />}
          {quickAddType === 'note' && <NoteForm note={activeItem} />}
          {quickAddType === 'content' && <ContentForm item={activeItem} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
