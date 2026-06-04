'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTasks } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, RefreshCw, Plus } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { openQuickAdd } = useAppStore();
  const [events, setEvents] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Map tasks and projects to FullCalendar event format
    const taskEvents = tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      date: task.due_date || undefined,
      allDay: true,
      backgroundColor: task.priority === 'high' ? 'var(--chart-1)' : task.priority === 'medium' ? 'var(--chart-5)' : 'var(--chart-2)',
      borderColor: 'transparent',
      extendedProps: { type: 'task', original: task }
    })).filter(e => e.date);

    const projectEvents = projects.map((project) => ({
      id: `proj-${project.id}`,
      title: `[Project] ${project.name}`,
      date: project.deadline || undefined,
      allDay: true,
      backgroundColor: 'var(--chart-3)',
      borderColor: 'transparent',
      extendedProps: { type: 'project', original: project }
    })).filter(e => e.date);

    setEvents([...taskEvents, ...projectEvents]);
  }, [tasks, projects]);

  const handleDateClick = (arg: any) => {
    // Open Quick Add pre-filled with date (if supported by Quick Add)
    openQuickAdd('task');
  };

  const handleEventClick = (arg: any) => {
    toast(`Clicked on ${arg.event.title}`);
  };

  const syncWithGoogle = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/calendar/sync', { method: 'POST' });
      const data = await res.json();
      
      if (res.status === 401) {
        // Not authenticated, redirect to Google Auth
        window.location.href = '/api/calendar/auth';
        return;
      }
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(data.message || 'Synced successfully!');
    } catch (error: any) {
      toast.error('Sync failed', { description: error.message });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Calendar
          </h1>
          <p className="text-muted-foreground">Manage your schedule and sync with Google Calendar.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={syncWithGoogle} disabled={isSyncing}>
            {isSyncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sync with Google
          </Button>
          <Button onClick={() => openQuickAdd('task')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Button>
        </div>
      </div>

      <Card className="glass-card flex-1 min-h-[600px] p-4 flex flex-col overflow-hidden [&_.fc-theme-standard_.fc-scrollgrid]:border-border/50 [&_.fc-theme-standard_td]:border-border/50 [&_.fc-theme-standard_th]:border-border/50 [&_.fc-button-primary]:bg-primary [&_.fc-button-primary]:border-primary [&_.fc-button-primary:not(:disabled).fc-button-active]:bg-primary/80 [&_.fc-button-primary:not(:disabled):hover]:bg-primary/90 [&_.fc-toolbar-title]:text-foreground [&_.fc-col-header-cell-cushion]:text-foreground [&_.fc-daygrid-day-number]:text-muted-foreground [&_.fc-day-today]:bg-primary/5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="100%"
          navLinks={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </Card>
    </div>
  );
}
