'use client';

import { useState } from 'react';
import { useGoals } from '@/hooks/use-goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalCard } from '@/components/goals/goal-card';
import { useAppStore } from '@/stores/app-store';

export default function GoalsPage() {
  const { goals, loading } = useGoals();
  const { openQuickAdd } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">Track your long-term objectives and OKRs.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search goals..."
              className="pl-8 bg-background/50 backdrop-blur"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => openQuickAdd('goal')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="relative w-full sm:hidden shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search goals..."
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
        ) : filteredGoals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-20">
            <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>No goals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 overflow-auto h-full">
            <AnimatePresence>
              {filteredGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GoalCard goal={goal} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
