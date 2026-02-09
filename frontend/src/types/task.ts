export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: 'Work' | 'Personal' | 'Study' | 'Health';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  time: string | null;
  is_completed: boolean;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  date: string;
  time: string;
}
