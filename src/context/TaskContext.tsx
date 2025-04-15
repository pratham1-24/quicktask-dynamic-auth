
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, Category } from "@/types";

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
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

  // Load tasks and categories from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("quickTaskTasks");
    const storedCategories = localStorage.getItem("quickTaskCategories");
    
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        localStorage.removeItem("quickTaskTasks");
      }
    }
    
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (e) {
        localStorage.removeItem("quickTaskCategories");
      }
    } else {
      // Add default categories if none exist
      const defaultCategories: Category[] = [
        { id: "category_1", name: "Personal", color: "#6366F1" },
        { id: "category_2", name: "Work", color: "#F59E0B" },
        { id: "category_3", name: "Health", color: "#10B981" },
      ];
      setCategories(defaultCategories);
      localStorage.setItem("quickTaskCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  // Update localStorage whenever tasks or categories change
  useEffect(() => {
    localStorage.setItem("quickTaskTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("quickTaskCategories", JSON.stringify(categories));
  }, [categories]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: "task_" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: "category_" + Math.random().toString(36).substring(2, 9),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === id ? { ...category, ...updates } : category))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    // Delete all tasks in this category
    setTasks((prev) => prev.filter((task) => task.categoryId !== id));
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
