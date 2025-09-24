
import React, { useState, useEffect } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import TodoItem, { Todo } from './TodoItem';
import { cn } from '@/lib/utils';

// Simulate local storage database
const saveTodos = (todos: Todo[]) => {
  localStorage.setItem('siva-todos', JSON.stringify(todos));
};

const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem('siva-todos');
  if (saved) {
    try {
      return JSON.parse(saved);
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
  
  useEffect(() => {
    setTodos(loadTodos());
  }, []);

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
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodoText('');
    
    toast({
      title: "Reminder added",
      description: "Your new reminder has been added successfully."
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
      title: "Reminder removed",
      description: "Your reminder has been removed successfully."
    });
  };

  return (
    <Card className="w-full bg-white/50 backdrop-blur-sm border-none shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-pink-600">Siva's Reminders</CardTitle>
        <CardDescription>
          Keep track of your important tasks and events
        </CardDescription>
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
        
        <div className="task-list space-y-2 overflow-y-auto">
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
