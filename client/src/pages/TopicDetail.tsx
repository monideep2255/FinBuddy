import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExplanationTab from '@/components/ExplanationTab';
import RealWorldExampleTab from '@/components/RealWorldExampleTab';
import QuizTab from '@/components/QuizTab';
import Disclaimer from '@/components/Disclaimer';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, LogIn } from 'lucide-react';
import { Topic, Quiz, UserProgress } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

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
  
  // Fetch the user's progress for this topic (only if logged in)
  const { data: progress, isLoading: isProgressLoading } = useQuery<UserProgress>({
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
  });
  
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
    onSuccess: () => {
      // Invalidate the progress query to refetch
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/topics/${topicId}/progress`] });
      
      toast({
        title: 'Progress Updated',
        description: 'Your learning progress has been saved.',
        variant: 'default',
      });
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
      updateProgressMutation.mutate({
        lastAccessed: new Date().toISOString(),
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
    updateProgressMutation.mutate({
      completed: !progress?.completed,
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (isTopicLoading) {
    return (
      <div className="min-h-screen flex flex-col">
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
      <div className="min-h-screen flex flex-col">
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
    <div className="min-h-screen flex flex-col">
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
                  {!progress?.completed ? (
                    <button 
                      onClick={toggleCompleted}
                      disabled={updateProgressMutation.isPending}
                      className="w-full sm:w-auto px-3 py-2.5 sm:py-1.5 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg text-primary-700 dark:text-primary-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>Mark as Completed</span>
                    </button>
                  ) : (
                    <button 
                      onClick={toggleCompleted}
                      disabled={updateProgressMutation.isPending}
                      className="w-full sm:w-auto px-3 py-2.5 sm:py-1.5 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span className="flex-grow text-center">
                        Completed (Click to Undo)
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <Link href="/auth" className="w-full sm:w-auto">
                  <button className="w-full px-3 py-2.5 sm:py-1.5 bg-primary-50 dark:bg-primary-900/50 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg text-primary-700 dark:text-primary-400 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    <span>Login to track progress</span>
                  </button>
                </Link>
              )}
              
              <div className="w-full sm:w-auto flex gap-2">
                <button className="flex-1 px-3 py-2.5 sm:py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                  </svg>
                  <span>Save</span>
                </button>
                <button className="flex-1 px-3 py-2.5 sm:py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Topic Content Tabs */}
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex -mb-px">
              <button 
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'explanation' 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('explanation')}
              >
                Explanation
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'example' 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('example')}
              >
                Real-world Example
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'quiz' 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => handleTabChange('quiz')}
              >
                Quiz
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === 'liveData' 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
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
            <div className="py-6 font-serif">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Live Market Data</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                This feature will be available in Phase 2. Stay tuned for real-time market data related to {topic?.title}.
              </p>
              <div className="p-8 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-2">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                </svg>
                <p className="text-neutral-500 dark:text-neutral-400">Live data integration coming soon</p>
              </div>
            </div>
          )}
        </section>

        {/* Legal Disclaimer */}
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}
