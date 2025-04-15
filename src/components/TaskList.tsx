
import { useTasks } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import { useState, useEffect } from "react";
import { Category, Task } from "@/types";
import { cn } from "@/lib/utils";

interface TaskListProps {
  categoryId: string | null;
}

const TaskList = ({ categoryId }: TaskListProps) => {
  const { tasks, categories } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    // Find current category
    const category = categoryId 
      ? categories.find(c => c.id === categoryId) || null
      : categories.length > 0 ? categories[0] : null;
    
    setCurrentCategory(category);
    
    // Filter tasks by category and completion status
    if (category) {
      let filtered = tasks.filter(task => task.categoryId === category.id);
      
      if (filter === "active") {
        filtered = filtered.filter(task => !task.completed);
      } else if (filter === "completed") {
        filtered = filtered.filter(task => task.completed);
      }
      
      // Sort tasks: incomplete first, then by creation date (newest first)
      filtered.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [categoryId, tasks, categories, filter]);

  if (!currentCategory) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <p className="text-muted-foreground">No category selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: currentCategory.color }}
            ></span>
            {currentCategory.name}
          </h2>
          
          <div className="flex p-0.5 bg-muted rounded-md">
            <button
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filter === "all" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filter === "active" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filter === "completed" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                category={currentCategory} 
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "No tasks in this category yet" 
                  : filter === "active" 
                    ? "No active tasks" 
                    : "No completed tasks"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
