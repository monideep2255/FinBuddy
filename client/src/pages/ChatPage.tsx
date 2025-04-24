import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChatMessage } from "../../../shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
import { Loader2, Send, Link, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link as RouterLink } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Check OpenAI connection status
  const { data: openaiStatus, isLoading: isOpenAIStatusLoading } = useQuery({
    queryKey: ["/api/openai/status"],
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/openai/status", { signal });
      if (!res.ok) throw new Error("Failed to check OpenAI status");
      return res.json();
    },
    refetchOnWindowFocus: false,
    retry: 1
  });

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
      // Auto-scroll is handled in the useEffect that watches chatHistory.length
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

      // Auto-scroll is handled in the useEffect that watches chatHistory.length
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

  // Auto-scroll only when new messages are added, not for every state change
  useEffect(() => {
    if (chatHistory.length > 0) {
      const scrollElement = chatBottomRef.current?.parentElement;
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatHistory.length]);

  return (
    <>
      <Header />
      <div className="container px-2 sm:px-4 md:px-6 py-4 sm:py-6 max-w-4xl mx-auto min-h-[calc(100vh-250px)]">
        <Card className="flex flex-col shadow-lg h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden bg-background">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Info className="h-5 w-5" />
              Ask Me Anything
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-grow p-0 relative overflow-hidden">
            <ScrollArea className="h-[calc(100%-4px)] p-4 pb-2">
              {chatHistory.length === 0 && !isHistoryLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                  <h3 className="text-xl font-semibold mb-2">Welcome to FinBuddy Chat!</h3>
                  <p className="max-w-md mb-4">
                    Ask me any financial question, and I'll provide a helpful explanation with real-world examples.
                  </p>
                  <div className="grid grid-cols-1 gap-3 w-full max-w-lg mx-auto px-2">
                    {[
                      "How does inflation affect the value of my savings over time?",
                      "What are treasury yields and how do they work?",
                      "How do interest rate changes impact stock market performance?",
                      "Can you explain how bonds work in simple terms?"
                    ].map((suggestion, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        className="justify-start text-left h-auto py-2 text-sm sm:text-base w-full overflow-hidden text-ellipsis hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
                        onClick={() => {
                          setQuestion(suggestion);
                          chatMutation.mutate({
                            question: suggestion,
                            userId: user?.id
                          });
                        }}
                      >
                        <span className="truncate">{suggestion}</span>
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
                          <div className="rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] break-words">
                            <div className="whitespace-pre-wrap text-sm sm:text-base">{message.question}</div>
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
                            <div className="rounded-lg p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] space-y-3 break-words bg-background border">
                              <div className="whitespace-pre-wrap">{message.answer}</div>

                              {message.example && (
                                <div className="mt-3">
                                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Example:</h4>
                                  <div className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-neutral-900 p-2 rounded-md whitespace-pre-wrap break-words">
                                    {message.example}
                                  </div>
                                </div>
                              )}

                              {message.relatedTopicId && (
                                <div className="mt-2 pt-2 border-t border-border">
                                  <div className="flex items-center flex-wrap gap-1 text-sm">
                                    <Link className="h-4 w-4 flex-shrink-0" />
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

          <CardFooter className="border-t p-3 bg-white dark:bg-neutral-900 shadow-lg sticky bottom-0 z-20">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                type="text"
                placeholder="Ask me anything about finance..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={chatMutation.isPending}
                className="flex-grow bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-700 focus-visible:ring-primary h-10 sm:h-10 px-3 text-base text-foreground"
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={!question.trim() || chatMutation.isPending}
                className="h-10 px-3 flex-shrink-0"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>

        {/* OpenAI Status Alert */}
        {openaiStatus && !openaiStatus.apiKeyConfigured && (
          <Alert className="mt-4 bg-yellow-50 dark:bg-yellow-900/60 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>OpenAI API key is not configured. Responses will use fallback content.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs dark:text-yellow-300 border-yellow-300 dark:border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-800/50"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/openai/status"] });
                  toast({
                    title: "Checking OpenAI connection",
                    description: "Verifying connection to OpenAI API...",
                  });
                }}
              >
                Check Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {openaiStatus && openaiStatus.apiKeyConfigured && openaiStatus.status !== "connected" && (
          <Alert className="mt-4 bg-orange-50 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>OpenAI connection failed. Chat responses may be limited.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs dark:text-orange-300 border-orange-300 dark:border-orange-600 hover:bg-orange-100 dark:hover:bg-orange-800/50"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/openai/status"] });
                  toast({
                    title: "Checking OpenAI connection",
                    description: "Verifying connection to OpenAI API...",
                  });
                }}
              >
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {openaiStatus && openaiStatus.apiKeyConfigured && openaiStatus.status === "connected" && (
          <Alert className="mt-4 bg-green-50 dark:bg-green-900/60 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>OpenAI connection is active and working properly.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs dark:text-green-300 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-800/50"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/openai/status"] });
                  toast({
                    title: "Refreshing OpenAI status",
                    description: "Checking connection status...",
                  });
                }}
              >
                Refresh Status
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center text-xs text-muted-foreground mt-4 mb-8">
          <p>Powered by OpenAI GPT-4o • Financial information is for educational purposes only</p>
        </div>
      </div>

      <Footer />
    </>
  );
}