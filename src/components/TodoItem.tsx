import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Clock, Bell, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/lib/notifications';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!todo.dueDate || todo.completed) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const due = new Date(todo.dueDate!).getTime();
      const difference = due - now;

      if (difference <= 0) {
        setTimeLeft('Overdue!');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s left`);
      } else {
        setTimeLeft(`${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [todo.dueDate, todo.completed]);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    onUpdate(todo.id, { dueDate: date, notified: false });
  };

  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 5;
    onUpdate(todo.id, { reminderTime: minutes });
  };

  return (
    <div className={cn(
      "group flex flex-col gap-2 p-3 rounded-lg transition-all duration-300 animate-fade-in",
      "bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-pink-100",
      todo.completed && "bg-gray-50/50 hover:bg-gray-50/70"
    )}>
      <div className="flex items-center justify-between">
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

          {todo.dueDate && timeLeft && !todo.completed && (
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              timeLeft === 'Overdue!' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            )}>
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTimer(!showTimer)}
            className={cn(
              "text-gray-400 hover:text-pink-500 hover:bg-pink-50",
              todo.dueDate && "text-pink-500"
            )}
          >
            {todo.dueDate ? <Bell className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showTimer && (
        <div className="flex flex-col gap-2 pl-9 animate-fade-in">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24">Due Date:</label>
            <Input
              type="datetime-local"
              value={todo.dueDate ? format(new Date(todo.dueDate), "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={handleDateTimeChange}
              className="text-xs h-8 border-pink-200 focus-visible:ring-pink-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24">Remind me:</label>
            <Input
              type="number"
              min="1"
              max="60"
              value={todo.reminderTime || 5}
              onChange={handleReminderTimeChange}
              className="text-xs h-8 w-20 border-pink-200 focus-visible:ring-pink-400"
            />
            <span className="text-xs text-gray-600">minutes before</span>
          </div>
          {todo.dueDate && (
            <div className="text-xs text-gray-500 mt-1">
              📅 Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')} at {format(new Date(todo.dueDate), 'h:mm a')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
