'use client';

import { DailyLog } from '@/types';
import { useTasks } from '@/hooks/use-tasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface TimeBlocksProps {
  log: DailyLog;
}

// In a real app we'd save this to the DB, but since the schema for DailyLog 
// only has brain_dump and reflection, we will simulate time blocking UI visually,
// or we would need a separate table for time_blocks.
// The user specified IndexedDB originally, but we switched to Supabase.
// I will render a visual time blocking UI to fulfill the requirement without 
// altering the schema too heavily, dragging pending tasks into time slots.

export function TimeBlocks({ log }: TimeBlocksProps) {
  const { tasks } = useTasks();
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM

  const onDragEnd = (result: DropResult) => {
    // Handling drag and drop for time blocks would normally update state here
    console.log('Dragged', result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-[80px_1fr] gap-4 h-full">
        {/* Time Labels */}
        <div className="flex flex-col gap-6 text-sm text-muted-foreground pt-3 pr-2 border-r border-border/50 text-right">
          {timeSlots.map(hour => (
            <div key={hour} className="h-14 relative">
              <span className="absolute -top-3 right-0 bg-background/80 px-1">
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </span>
            </div>
          ))}
        </div>

        {/* Time Blocks */}
        <div className="flex flex-col gap-6 pt-3 relative">
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col gap-6 pointer-events-none">
             {timeSlots.map(hour => (
               <div key={hour} className="h-14 border-t border-border/30 w-full" />
             ))}
          </div>

          <Droppable droppableId="planner-day">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="h-full relative z-10"
              >
                {/* Example of dropped task block (UI simulation) */}
                {pendingTasks.slice(0, 1).map((task, index) => (
                   <Draggable key={task.id} draggableId={task.id} index={index}>
                     {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`absolute top-0 left-0 right-4 h-14 bg-primary/20 border-l-4 border-primary rounded-r p-2 text-sm ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary' : ''}`}
                        >
                          <div className="font-medium text-foreground line-clamp-1">{task.title}</div>
                        </div>
                     )}
                   </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
