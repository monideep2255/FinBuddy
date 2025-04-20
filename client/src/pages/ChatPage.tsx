import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "../../../shared/schema";

// Extend the ChatMessage interface for frontend usage
interface ExtendedChatMessage extends Omit<ChatMessage, 'timestamp'> {
  timestamp: string;
  pending?: boolean;
}

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Link, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link as RouterLink } from "wouter";

interface ChatHistory extends Omit<ChatMessage, 'timestamp'> {
  timestamp: string;
  pending?: boolean;
}

interface ChatResponse {
  id: number;
  question: string;
  response: {
    answer: string;
    example: string;
    relatedTopic: {
      id?: number;
      title: string;
    };
  };
  timestamp: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  // Fetch chat history
  const { data: history, isLoading: isHistoryLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/chat/history", { signal });
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return res.json();
    }
  });
  
  // Update chat history when data is fetched
  useEffect(() => {
    if (history) {
      // Convert ChatMessage[] to ChatHistory[] with string timestamps
      const formattedHistory: ChatHistory[] = history.map(msg => ({
        ...msg,
        timestamp: typeof msg.timestamp === 'string' 
          ? msg.timestamp 
          : new Date(msg.timestamp).toISOString()
      }));
      
      // Sort by timestamp
      formattedHistory.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      
      setChatHistory(formattedHistory);
    }
  }, [history]);
  
  // Mutation for submitting a question
  const chatMutation = useMutation({
    mutationFn: async (data: { question: string; userId?: number }) => {
      const res = await apiRequest("POST", "/api/chat", data);
      return await res.json() as ChatResponse;
    },
    onMutate: (variables) => {
      // Optimistically add the pending question to chat history
      const pendingMessage: ChatHistory = {
        id: Date.now(), // Temporary ID
        userId: user?.id || null,
        question: variables.question,
        answer: "",
        example: "",
        relatedTopicId: null,
        relatedTopicTitle: "",
        timestamp: new Date().toISOString(),
        pending: true
      };
      
      setChatHistory(prev => [...prev, pendingMessage]);
      setQuestion(""); // Clear input field
      
      // Scroll to bottom
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onSuccess: (data) => {
      // Remove the pending message and add the actual response
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.pending);
        
        const newMessage: ChatHistory = {
          id: data.id,
          userId: user?.id || null,
          question: data.question,
          answer: data.response.answer,
          example: data.response.example,
          relatedTopicId: data.response.relatedTopic.id || null,
          relatedTopicTitle: data.response.relatedTopic.title,
          timestamp: data.timestamp
        };
        
        return [...filtered, newMessage];
      });
      
      // Scroll to bottom
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error: Error) => {
      // Remove the pending message
      setChatHistory(prev => prev.filter(msg => !msg.pending));
      
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    chatMutation.mutate({
      question: question.trim(),
      userId: user?.id
    });
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <Card className="flex flex-col h-[80vh] shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Ask Me Anything
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow p-0 relative">
          <ScrollArea className="h-full p-4">
            {chatHistory.length === 0 && !isHistoryLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <h3 className="text-xl font-semibold mb-2">Welcome to FinBuddy Chat!</h3>
                <p className="max-w-md mb-4">
                  Ask me any financial question, and I'll provide a helpful explanation with real-world examples.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  {[
                    "Explain how inflation affects my savings",
                    "What are treasury yields?",
                    "How do interest rates impact the stock market?",
                    "Explain bonds in simple terms"
                  ].map((suggestion, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      className="justify-start text-left h-auto py-2"
                      onClick={() => {
                        setQuestion(suggestion);
                        chatMutation.mutate({
                          question: suggestion,
                          userId: user?.id
                        });
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isHistoryLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin opacity-70" />
                  </div>
                ) : (
                  chatHistory.map((message) => (
                    <div key={message.id + (message.pending ? '-pending' : '')}>
                      {/* User Message */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user ? user.username.charAt(0).toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg bg-muted p-3 max-w-[85%]">
                          {message.question}
                        </div>
                      </div>
                      
                      {/* Bot Response */}
                      {message.pending ? (
                        <div className="flex items-start gap-3 opacity-70">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground">FB</AvatarFallback>
                            <AvatarImage src="/logo.png" alt="FinBuddy" />
                          </Avatar>
                          <div className="flex items-center gap-2 p-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground">FB</AvatarFallback>
                            <AvatarImage src="/logo.png" alt="FinBuddy" />
                          </Avatar>
                          <div className="rounded-lg bg-primary/5 p-3 max-w-[85%] space-y-3">
                            <div>{message.answer}</div>
                            
                            {message.example && (
                              <div className="mt-3">
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Example:</h4>
                                <div className="text-muted-foreground text-sm bg-background p-2 rounded-md">
                                  {message.example}
                                </div>
                              </div>
                            )}
                            
                            {message.relatedTopicId && (
                              <div className="mt-2 pt-2 border-t border-border">
                                <div className="flex items-center gap-1 text-sm">
                                  <Link className="h-4 w-4" />
                                  <span>Related Topic: </span>
                                  <RouterLink to={`/topics/${message.relatedTopicId}`}>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                                      {message.relatedTopicTitle}
                                    </Badge>
                                  </RouterLink>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t p-3">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="Ask me anything about finance..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={chatMutation.isPending}
              className="flex-grow"
            />
            <Button 
              type="submit" 
              disabled={!question.trim() || chatMutation.isPending}
            >
              {chatMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground mt-4">
        <p>Powered by OpenAI GPT-4o • Financial information is for educational purposes only</p>
      </div>
    </div>
  );
}