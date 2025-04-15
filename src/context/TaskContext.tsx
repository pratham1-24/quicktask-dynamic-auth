import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, Category, mapSupabaseTask, mapSupabaseCategory } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "userId">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "userId">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getTasksByCategory: (categoryId: string) => Task[];
  isLoading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let categoriesSubscription: any;
    let tasksSubscription: any;
    
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setTasks([]);
        setCategories([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);
          
        if (categoriesError) {
          throw categoriesError;
        }
        
        const mappedCategories = categoriesData.map(mapSupabaseCategory);
        setCategories(mappedCategories);
        
        if (categoriesData.length === 0) {
          const defaultCategories = [
            { name: "Personal", color: "#6366F1" },
            { name: "Work", color: "#F59E0B" },
            { name: "Health", color: "#10B981" },
          ];
          
          for (const category of defaultCategories) {
            await addCategory(category);
          }
        }
        
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
          
        if (tasksError) {
          throw tasksError;
        }
        
        const mappedTasks = tasksData.map(mapSupabaseTask);
        setTasks(mappedTasks);
        
        categoriesSubscription = supabase
          .channel('categories-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'categories',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setCategories(prev => [...prev, mapSupabaseCategory(payload.new)]);
            } else if (payload.eventType === 'UPDATE') {
              setCategories(prev => 
                prev.map(cat => cat.id === payload.new.id ? mapSupabaseCategory(payload.new) : cat)
              );
            } else if (payload.eventType === 'DELETE') {
              setCategories(prev => prev.filter(cat => cat.id !== payload.old.id));
            }
          })
          .subscribe();
        
        tasksSubscription = supabase
          .channel('tasks-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'tasks',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setTasks(prev => [...prev, mapSupabaseTask(payload.new)]);
            } else if (payload.eventType === 'UPDATE') {
              setTasks(prev => 
                prev.map(task => task.id === payload.new.id ? mapSupabaseTask(payload.new) : task)
              );
            } else if (payload.eventType === 'DELETE') {
              setTasks(prev => prev.filter(task => task.id !== payload.old.id));
            }
          })
          .subscribe();
          
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load tasks and categories');
        toast({
          title: "Error loading data",
          description: err.message || 'Failed to load tasks and categories',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (categoriesSubscription) categoriesSubscription.unsubscribe();
      if (tasksSubscription) tasksSubscription.unsubscribe();
    };
  }, [isAuthenticated, user, toast]);

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description || null,
          completed: task.completed,
          category_id: task.categoryId,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast({
        title: "Failed to add task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        title: "Failed to update task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast({
        title: "Failed to delete task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const addCategory = async (category: Omit<Category, "id" | "userId">) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          color: category.color,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return;
    } catch (err: any) {
      console.error('Error adding category:', err);
      toast({
        title: "Failed to add category",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) return;
    
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      
      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error updating category:', err);
      toast({
        title: "Failed to update category",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    try {
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('category_id', id)
        .eq('user_id', user.id);
        
      if (tasksError) throw tasksError;
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
    } catch (err: any) {
      console.error('Error deleting category:', err);
      toast({
        title: "Failed to delete category",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter((task) => task.categoryId === categoryId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        updateCategory,
        deleteCategory,
        getTasksByCategory,
        isLoading,
        error
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
