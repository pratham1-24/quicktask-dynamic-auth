
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { useTasks } from "@/context/TaskContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { categories, isLoading: tasksLoading } = useTasks();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  const isLoading = authLoading || tasksLoading;
  
  // Set the first category as active when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);
  
  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onAddTaskClick={() => setIsAddTaskOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar 
            activeCategory={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </div>
        
        <main className="flex-1 overflow-auto">
          <TaskList categoryId={activeCategoryId} />
        </main>
      </div>
      
      <TaskForm 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
