'use client';

import { ContentItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { CONTENT_PLATFORMS, CONTENT_STATUSES } from '@/lib/constants';
import { PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
  isListView?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; textColor: string; bg: string }> = {
  idea:        { label: '💡 Idea',        textColor: 'text-slate-400',   bg: 'bg-slate-500/10' },
  researching: { label: '🔍 Researching', textColor: 'text-purple-400',  bg: 'bg-purple-500/10' },
  drafting:    { label: '✍️ Drafting',    textColor: 'text-blue-400',    bg: 'bg-blue-500/10' },
  ready:       { label: '✅ Ready',       textColor: 'text-amber-400',   bg: 'bg-amber-500/10' },
  posted:      { label: '🚀 Posted',      textColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export function ContentCard({ item, isListView }: ContentCardProps) {
  const platform = CONTENT_PLATFORMS.find(p => p.value === item.platform);
  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.idea;

  return (
    <Card className={cn(
      'glass-card hover:border-primary/30 transition-all group cursor-pointer',
      isListView ? 'flex flex-row items-center p-4' : 'flex flex-col h-48'
    )}>
      {isListView ? (
        /* ── List view ─────────────────────────────────────── */
        <div className="flex w-full items-center gap-4">
          <div className={cn('p-2 rounded-lg shrink-0', platform?.bgColor ?? 'bg-primary/10', platform?.textColor ?? 'text-primary')}>
            <PenTool className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight line-clamp-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{item.notes || 'No notes'}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className={cn('text-xs font-bold px-2 py-1 rounded-md', statusCfg.bg, statusCfg.textColor)}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-muted-foreground w-28 text-right">
              {item.updated_at ? format(new Date(item.updated_at), 'MMM d, yyyy') : '—'}
            </span>
          </div>
        </div>
      ) : (
        /* ── Grid view ─────────────────────────────────────── */
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className={cn('p-2 rounded-lg transition-colors shrink-0', platform?.bgColor ?? 'bg-primary/10', platform?.textColor ?? 'text-primary')}>
              <PenTool className="h-4 w-4" />
            </div>
            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm', statusCfg.bg, statusCfg.textColor)}>
              {item.status}
            </span>
          </div>

          <h3 className="font-semibold leading-tight line-clamp-2 mb-2" title={item.title}>{item.title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {item.notes || 'No notes provided.'}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
            <span className="text-xs font-medium text-muted-foreground">
              {platform?.label ?? item.platform}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.updated_at ? format(new Date(item.updated_at), 'MMM d') : ''}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
