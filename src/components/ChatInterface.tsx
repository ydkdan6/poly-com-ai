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
      if (!user) {
        console.warn('User not authenticated, using anonymous session');
        // Generate a temporary session ID for anonymous users
        setSessionId(`anonymous-${Date.now()}`);
        return;
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ title: 'Chat Session', user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error creating chat session:', error);
      // Generate a temporary session ID as fallback
      setSessionId(`fallback-${Date.now()}`);
      toast({
        title: "Warning",
        description: "Using temporary session. Messages may not be saved.",
        variant: "destructive",
      });
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!sessionId || sessionId.startsWith('anonymous-') || sessionId.startsWith('fallback-')) {
      console.log('Skipping message save for temporary session');
      return;
    }

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
    const currentInput = input;
    setInput('');
    setLoading(true);

    // Save user message
    await saveMessage(userMessage.content, 'user');

    try {
      console.log('Calling chat-ai function with:', { message: currentInput, sessionId });

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: currentInput,
          sessionId,
        },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message || 'Unknown error'}`);
      }

      // Handle different response formats
      let responseContent = '';
      if (typeof data === 'string') {
        responseContent = data;
      } else if (data && typeof data.response === 'string') {
        responseContent = data.response;
      } else if (data && typeof data.message === 'string') {
        responseContent = data.message;
      } else {
        console.warn('Unexpected response format:', data);
        responseContent = 'I received your message but encountered an unexpected response format.';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message
      await saveMessage(aiMessage.content, 'assistant');

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact the department directly.';
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('Function not found')) {
          errorMessage = 'The AI service is currently unavailable. Please try again later.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The request timed out. Please try asking a shorter question.';
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'Authentication error. Please try refreshing the page.';
        }
      }

      const errorResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponseMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach AI service. Please try again.",
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
    <Card className="flex flex-col h-[650px] w-full max-w-4xl mx-auto bg-gradient-to-br from-green-50/50 to-emerald-50/30 backdrop-blur-sm border-green-200/50 shadow-lg shadow-green-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/30">
      <div className="flex items-center gap-4 p-6 border-b border-green-200/50 bg-gradient-to-r from-green-600 to-emerald-600">
        <Avatar className="h-12 w-12 shadow-lg shadow-green-900/20">
          <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg text-white">CS Department Assistant</h3>
          <p className="text-sm text-green-100">
            AI-powered support for Kaduna Polytechnic students
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-green-50/20 to-transparent" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-10 w-10 shrink-0 shadow-md shadow-green-200/30">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 transition-all duration-300 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20'
                    : 'bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm text-green-900 border border-green-200/50 shadow-md shadow-green-100/30'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-green-100' : 'text-green-600'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-10 w-10 shrink-0 shadow-md shadow-green-200/30">
                  <AvatarFallback className="bg-gradient-to-br from-green-700 to-emerald-800 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 justify-start animate-fade-in">
              <Avatar className="h-10 w-10 shrink-0 shadow-md shadow-green-200/30">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 backdrop-blur-sm border border-green-200/50 rounded-xl px-4 py-3 shadow-md shadow-green-100/30">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                  <span className="text-sm text-green-800">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-green-200/50 bg-gradient-to-r from-green-50/30 to-emerald-50/20">
        <div className="flex gap-3">
          <Input
            placeholder="Type your message about Computer Science department..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="bg-white/80 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:shadow-md focus:shadow-green-200/30 border-green-300/50 focus:border-green-500 text-green-900 placeholder:text-green-500"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-700/30 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;