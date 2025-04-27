import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExplanationTab from '@/components/ExplanationTab';
import RealWorldExampleTab from '@/components/RealWorldExampleTab';
import QuizTab from '@/components/QuizTab';
import LiveDataTab from '@/components/LiveDataTab';
import Disclaimer from '@/components/Disclaimer';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, LogIn, Bookmark, BookmarkX, Star, StarHalf, Stars } from 'lucide-react';
import { Topic, Quiz, UserProgress } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

type TabType = 'explanation' | 'example' | 'quiz' | 'liveData';

export default function TopicDetail() {
  const [, params] = useRoute('/topics/:id');
  const topicId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState<TabType>('explanation');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use the authenticated user's ID
  const userId = user?.id || 0;

  const { data: topic, isLoading: isTopicLoading } = useQuery<Topic>({
    queryKey: [`/api/topics/${topicId}`],
  });

  const { data: quiz, isLoading: isQuizLoading } = useQuery<Quiz>({
    queryKey: [`/api/topics/${topicId}/quiz`],
  });

  // Local state to track progress updates immediately
  const [localProgress, setLocalProgress] = useState<Partial<UserProgress>>({
    bookmarked: false,
    completed: false,
    difficultyRating: 0,
    quizScore: 0,
    quizAttempts: 0
  });

  // Fetch the user's progress for this topic (only if logged in)
  const { data: progress, isLoading: isProgressLoading } = useQuery<UserProgress | null>({
    queryKey: [`/api/users/${userId}/topics/${topicId}/progress`],
    queryFn: async () => {
      // Don't try to fetch progress if no user is logged in
      if (!user) return null;

      try {
        const res = await fetch(`/api/users/${userId}/topics/${topicId}/progress`);
        if (!res.ok) {
          // If the progress doesn't exist yet, return null
          if (res.status === 404) {
            return null;
          }
          throw new Error('Failed to fetch progress');
        }
        return await res.json();
      } catch (error) {
        // If there's no progress yet, that's okay
        return null;
      }
    },
    // Only run this query if the user is logged in and has an ID
    enabled: !!user?.id && !!topicId,
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: Infinity // Never garbage collect from cache
  });

  // Initialize local state when progress data is first loaded
  useEffect(() => {
    if (progress) {
      // Update the local state with the server data
      setLocalProgress({
        bookmarked: progress.bookmarked || false,
        completed: progress.completed || false,
        difficultyRating: progress.difficultyRating || 0,
        quizScore: progress.quizScore || 0,
        quizAttempts: progress.quizAttempts || 0
      });
    }
  }, [progress]); // Run when progress changes


  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async (data: Partial<UserProgress>) => {
      const res = await apiRequest(
        'POST',
        `/api/users/${userId}/topics/${topicId}/progress`,
        data
      );
      return await res.json();
    },
    onSuccess: (updatedProgress) => {
      // Update the cache directly instead of invalidating
      queryClient.setQueryData(
        [`/api/users/${userId}/topics/${topicId}/progress`], 
        updatedProgress
      );
      
      // Update the all-progress cache
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });

      // Silently update without notifications per user request
      // toast({
      //  title: 'Progress Updated',
      //  description: 'Your learning progress has been saved.',
      //  variant: 'default',
      // });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Mark the topic as accessed when the user views it (only if logged in)
  useEffect(() => {
    if (topicId && !isProgressLoading && user) {
      // Make sure we have a valid ISO formatted timestamp string
      const timestamp = new Date().toISOString();
      updateProgressMutation.mutate({
        lastAccessed: timestamp,
      });
    }
  }, [topicId, user]);

  // Handle quiz completion
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setQuizCompleted(true);

    // Update progress when quiz is completed
    updateProgressMutation.mutate({
      quizScore: score,
      quizAttempts: (progress?.quizAttempts || 0) + 1,
      // Mark as completed if score is above 70%
      completed: score >= 70,
    });
  };

  // Mark topic as completed or undo completion
  const toggleCompleted = () => {
    // Update local state immediately for responsive UI
    const newCompletedState = !localProgress.completed;
    setLocalProgress(prev => ({
      ...prev,
      completed: newCompletedState
    }));

    // Send to server
    updateProgressMutation.mutate({
      completed: newCompletedState,
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (isTopicLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Header />
        <main className="flex-grow">
          <section className="container mx-auto px-4 py-8 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <div className="flex items-center mb-4">
                  <Skeleton className="h-8 w-40" />
                </div>
                <Skeleton className="h-4 w-96 mb-2" />
              </div>
            </div>
            <div className="border-b border-neutral-200">
              <div className="flex -mb-px">
                <Skeleton className="h-10 w-24 mx-1" />
                <Skeleton className="h-10 w-24 mx-1" />
                <Skeleton className="h-10 w-24 mx-1" />
              </div>
            </div>
            <div className="py-6">
              <Skeleton className="h-6 w-60 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </div>
          </section>
          <Disclaimer />
        </main>
        <Footer />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Header />
        <main className="flex-grow">
          <section className="container mx-auto px-4 py-8">
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Topic Not Found</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">The topic you're looking for could not be found.</p>
              <Link href="/">
                <div className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  Return to Topics
                </div>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-8 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <div className="flex items-center mb-4">
                <Link href="/">
                  <div className="mr-3 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
                <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">{topic?.title}</h2>
                <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-secondary-50 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300">
                  {topic?.category}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl">{topic?.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {/* Progress Tracking - Only shown for logged in users */}
              {user ? (
                <>
                  <button 
                    onClick={toggleCompleted}
                    disabled={updateProgressMutation.isPending}
                    className={`w-full sm:w-auto px-3 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center
                      ${localProgress.completed
                        ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300' 
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                  >
                    {localProgress.completed ? (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="#22c55e" 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 mr-1.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    ) : (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 mr-1.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                    <span>
                      {localProgress.completed ? 'Completed' : 'Mark as Completed'}
                    </span>
                  </button>
                </>
              ) : (
                <Link href="/auth" className="w-full sm:w-auto">
                  <button className="w-full px-3 py-2.5 sm:py-1.5 bg-primary-50 dark:bg-primary-900/50 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg text-primary-700 dark:text-primary-400 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    <span>Login to track progress</span>
                  </button>
                </Link>
              )}

              {/* Bookmark and Difficulty Rating Buttons - Only shown for logged in users */}
              {user ? (
                <div className="w-full sm:w-auto flex gap-2">
                  {/* Bookmark Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => {
                            // Update local state immediately for responsive UI
                            const newBookmarkedState = !localProgress.bookmarked;
                            setLocalProgress(prev => ({
                              ...prev,
                              bookmarked: newBookmarkedState
                            }));

                            // Send to server
                            updateProgressMutation.mutate({
                              bookmarked: newBookmarkedState
                            });
                          }}
                          disabled={updateProgressMutation.isPending}
                          className={`flex-1 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center
                            ${localProgress.bookmarked
                              ? 'bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300' 
                              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                            }`}
                        >
                          {localProgress.bookmarked ? (
                            <>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="#f59e0b" 
                                stroke="#f59e0b" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="w-4 h-4 mr-1.5"
                              >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                              </svg>
                              <span>Bookmarked</span>
                            </>
                          ) : (
                            <>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="w-4 h-4 mr-1.5"
                              >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                              </svg>
                              <span>Bookmark</span>
                            </>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {localProgress.bookmarked 
                          ? "Remove this topic from your bookmarks" 
                          : "Save this topic to your bookmarks for easy access later"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Difficulty Rating Button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        className={`flex-1 px-3 py-2.5 sm:py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center
                          ${localProgress.difficultyRating
                            ? 'bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                          }`}
                      >
                        {localProgress.difficultyRating ? (
                          <Star className="w-4 h-4 mr-1.5 fill-current" />
                        ) : (
                          <StarHalf className="w-4 h-4 mr-1.5" />
                        )}
                        <span>
                          {localProgress.difficultyRating
                            ? `Difficulty: ${localProgress.difficultyRating}/5` 
                            : "Rate Difficulty"}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                      <h4 className="font-medium text-sm mb-2 text-neutral-800 dark:text-neutral-200">
                        {localProgress.difficultyRating ? "Update or reset your rating" : "How difficult was this topic?"}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                        Your rating helps us recommend appropriate topics for other learners
                      </p>
                      <div className="flex justify-between mb-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => {
                              // Reset rating if clicking the same rating again
                              const newRating = localProgress.difficultyRating === rating ? null : rating;
                              setLocalProgress(prev => ({
                                ...prev,
                                difficultyRating: newRating
                              }));
                              updateProgressMutation.mutate({
                                difficultyRating: newRating
                              });
                            }}
                            className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors
                              ${localProgress.difficultyRating === rating 
                                ? 'text-amber-500 dark:text-amber-400' 
                                : 'text-neutral-400 dark:text-neutral-600'
                              }`}
                          >
                            <Star 
                              className={`w-6 h-6 ${localProgress.difficultyRating === rating ? 'fill-amber-500' : ''}`} 
                            />
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-500 px-1.5">
                        <span>Easiest</span>
                        <span>Hardest</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="w-full sm:w-auto flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/auth" className="flex-1">
                          <button className="w-full px-3 py-2.5 sm:py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="w-4 h-4 mr-1.5"
                            >
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>Bookmark</span>
                          </button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        Login to bookmark topics
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>

          {/* Topic Content Tabs */}
          <div className="border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
            <div className="flex flex-nowrap -mb-px min-w-full">
              <button 
                className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'explanation' 
                    ? 'border-primary-500 text-blue-700 dark:text-blue-300 font-bold' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('explanation')}
              >
                Explanation
              </button>
              <button 
                className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'example' 
                    ? 'border-primary-500 text-blue-700 dark:text-blue-300 font-bold' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('example')}
              >
                Real-world Ex.
              </button>
              <button 
                className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'quiz' 
                    ? 'border-primary-500 text-blue-700 dark:text-blue-300 font-bold' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('quiz')}
              >
                Quiz
              </button>
              <button 
                className={`px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'liveData' 
                    ? 'border-primary-500 text-blue-700 dark:text-blue-300 font-bold' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('liveData')}
              >
                Live Data
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'explanation' && topic?.content && (
            <ExplanationTab explanation={topic.content.explanation} title={topic.title} />
          )}

          {activeTab === 'example' && topic?.content && (
            <RealWorldExampleTab example={topic.content.realWorldExample} title={topic.title} />
          )}

          {activeTab === 'quiz' && (
            <QuizTab 
              quiz={quiz} 
              isLoading={isQuizLoading} 
              onQuizComplete={handleQuizComplete} 
            />
          )}

          {activeTab === 'liveData' && (
            <LiveDataTab title={topic.title} />
          )}
        </section>

        {/* Legal Disclaimer */}
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}