import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage } from '@/lib/ai-service';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const SJAvatar = ({ size = 32 }: { size?: number }) => (
  <div
    className="rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg"
    style={{ width: size, height: size, fontSize: size * 0.4 }}
  >
    SJ
  </div>
);

interface VirtualAssistantProps {
  onClose?: () => void;
}

const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm SJ, your AI assistant powered by Groq AI. I can help you with tasks, answer questions, provide explanations, give advice, or just have a friendly chat. What would you like to talk about today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await sendChatMessage(
        [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please check your API configuration.');
      console.error('Chat error:', err);

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting to my AI backend. Please make sure your API key is configured in the .env file. Check the .env.example file for setup instructions.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-none shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
          <div className="flex items-center gap-3">
            <SJAvatar size={40} />
            <div>
              <h3 className="font-semibold text-gray-800">SJ Assistant</h3>
              <p className="text-xs text-gray-500">Powered by AI</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-pink-500">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-25 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && <SJAvatar size={28} />}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.role === 'user'
                  ? 'bg-pink-500 text-white rounded-br-md'
                  : 'bg-white border border-pink-100 text-gray-800 rounded-bl-md shadow-sm'
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-pink-100' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs font-semibold">
                  S
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start">
              <SJAvatar size={28} />
              <div className="bg-white border border-pink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 text-center p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-pink-100 bg-pink-25">
            <p className="text-xs text-gray-600 mb-2">Try asking me about:</p>
            <div className="flex flex-wrap gap-1">
              {[
                "How to code in React",
                "Explain productivity tips",
                "Help me organize tasks",
                "What is machine learning"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs h-7 border-pink-200 hover:bg-pink-50 text-gray-600"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-pink-100 bg-white">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                placeholder="Message SJ..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="pr-10 border-gray-200 focus-visible:ring-pink-400 rounded-full bg-gray-50"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-pink-500 hover:bg-pink-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualAssistant;