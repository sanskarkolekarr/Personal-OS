
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/use-projects';
import { useProjectTasks } from '@/hooks/use-project-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, createTask, toggleTaskCompletion, deleteTask } = useProjectTasks(id);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const project = projects.find(p => p.id === id);

  if (projectsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button onClick={() => router.push('/projects')}>Go back</Button>
      </div>
    );
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task = await createTask({
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      category: 'operations',
      status: 'pending',
      due_date: null,
    } as any);

    if (task) {
      setNewTaskTitle('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <Button variant="ghost" className="gap-2 -ml-4" onClick={() => router.push('/projects')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="glass-card p-6 sm:p-8 rounded-xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-primary"></div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-text">{project.name}</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          {project.description || 'No description provided.'}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Overall Progress</span>
            <span className="font-bold text-primary">{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden border border-border/50">
            <motion.div
              className="bg-gradient-primary h-full shadow-[0_0_10px_oklch(var(--primary)_/_0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex-1 flex flex-col min-h-0 glass-card rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Project Tasks
        </h2>

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6 shrink-0">
          <Input 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="bg-background/50 border-primary/20 focus-visible:border-primary"
          />
          <Button type="submit" disabled={!newTaskTitle.trim()} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-auto pr-2 space-y-2">
          {tasksLoading ? (
             <div className="flex justify-center p-8 text-muted-foreground">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              No tasks yet. Add one above to get started!
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map(task => {
                const isCompleted = task.status === 'completed';
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg border border-border/50 transition-all",
                      isCompleted ? "bg-secondary/30 opacity-70" : "glass hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={(checked) => toggleTaskCompletion(task.id, !!checked)}
                        className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className={cn(
                        "font-medium truncate transition-all",
                        isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {task.title}
                      </span>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

    </div>
  );
}
