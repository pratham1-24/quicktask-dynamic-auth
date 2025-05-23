
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, ListChecks, Clock, CalendarCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              QuickTask
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto">
              A simple, elegant task manager to stay organized and boost productivity
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-md group relative overflow-hidden"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <motion.span 
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth?tab=login')}
              className="text-md"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className="flex flex-col items-center text-center p-4 space-y-3 rounded-lg hover:bg-muted/50 transition-colors"
              variants={item}
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <ListChecks size={24} />
              </div>
              <h3 className="text-xl font-bold">Organize Tasks</h3>
              <p className="text-muted-foreground">
                Create and organize tasks into categories for better focus and productivity
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-4 space-y-3 rounded-lg hover:bg-muted/50 transition-colors"
              variants={item}
            >
              <div className="p-3 rounded-full bg-secondary/20 text-secondary mb-2">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Mark tasks as complete and track your productivity over time
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-4 space-y-3 rounded-lg hover:bg-muted/50 transition-colors"
              variants={item}
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <CalendarCheck size={24} />
              </div>
              <h3 className="text-xl font-bold">Stay Productive</h3>
              <p className="text-muted-foreground">
                Focus on what matters with a clean, distraction-free interface
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
