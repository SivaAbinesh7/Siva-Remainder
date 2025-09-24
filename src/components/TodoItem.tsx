
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={cn(
      "group flex items-center justify-between p-3 rounded-lg transition-all duration-300 animate-fade-in",
      "bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-pink-100",
      todo.completed && "bg-gray-50/50 hover:bg-gray-50/70"
    )}>
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
        />
        <span className={cn(
          "flex-1 text-gray-800 transition-all duration-300",
          todo.completed && "text-gray-400 line-through"
        )}>
          {todo.text}
        </span>
        
        {todo.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{todo.dueDate.toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TodoItem;
