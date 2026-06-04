'use client';

import { useState } from 'react';
import { useContent } from '@/hooks/use-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, PenTool, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentCard } from '@/components/content/content-card';
import { useAppStore } from '@/stores/app-store';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContentPage() {
  const { content: contentItems, loading } = useContent();
  const { openQuickAdd } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredContent = contentItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Pipeline</h1>
          <p className="text-muted-foreground">Manage your content creation from idea to published.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-8 bg-background/50 backdrop-blur"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList className="bg-background/50 backdrop-blur border border-border/50">
              <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => openQuickAdd('content')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Idea</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="relative w-full sm:hidden shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search content..."
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
        ) : filteredContent.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-20">
            <PenTool className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>No content ideas found.</p>
          </div>
        ) : (
          <div className={`gap-4 pb-6 overflow-auto h-full ${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'}`}>
            <AnimatePresence>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={view === 'list' ? 'w-full' : ''}
                >
                  <ContentCard item={item} isListView={view === 'list'} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
