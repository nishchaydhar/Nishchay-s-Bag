export enum QuestCategory {
  Social = 'Social',
  Skill = 'Skill',
  Solo = 'Solo',
  Adventure = 'Adventure',
  Creative = 'Creative'
}

export enum QuestStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Mastered = 'Mastered'
}

export interface Reflection {
  note: string;
  photoDescription?: string;
  dateCompleted: string;
}

export interface Quest {
  id: number;
  title: string;
  category: QuestCategory;
  status: QuestStatus;
  month?: string; // Recommended month
  isBold: boolean; // For the "Bold Meter"
  reflection?: Reflection;
}

export interface DashboardStats {
  level: number;
  levelTitle: string;
  totalQuests: number;
  completedQuests: number;
  boldPoints: number;
}