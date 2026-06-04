'use client';

import { useAchievements } from '@/hooks/use-achievements';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Star, Award, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AchievementsPage() {
  const { achievements, loading } = useAchievements();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAchievements = achievements.filter(ach => 
    ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ach.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Celebrate your milestones and unlocked potential.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64 hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search achievements..."
              className="pl-8 bg-background/50 backdrop-blur"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground pb-20">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>No achievements unlocked yet. Keep going!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 overflow-auto h-full px-1 py-1">
            <AnimatePresence>
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const getIcon = () => {
    switch (achievement.type) {
      case 'win': return <Trophy className="h-10 w-10 text-yellow-500 drop-shadow-md" />;
      case 'certificate': return <Medal className="h-10 w-10 text-slate-300 drop-shadow-md" />;
      case 'milestone': return <Medal className="h-10 w-10 text-amber-700 drop-shadow-md" />;
      default: return <Star className="h-10 w-10 text-primary drop-shadow-md" />;
    }
  };

  const getBorderClass = () => {
    switch (achievement.type) {
      case 'win': return 'border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20';
      case 'certificate': return 'border-slate-300/30 hover:border-slate-300/50 hover:shadow-slate-300/20';
      case 'milestone': return 'border-amber-700/30 hover:border-amber-700/50 hover:shadow-amber-700/20';
      default: return 'border-primary/30 hover:border-primary/50 hover:shadow-primary/20';
    }
  };

  return (
    <Card className={cn("glass-card transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl h-full flex flex-col items-center text-center p-6", getBorderClass())}>
      <div className="mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
        {getIcon()}
      </div>
      <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
      <p className="text-sm text-muted-foreground flex-1">
        {achievement.description}
      </p>
      <div className="mt-4 pt-4 border-t border-border/40 w-full flex items-center justify-between text-xs text-muted-foreground">
        <span className="capitalize">{achievement.type || 'achievement'}</span>
        <span className="font-medium">
          {format(new Date(achievement.date || achievement.created_at), 'MMM d, yyyy')}
        </span>
      </div>
    </Card>
  );
}
