'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, LayoutGrid, List, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskKanban } from '@/components/tasks/task-kanban';
import { TaskList } from '@/components/tasks/task-list';
import { useAppStore } from '@/stores/app-store';
// import { TaskCalendar } from '@/components/tasks/task-calendar'; // Will add if needed

export default function TasksPage() {
  const { tasks, loading } = useTasks();
  const { openQuickAdd } = useAppStore();
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your priorities and execution.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 bg-background/50 backdrop-blur"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList className="bg-background/50 backdrop-blur border border-border/50">
              <TabsTrigger value="kanban"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
              {/* <TabsTrigger value="calendar"><CalendarIcon className="h-4 w-4" /></TabsTrigger> */}
            </TabsList>
          </Tabs>
          
          <Button onClick={() => openQuickAdd('task')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="relative w-full sm:hidden shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8 bg-background/50 backdrop-blur"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'kanban' && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <TaskKanban tasks={filteredTasks} />
              </motion.div>
            )}
            {view === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full overflow-auto"
              >
                <TaskList tasks={filteredTasks} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
