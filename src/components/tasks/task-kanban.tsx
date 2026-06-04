'use client';

import { Task } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TASK_STATUSES } from '@/lib/constants';
import { TaskCard } from './task-card';
import { useTasks } from '@/hooks/use-tasks';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const { updateTask } = useTasks();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If moving to a new status column
    if (destination.droppableId !== source.droppableId) {
      updateTask(draggableId, { status: destination.droppableId as any });
    }
    
    // Note: To persist ordering within the same column, we'd need an 'order' field in the DB.
    // Since we don't have one, we just allow the visual drop but don't save exact order.
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ScrollArea className="h-full w-full whitespace-nowrap rounded-lg">
        <div className="flex h-full gap-4 p-1 pb-4">
          {TASK_STATUSES.map((status) => {
            const columnTasks = tasks.filter(t => t.status === status.value);

            return (
              <div key={status.value} className="flex h-full flex-col w-[300px] sm:w-[350px] shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.textColor.replace('text-', 'bg-')}`} />
                    <h3 className="font-semibold">{status.label}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={status.value}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-xl p-2 transition-colors min-h-[150px] ${
                        snapshot.isDraggingOver ? 'bg-secondary/50 border border-primary/20' : 'bg-secondary/20 border border-transparent'
                      }`}
                    >
                      <div className="flex flex-col gap-2 h-full">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                              >
                                <TaskCard task={task} isDragging={snapshot.isDragging} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DragDropContext>
  );
}
