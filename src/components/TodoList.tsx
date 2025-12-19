import React, { useState, useEffect } from 'react';
import { Plus, CalendarDays, Bell, BellOff } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import TodoItem from './TodoItem';
import { cn } from '@/lib/utils';
import { Todo, requestNotificationPermission, checkReminders } from '@/lib/notifications';

// Simulate local storage database
const saveTodos = (todos: Todo[]) => {
  localStorage.setItem('siva-todos', JSON.stringify(todos));
};

const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem('siva-todos');
  if (saved) {
    try {
      const loaded = JSON.parse(saved);
      // Convert date strings back to Date objects
      return loaded.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      }));
    } catch (e) {
      console.error('Failed to parse saved todos', e);
      return [];
    }
  }
  return [];
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());

    // Check notification permission on mount
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Check reminders every 30 seconds
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      checkReminders(todos, updateTodo);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [todos, notificationsEnabled]);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast({
        title: "🔔 Notifications Enabled",
        description: "You'll receive alerts for your reminders!"
      });
    } else {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive"
      });
    }
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') {
      toast({
        title: "Can't add empty reminder",
        description: "Please enter something for your reminder.",
        variant: "destructive"
      });
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      reminderTime: 5, // Default 5 minutes
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodoText('');

    toast({
      title: "✅ Reminder added",
      description: "Your new reminder has been added. Set a timer to get notifications!"
    });
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);

    toast({
      title: "🗑️ Reminder removed",
      description: "Your reminder has been removed successfully."
    });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border-none shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-pink-600">Siva's Reminders</CardTitle>
            <CardDescription>
              Keep track of your important tasks with smart notifications
            </CardDescription>
          </div>
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={enableNotifications}
            className={cn(
              notificationsEnabled
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "border-pink-300 text-pink-600 hover:bg-pink-50"
            )}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-1" />
                Notifications On
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-1" />
                Enable Alerts
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new reminder..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            className="border-pink-200 focus-visible:ring-pink-400"
          />
          <Button
            onClick={addTodo}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="task-list space-y-2 overflow-y-auto max-h-96">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <CalendarDays className="h-12 w-12 mb-2 opacity-50" />
              <p>No reminders yet</p>
              <p className="text-sm">Add one above to get started</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className={cn(
        "text-sm text-gray-500 pt-1 pb-3 border-t border-pink-100",
        todos.length === 0 && "hidden"
      )}>
        <div className="flex justify-between w-full">
          <span>Total: {todos.length} {todos.length === 1 ? 'reminder' : 'reminders'}</span>
          <span>Last updated: {format(new Date(), 'h:mm a')}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodoList;
