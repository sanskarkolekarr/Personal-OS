'use client';

import { Note } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  // Simple extraction of tags if we support it later, or just show folder
  
  return (
    <Card className="glass-card hover:border-primary/30 transition-all group flex flex-col h-full cursor-pointer h-48">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 mt-0.5`}>
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight line-clamp-2" title={note.title}>{note.title}</h3>
          </div>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 break-words">
          {/* Note: we would normally strip HTML/Markdown for preview. */}
          {note.content?.substring(0, 150) || 'Empty note...'}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
          {note.folder_id && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              {note.folder_id}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {format(new Date(note.updated_at), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
