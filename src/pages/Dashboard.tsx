
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { useTasks } from "@/context/TaskContext";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { categories, isLoading: tasksLoading } = useTasks();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMobile();
  
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
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </motion.div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onAddTaskClick={() => setIsAddTaskOpen(true)} 
        onMobileMenuClick={() => setMobileSidebarOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar 
            activeCategory={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </div>
        
        {isMobile && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
              <Sidebar 
                activeCategory={activeCategoryId}
                onCategoryChange={(id) => {
                  setActiveCategoryId(id);
                  setMobileSidebarOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>
        )}
        
        <main className="flex-1 overflow-auto">
          {categories.length === 0 ? (
            <div className="flex items-center justify-center h-full px-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Get started by adding a category in the sidebar and then create your first task.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <TaskList categoryId={activeCategoryId} />
          )}
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
