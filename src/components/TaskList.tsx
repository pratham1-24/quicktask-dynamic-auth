
import { useTasks } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import TaskStats from "./TaskStats";
import TaskFilters, { FilterOption, SortOption } from "./TaskFilters";
import { useState, useEffect, useMemo } from "react";
import { Category, Task } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  categoryId: string | null;
}

const TaskList = ({ categoryId }: TaskListProps) => {
  const { tasks, categories } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const categoryTasks = useMemo(() => {
    if (!currentCategory) return [];
    return tasks.filter(task => task.categoryId === currentCategory.id);
  }, [currentCategory, tasks]);

  useEffect(() => {
    // Find current category
    const category = categoryId 
      ? categories.find(c => c.id === categoryId) || null
      : categories.length > 0 ? categories[0] : null;
    
    setCurrentCategory(category);
  }, [categoryId, categories]);

  useEffect(() => {
    if (!currentCategory) {
      setFilteredTasks([]);
      return;
    }

    // Filter tasks by category and completion status
    let filtered = tasks.filter(task => task.categoryId === currentCategory.id);
    
    if (filter === "active") {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }
    
    // Sort tasks based on the current sort option
    filtered.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sort === "name") {
        return a.title.localeCompare(b.title);
      }
      
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFilteredTasks(filtered);
  }, [currentCategory, tasks, filter, sort]);

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
          <h2 className="text-2xl font-bold flex items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: currentCategory.color }}
            ></span>
            {currentCategory.name}
          </h2>
          
          <TaskFilters
            currentFilter={filter}
            currentSort={sort}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </div>
        
        {categoryTasks.length > 0 && (
          <TaskStats tasks={categoryTasks} />
        )}
        
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <TaskItem 
                    task={task} 
                    category={currentCategory} 
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground">
                  {filter === "all" 
                    ? "No tasks in this category yet" 
                    : filter === "active" 
                      ? "No active tasks" 
                      : "No completed tasks"}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;
