
import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskForm = ({ isOpen, onClose }: TaskFormProps) => {
  const { addTask, categories } = useTasks();
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    categoryId: "",
  });
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTaskForm({
        title: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
      });
    }
  }, [isOpen, categories]);
  
  const handleSubmit = () => {
    if (taskForm.title.trim() && taskForm.categoryId) {
      addTask({
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        categoryId: taskForm.categoryId,
        completed: false,
      });
      
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Add more details about this task..."
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={taskForm.categoryId}
              onValueChange={(value) => setTaskForm({ ...taskForm, categoryId: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!taskForm.title.trim() || !taskForm.categoryId}
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
