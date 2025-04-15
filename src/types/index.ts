
// Define interfaces for our application
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  categoryId: string;
  userId: string; // Added userId to match Supabase schema
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string; // Added userId to match Supabase schema
}

// Create mapper functions to convert between Supabase and app types
export const mapSupabaseTask = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description || undefined,
  completed: task.completed,
  createdAt: task.created_at,
  categoryId: task.category_id,
  userId: task.user_id
});

export const mapSupabaseCategory = (category: any): Category => ({
  id: category.id,
  name: category.name,
  color: category.color,
  userId: category.user_id
});
