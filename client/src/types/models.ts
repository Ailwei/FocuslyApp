export interface FocusSession {
  id: string;
  task: string;
  durationMinutes: number;
  completedAt: string; // ISO date string
}

export interface Badge {
  id: string;
  title: string;
  category: 'Milestones' | 'Time' | 'Sessions';
  unlocked: boolean;
}

export interface Stats {
  totalSessions: number;
  totalFocusMinutes: number;
  averageSessionMinutes: number;
  longestSessionMinutes: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string | null;
  memberSince: string; // e.g. "Jan 2026"
}
