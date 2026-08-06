export interface CreateSessionInput {
  user_id: string;
  task: string;
  duration_minutes: number;
  completed_at: string; // ISO
}

export interface CompleteSessionInput {
  id: string;
  completed_at?: string; // ISO
  notes?: string;
}

export interface CreateUserInput {
  email: string;
  password?: string;
  phone?: string;
  user_metadata?: Record<string, unknown>;
}
