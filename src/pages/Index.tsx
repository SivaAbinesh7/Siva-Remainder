import React, { useState } from 'react';
import DateTime from '@/components/DateTime';
import TodoList from '@/components/TodoList';
import VirtualAssistant from '@/components/VirtualAssistant';
import SJSymbol from '@/components/SJSymbol';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const Index = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { showNotification } = useNotifications();

  const handleTestNotification = () => {
    showNotification('Hello Siva-07!', {
      body: 'This is a test notification from your reminders app!',
      requireInteraction: true
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-1">Siva's Reminders</h1>
          <p className="text-pink-400">Your aesthetic daily companion</p>
          
          <div className="mt-4">
            <Button 
              onClick={handleTestNotification}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Test Notification
            </Button>
          </div>
        </header>
        
        <div className="space-y-6">
          <DateTime />
          <TodoList />
        </div>
        
        <footer className="mt-8 text-center text-sm text-pink-300">
          <p>Made with ♥ for Siva</p>
        </footer>
      </div>

      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-40"
      >
        <div className="relative">
          <SJSymbol size={28} className="text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
      </button>

      {/* Assistant Overlay */}
      {isAssistantOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsAssistantOpen(false)}
          />
          <div className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)] z-50 animate-scale-in">
            <VirtualAssistant onClose={() => setIsAssistantOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;