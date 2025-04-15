
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

interface HeaderProps {
  onAddTaskClick: () => void;
  onMobileMenuClick?: () => void;
}

const Header = ({ onAddTaskClick, onMobileMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border py-3 px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onMobileMenuClick}>
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 max-w-[280px]">
                <Sidebar closeMobileMenu={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          <h1 className="text-xl font-bold text-primary">QuickTask</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onAddTaskClick} 
            size="sm" 
            className="hidden md:flex"
          >
            <Plus className="w-4 h-4 mr-1" /> New Task
          </Button>
          <Button 
            onClick={onAddTaskClick} 
            size="icon" 
            className="md:hidden"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-medium hidden md:inline-block">
              {user?.name || user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
