
import { useState } from "react";
import { Filter, SortAsc, SortDesc, Clock, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export type SortOption = "newest" | "oldest" | "name" | "dueDate";
export type FilterOption = "all" | "active" | "completed";

interface TaskFiltersProps {
  currentSort: SortOption;
  currentFilter: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

const TaskFilters = ({ 
  currentSort, 
  currentFilter, 
  onSortChange, 
  onFilterChange 
}: TaskFiltersProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex p-0.5 bg-muted rounded-md">
        <Button
          variant={currentFilter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("all")}
          className="text-xs px-3"
        >
          All
        </Button>
        <Button
          variant={currentFilter === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("active")}
          className="text-xs px-3"
        >
          Active
        </Button>
        <Button
          variant={currentFilter === "completed" ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange("completed")}
          className="text-xs px-3"
        >
          Completed
        </Button>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            Sort
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60" align="end">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Sort Tasks</h4>
            <Separator />
            <RadioGroup 
              value={currentSort} 
              onValueChange={(value) => {
                onSortChange(value as SortOption);
                setOpen(false);
              }}
            >
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="flex items-center gap-2 cursor-pointer">
                  <SortDesc className="h-3.5 w-3.5" />
                  Newest first
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="oldest" id="oldest" />
                <Label htmlFor="oldest" className="flex items-center gap-2 cursor-pointer">
                  <SortAsc className="h-3.5 w-3.5" />
                  Oldest first
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name" className="flex items-center gap-2 cursor-pointer">
                  <SortAsc className="h-3.5 w-3.5" />
                  Alphabetical
                </Label>
              </div>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskFilters;
