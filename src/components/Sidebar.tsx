
import { useTasks } from "@/context/TaskContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface SidebarProps {
  closeMobileMenu?: () => void;
}

interface SidebarPropsExtended extends SidebarProps {
  activeCategory?: string | null;
  onCategoryChange?: (categoryId: string) => void;
}

const Sidebar = ({ closeMobileMenu, activeCategory, onCategoryChange }: SidebarPropsExtended) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTasks();
  const [localActiveCategory, setLocalActiveCategory] = useState<string | null>(
    activeCategory || (categories.length > 0 ? categories[0].id : null)
  );
  
  // Update local state when prop changes
  useEffect(() => {
    if (activeCategory) {
      setLocalActiveCategory(activeCategory);
    }
  }, [activeCategory]);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366F1");
  
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const colors = [
    "#6366F1", // Indigo
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
  ];

  const handleCategoryClick = (categoryId: string) => {
    setLocalActiveCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setNewCategoryName("");
      setNewCategoryColor("#6366F1");
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        color: editingCategory.color,
      });
      setEditingCategory(null);
      setIsEditingCategory(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      if (localActiveCategory === categoryToDelete.id && categories.length > 1) {
        // Find another category to select
        const nextCategory = categories.find(c => c.id !== categoryToDelete.id);
        if (nextCategory) {
          setLocalActiveCategory(nextCategory.id);
          if (onCategoryChange) {
            onCategoryChange(nextCategory.id);
          }
        }
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="w-64 flex flex-col h-full bg-sidebar border-r border-border">
      <div className="p-4 flex flex-col gap-1 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-sm text-muted-foreground">Categories</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setIsAddingCategory(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between group"
            >
              <Button
                variant={localActiveCategory === category.id ? "secondary" : "ghost"}
                className={cn(
                  "justify-start w-full h-9 px-2 text-sm font-normal",
                  localActiveCategory === category.id ? "font-medium" : ""
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></span>
                {category.name}
              </Button>
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory(category);
                    setIsEditingCategory(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryToDelete(category);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-6 h-6 rounded-full border-2",
                      newCategoryColor === color ? "border-gray-900" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategoryColor(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-6 h-6 rounded-full border-2",
                        editingCategory.color === color ? "border-gray-900" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setEditingCategory({ ...editingCategory, color })
                      }
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={!editingCategory?.name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This will also delete all tasks in this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sidebar;
