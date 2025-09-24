import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Custom SJ Avatar Component
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
      content: "Hi! I'm SJ, your AI assistant. I can help you with tasks, answer questions, provide explanations, give advice, or just have a friendly chat. What would you like to talk about today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Advanced AI-like response system
  const generateIntelligentResponse = (userInput: string, context: string[]): string => {
    const input = userInput.toLowerCase().trim();
    const words = input.split(' ');
    
    // Analyze conversation context
    const hasAskedBefore = context.some(msg => msg.toLowerCase().includes(input.substring(0, 10)));
    const isFollowUp = context.length > 0 && (
      input.includes('yes') || input.includes('no') || input.includes('what about') || 
      input.includes('how about') || input.includes('can you') || input.includes('tell me more')
    );

    // Question analysis
    const isQuestion = input.includes('?') || words.some(w => 
      ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'].includes(w)
    );

    // Technical/Coding questions
    if (words.some(w => ['code', 'programming', 'javascript', 'react', 'css', 'html', 'python', 'java', 'debug', 'error', 'function', 'variable', 'array', 'object', 'api', 'database'].includes(w))) {
      const techResponses = [
        `Great question about ${words.find(w => ['javascript', 'react', 'css', 'html', 'python', 'java'].includes(w)) || 'programming'}! Let me break this down for you. This is a fundamental concept that many developers work with. What specific aspect would you like me to explain further?`,
        `I'd be happy to help with that coding question! This is actually a common challenge developers face. Here's what you need to know: The key is understanding the underlying principles. Would you like me to walk through a practical example?`,
        `That's a really good technical question! In programming, this kind of problem usually has multiple approaches. The best solution depends on your specific use case. Can you tell me more about what you're trying to achieve?`,
        `Programming questions like this are great for learning! The concept you're asking about is quite important in software development. Let me explain it in simple terms and then we can dive deeper if needed.`
      ];
      return techResponses[Math.floor(Math.random() * techResponses.length)];
    }

    // Task and productivity questions
    if (words.some(w => ['task', 'todo', 'productivity', 'organize', 'plan', 'schedule', 'deadline', 'priority', 'manage', 'work', 'project'].includes(w))) {
      const productivityResponses = [
        `Excellent question about productivity! Task management is crucial for success. Here's what I recommend: Start by breaking down large tasks into smaller, manageable chunks. This makes everything feel less overwhelming. What specific area of your workflow would you like to improve?`,
        `That's a smart approach to organization! I find that the most effective productivity systems combine planning with flexibility. The key is finding what works for your specific situation. Are you looking to organize daily tasks or longer-term projects?`,
        `Great thinking about task management! The most successful people I know have systems that help them stay focused. One effective method is the priority matrix - categorizing tasks by urgency and importance. Would you like me to explain how to implement this?`,
        `You're asking the right questions about productivity! The secret isn't just having a system, but consistently using it. I'd suggest starting with just 3 key priorities each day. What kind of tasks are you trying to manage better?`
      ];
      return productivityResponses[Math.floor(Math.random() * productivityResponses.length)];
    }

    // Learning and explanation requests
    if (words.some(w => ['learn', 'explain', 'understand', 'what', 'how', 'why', 'teach', 'help', 'guide'].includes(w)) && isQuestion) {
      const educationalResponses = [
        `That's a fantastic question to ask! Understanding concepts deeply is so important. Let me break this down in a way that makes sense. The key thing to remember is that learning happens in layers - we start with the basics and build up complexity. What part would you like me to focus on first?`,
        `I love that you're curious about this! Learning new things is one of the most rewarding experiences. This topic actually connects to several other important concepts. Would you like me to start with the fundamentals and work our way up, or do you have a specific angle you're most interested in?`,
        `Excellent question! This is something that many people wonder about, and it's great that you're taking the time to understand it properly. The best way to approach this is step by step. Let me give you a clear explanation that builds logically. Are you looking for a quick overview or a detailed breakdown?`,
        `That's exactly the kind of question that leads to real understanding! I find that the best way to learn something is to connect it to what you already know. This concept is actually quite fascinating when you dig into it. What's your current level of familiarity with this topic?`
      ];
      return educationalResponses[Math.floor(Math.random() * educationalResponses.length)];
    }

    // Personal/emotional support
    if (words.some(w => ['feel', 'feeling', 'sad', 'happy', 'stressed', 'worried', 'anxious', 'excited', 'tired', 'lonely', 'confused', 'frustrated'].includes(w))) {
      const supportResponses = [
        `I really appreciate you sharing that with me. It takes courage to express how you're feeling. What you're experiencing is completely valid, and it's okay to feel this way. Sometimes talking through things can help us see them more clearly. Would you like to tell me more about what's on your mind?`,
        `Thank you for being open about your feelings. It's important to acknowledge what we're going through rather than pushing it aside. Many people experience similar emotions, and you're definitely not alone in this. Is there something specific that's contributing to how you're feeling right now?`,
        `I can hear that this is important to you, and I want you to know that your feelings matter. Sometimes life can feel overwhelming, and that's completely human. Taking time to process what we're experiencing is actually a sign of self-awareness. What do you think might help you feel a bit better today?`,
        `It means a lot that you're comfortable sharing this with me. Emotions are such a natural part of being human, and it's healthy to express them. Everyone goes through ups and downs, and what you're feeling is part of that journey. Is there a particular situation that's influencing how you feel?`
      ];
      return supportResponses[Math.floor(Math.random() * supportResponses.length)];
    }

    // Follow-up responses
    if (isFollowUp && context.length > 0) {
      const followUpResponses = [
        `That's a great follow-up question! I can see you're really thinking about this. Building on what we discussed, here's another perspective to consider. The interesting thing is how these concepts connect together. What other aspects are you curious about?`,
        `I'm glad you're diving deeper into this topic! That shows real intellectual curiosity. Based on our conversation, I think you'd also find it interesting to know that this relates to several other important areas. Would you like me to explore those connections?`,
        `Excellent thinking! You're asking exactly the right questions to deepen your understanding. This kind of critical thinking is what leads to real insights. Let me build on that thought and show you how it connects to the bigger picture.`,
        `That's exactly the kind of question that shows you're really engaging with the material! I love when conversations evolve like this. Your perspective is adding new dimensions to consider. What made you think of that particular angle?`
      ];
      return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
    }

    // Greetings
    if (words.some(w => ['hello', 'hi', 'hey', 'good', 'morning', 'afternoon', 'evening', 'vanakkam'].includes(w))) {
      const greetings = [
        `Hello! It's great to meet you! I'm here and ready to help with whatever you'd like to discuss. Whether you have questions, need assistance with tasks, want to learn something new, or just feel like having a conversation, I'm all ears. What's on your mind today?`,
        `Hi there! Welcome! I'm excited to chat with you. I can help with a wide range of topics - from answering questions and explaining concepts to helping you organize tasks or just having a friendly conversation. What would you like to talk about?`,
        `Hey! Good to see you here! I'm your AI assistant and I'm ready to help make your day better in whatever way I can. I enjoy meaningful conversations and helping people solve problems. What brings you here today?`,
        `Greetings! I'm so glad you're here. I love having conversations and helping people with whatever they need. Whether it's work-related, learning something new, personal questions, or just chatting, I'm here for it all. How are you doing today?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // General conversation starters
    if (input.length < 20 && !isQuestion) {
      const conversationStarters = [
        `That's interesting! I'd love to hear more about your thoughts on that. Could you tell me what specifically interests you about this topic? I find that diving deeper into subjects often reveals fascinating connections.`,
        `I appreciate you bringing that up! It sounds like there's more to explore here. What made you think of this particular topic? I'm curious to understand your perspective better.`,
        `That's a good point to consider! I think there are multiple ways to look at this. What's your take on it? I'd enjoy hearing your thoughts and maybe we can explore different angles together.`,
        `Interesting observation! That actually connects to several other topics I find fascinating. Would you like to explore this further? I think you might find some of the related concepts quite engaging.`
      ];
      return conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
    }

    // Default intelligent responses
    const intelligentDefaults = [
      `That's a really thoughtful point you've raised. I can see you've put some consideration into this. This topic actually has several interesting dimensions worth exploring. What aspect of this interests you most? I'd love to dive deeper into your specific questions or concerns.`,
      `I find that perspective quite intriguing! You've touched on something that many people think about but don't always discuss openly. This is exactly the kind of conversation I enjoy having. Could you share more about what led you to this line of thinking?`,
      `You've brought up something really worth discussing! I appreciate when people share their genuine thoughts and questions. This reminds me of several related concepts that might interest you. Would you like to explore this topic further together?`,
      `That's an excellent observation! You're clearly someone who thinks critically about things, which I really respect. This subject has many layers to it, and I think you'd find some of the deeper aspects quite fascinating. What questions do you have about this?`,
      `I'm really glad you mentioned that! It shows you're engaging thoughtfully with important topics. This is actually something I've given a lot of consideration to as well. There are several angles we could explore here - what would be most helpful for you to discuss?`,
      `What an interesting way to put it! I can tell you've been thinking about this, and that kind of reflection is valuable. This topic connects to so many other areas of life and learning. Is there a particular aspect you'd like to focus on or explore more deeply?`
    ];
    
    return intelligentDefaults[Math.floor(Math.random() * intelligentDefaults.length)];
  };

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

    // Update conversation context
    const newContext = [...conversationContext, currentInput].slice(-5); // Keep last 5 messages for context
    setConversationContext(newContext);

    // Simulate realistic thinking time
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateIntelligentResponse(currentInput, newContext),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800 + Math.random() * 1200); // Random delay between 0.8-2 seconds for realism
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
          <div className="flex items-center gap-3">
            <SJAvatar size={40} />
            <div>
              <h3 className="font-semibold text-gray-800">SJ Assistant</h3>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-pink-500">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-25 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <SJAvatar size={28} />
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-pink-500 text-white rounded-br-md'
                    : 'bg-white border border-pink-100 text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-pink-100' : 'text-gray-400'
                }`}>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
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

        {/* Input */}
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