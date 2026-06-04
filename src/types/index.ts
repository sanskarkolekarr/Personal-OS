// ============================================================
// LifeOS - TypeScript Type Definitions
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskCategory = 'money' | 'growth' | 'future' | 'operations';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export type GoalType = 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';

export type GoalStatus = 'active' | 'completed' | 'abandoned';

export type ContentStatus = 'idea' | 'researching' | 'drafting' | 'ready' | 'posted';

export type AchievementType = 'achievement' | 'certificate' | 'milestone' | 'win';

// ─── Database Models ─────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  status: TaskStatus;
  due_date: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: ProjectStatus;
  progress: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  // Virtual (joined)
  tasks?: Task[];
  task_count?: number;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  parent_id: string | null;
  deadline: string | null;
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
  // Virtual (children)
  children?: Goal[];
}

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  // Virtual
  children?: Folder[];
  notes?: Note[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: string;
  category: string;
  status: ContentStatus;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  date: string;
  created_at: string;
}

export interface Credential {
  id: string;
  title: string;
  username: string;
  password?: string;
  url: string;
  notes: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface TimeBlock {
  id: string;
  start: string;
  end: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
}

export interface BrainDumpItem {
  id: string;
  text: string;
  convertedTo: 'task' | 'goal' | 'project' | 'note' | 'content' | null;
  convertedId: string | null;
  created_at: string;
}

export interface DailyLog {
  id: string;
  date: string;
  top3: { id: string; title: string; completed: boolean }[];
  time_blocks: TimeBlock[];
  notes: string;
  reflection: string;
  brain_dump: BrainDumpItem[];
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

// ─── Form Types (for create/edit) ─────────────────────────────

export type TaskFormData = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'tasks' | 'task_count'>;
export type GoalFormData = Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'children'>;
export type NoteFormData = Omit<Note, 'id' | 'created_at' | 'updated_at'>;
export type ContentFormData = Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>;
export type AchievementFormData = Omit<Achievement, 'id' | 'created_at'>;
export type DailyLogFormData = Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>;
export type CredentialFormData = Omit<Credential, 'id' | 'created_at' | 'updated_at'>;

// ─── UI Types ─────────────────────────────────────────────────

export type ViewMode = 'kanban' | 'list' | 'grid' | 'calendar';

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  targetType: 'task' | 'project' | 'goal' | 'note' | 'content' | 'achievement';
  timestamp: string;
}

export interface AnalyticsData {
  tasksCompleted: number;
  goalsCompleted: number;
  projectsCompleted: number;
  streakCount: number;
  weeklyProductivity: number[];
  monthlyProductivity: number[];
  categoryBreakdown: { category: string; count: number }[];
}
