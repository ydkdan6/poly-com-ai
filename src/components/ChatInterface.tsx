import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for the Computer Science Department at Kaduna Polytechnic. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a chat session
    createChatSession();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const createChatSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ title: 'Chat Session', user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive",
      });
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!sessionId) return;

    try {
      await supabase
        .from('messages')
        .insert([{
          session_id: sessionId,
          content,
          role,
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Save user message
    await saveMessage(userMessage.content, 'user');

    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: input,
          sessionId,
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message
      await saveMessage(aiMessage.content, 'assistant');

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact the department directly.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[650px] w-full max-w-4xl mx-auto glass-card shadow-elegant transition-smooth hover:shadow-glow">
      <div className="flex items-center gap-4 p-6 border-b border-border/50">
        <Avatar className="h-12 w-12 shadow-elegant">
          <AvatarFallback className="gradient-primary">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">CS Department Assistant</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered support for Kaduna Polytechnic students
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-10 w-10 shrink-0 shadow-elegant">
                  <AvatarFallback className="gradient-primary">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 transition-smooth ${
                  message.role === 'user'
                    ? 'bg-chat-user-message text-chat-user-message-foreground shadow-elegant'
                    : 'glass-card text-chat-ai-message-foreground border border-border/50'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-10 w-10 shrink-0 shadow-elegant">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 justify-start animate-fade-in">
              <Avatar className="h-10 w-10 shrink-0 shadow-elegant">
                <AvatarFallback className="gradient-primary">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="glass-card border border-border/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border/50">
        <div className="flex gap-3">
          <Input
            placeholder="Type your message about Computer Science department..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="glass-card transition-smooth focus:shadow-glow border-border/50"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="btn-modern gradient-primary shadow-elegant hover:shadow-glow transition-smooth"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;