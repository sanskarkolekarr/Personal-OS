'use client';

import { useEffect, useState } from 'react';
import { useDailyLogs } from '@/hooks/use-daily-logs';
import { usePlannerStore } from '@/stores/planner-store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailyLog } from '@/types';

export default function PlannerPage() {
  const { selectedDate, setSelectedDate, goToNextDay, goToPrevDay } = usePlannerStore();
  const { logs, getOrCreateLog } = useDailyLogs();
  const [activeLog, setActiveLog] = useState<DailyLog | null>(null);
  const [calOpen, setCalOpen] = useState(false);

  const selectedDateObj = parseISO(selectedDate);

  useEffect(() => {
    const found = logs.find(l => l.date === selectedDate) || null;
    setActiveLog(found);
  }, [logs, selectedDate]);

  const handleCreateLog = async () => {
    const log = await getOrCreateLog(selectedDate);
    if (log) setActiveLog(log);
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
          <p className="text-muted-foreground">Plan your day, reflect, and capture your thoughts.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-background/50 backdrop-blur border border-border/50 rounded-lg p-1">
          <Button variant="ghost" size="icon" onClick={goToPrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-foreground hover:bg-accent transition-colors w-[200px]">
              <CalendarIcon className="h-4 w-4" />
              {format(selectedDateObj, "PPP")}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDateObj}
                onSelect={(d) => {
                  if (d) {
                    setSelectedDate(format(d, 'yyyy-MM-dd'));
                    setCalOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!activeLog ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/60 rounded-xl bg-background/30 backdrop-blur">
          <p className="text-muted-foreground mb-4">
            No planner entry for {format(selectedDateObj, 'MMMM d, yyyy')}
          </p>
          <Button onClick={handleCreateLog} className="shadow-lg shadow-primary/20">
            Start Planning this Day
          </Button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Time Blocks */}
          <div className="lg:col-span-2 flex flex-col h-full bg-background/30 backdrop-blur border border-border/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-background/50">
              <h2 className="font-semibold text-lg">Time Blocks</h2>
              <p className="text-xs text-muted-foreground">Visual timeline for {format(selectedDateObj, 'EEEE')}</p>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <TimeGrid />
            </div>
          </div>

          {/* Brain Dump */}
          <div className="lg:col-span-1 flex flex-col h-full bg-background/30 backdrop-blur border border-border/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-background/50">
              <h2 className="font-semibold text-lg">Brain Dump & Notes</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <BrainDumpPanel log={activeLog} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Visual time grid ──────────────────────────────────────────────────────────
function TimeGrid() {
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM → 10 PM

  return (
    <div className="relative">
      {hours.map((hour) => (
        <div key={hour} className="grid grid-cols-[64px_1fr] gap-3 mb-1 group">
          <div className="text-right text-xs text-muted-foreground pt-1 select-none">
            {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
          </div>
          <div className="h-12 rounded-md border border-border/30 bg-background/20 hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer flex items-center px-3">
            <span className="text-xs text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
              Click to add block…
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Brain dump + reflection ───────────────────────────────────────────────────
function BrainDumpPanel({ log }: { log: DailyLog }) {
  const { updateLog } = useDailyLogs();
  const [notes, setNotes] = useState(log.notes || '');
  const [reflection, setReflection] = useState(log.reflection || '');
  const [saving, setSaving] = useState(false);

  // Debounced save for notes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (notes !== log.notes) {
        setSaving(true);
        await updateLog(log.id, { notes });
        setSaving(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [notes, log.notes, log.id, updateLog]);

  // Debounced save for reflection
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (reflection !== log.reflection) {
        setSaving(true);
        await updateLog(log.id, { reflection });
        setSaving(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [reflection, log.reflection, log.id, updateLog]);

  return (
    <div className="h-full flex flex-col gap-0 relative group">
      <div className="flex-1 p-4 border-b border-border/30">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes / Brain Dump</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dump your thoughts here, no filter…"
          className="w-full h-full min-h-[200px] bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/40"
        />
      </div>
      <div className="flex-1 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evening Reflection</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="How did the day go? What did you learn?"
          className="w-full h-full min-h-[150px] bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/40"
        />
      </div>
      <div className="absolute bottom-2 right-4 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {saving ? 'Saving…' : 'Auto-saved'}
      </div>
    </div>
  );
}
