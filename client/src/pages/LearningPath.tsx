import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Disclaimer from '@/components/Disclaimer';
import { Topic, UserProgress } from '@shared/schema';
import { Link } from 'wouter';
import { Bookmark, Check, BookmarkX, Award, ArrowRight, Star, Lightbulb, Frown } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryFn } from '@/lib/queryClient';

interface UserProgressResponse {
  userId: number;
  progressEntries: UserProgress[];
  completedTopics: number[];
  bookmarkedTopics: number[];
  totalComplete: number;
}

interface TopicWithProgress extends Topic {
  progress?: UserProgress;
}

/**
 * LearningPath Component
 * 
 * Displays a personalized learning path for logged-in users.
 * Shows completed topics, bookmarked topics, and recommends next topics to learn.
 */
export default function LearningPath() {
  const { user } = useAuth();
  const userId = user?.id || 0;
  const [activeTab, setActiveTab] = useState("progress");

  // Fetch all topics
  const { data: topics = [], isLoading: isTopicsLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  // Fetch user progress data
  const { data: progressData, isLoading: isProgressLoading } = useQuery<UserProgressResponse>({
    queryKey: [`/api/users/${userId}/progress`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!userId,
  });

  // Combine topics with progress data
  const topicsWithProgress: TopicWithProgress[] = topics.map(topic => {
    const progress = progressData?.progressEntries.find(p => p.topicId === topic.id);
    return {
      ...topic,
      progress
    };
  });

  // Filter for different tabs
  const completedTopics = topicsWithProgress.filter(topic => 
    topic.progress?.completed
  ).sort((a, b) => {
    // Sort by most recently completed
    const aDate = a.progress?.lastAccessed || new Date(0);
    const bDate = b.progress?.lastAccessed || new Date(0);
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  // Get bookmarked topics from API response
  const bookmarkedTopics = topicsWithProgress.filter(topic => 
    progressData?.bookmarkedTopics?.includes(topic.id) || 
    topic.progress?.bookmarked
  );

  // Get topics in progress (accessed but not completed)
  const inProgressTopics = topicsWithProgress.filter(topic => 
    topic.progress && !topic.progress.completed
  );

  // Recommended topics: not started, not bookmarked, based on categories the user has engaged with
  const getRecommendedTopics = () => {
    // Get categories user has engaged with
    const engagedCategories = new Set<string>();
    topicsWithProgress.forEach(topic => {
      if (topic.progress) {
        engagedCategories.add(topic.category);
      }
    });
    
    // Get list of bookmarked topic IDs
    const bookmarkedIds = new Set(
      bookmarkedTopics.map(topic => topic.id)
    );
    
    // Get completed topic IDs
    const completedIds = new Set(
      completedTopics.map(topic => topic.id)
    );

    // First, recommend topics from categories user has engaged with
    const categoryRecommendations = topicsWithProgress.filter(topic => 
      // Exclude completed and bookmarked topics
      !completedIds.has(topic.id) && 
      !bookmarkedIds.has(topic.id) && 
      engagedCategories.has(topic.category)
    );

    // Then add other topics if needed
    const otherTopics = topicsWithProgress.filter(topic => 
      !completedIds.has(topic.id) && 
      !bookmarkedIds.has(topic.id) && 
      !engagedCategories.has(topic.category)
    );

    // Combine and limit to 6 recommendations
    return [...categoryRecommendations, ...otherTopics].slice(0, 6);
  };

  const recommendedTopics = getRecommendedTopics();

  // Show skeletons while loading
  if (isTopicsLoading || isProgressLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mb-8" />
          </div>
          <Tabs defaultValue="progress">
            <TabsList className="mb-6">
              <Skeleton className="h-10 w-24 mr-1" />
              <Skeleton className="h-10 w-24 mr-1" />
              <Skeleton className="h-10 w-24" />
            </TabsList>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </Tabs>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate overall progress
  const totalTopics = topics.length;
  const completedCount = completedTopics.length;
  const progressPercentage = totalTopics > 0 
    ? Math.round((completedCount / totalTopics) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center">
            <Award className="mr-2 h-7 w-7 text-primary" />
            Your Learning Path
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Track your learning progress, bookmark topics for later, and get personalized recommendations
            based on your interests and learning history.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-neutral-800 dark:text-neutral-100">
              Overall Progress
            </CardTitle>
            <CardDescription>
              You've completed {completedCount} out of {totalTopics} topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {progressPercentage}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {progressPercentage === 0
                ? "Start your financial education journey today!"
                : progressPercentage < 30
                ? "Great start! Keep exploring more topics."
                : progressPercentage < 70
                ? "You're making good progress! Keep it up."
                : progressPercentage < 100
                ? "Almost there! Just a few more topics to master."
                : "Congratulations! You've completed all topics. What an achievement!"}
            </p>
          </CardContent>
        </Card>

        {/* Learning Path Tabs */}
        <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="progress" className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center">
              <Bookmark className="w-4 h-4 mr-2" />
              <span>Bookmarks</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              <span>Recommendations</span>
            </TabsTrigger>
          </TabsList>

          {/* Completed Topics Tab */}
          <TabsContent value="progress">
            {completedTopics.length === 0 && inProgressTopics.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Frown className="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  No topics in progress yet
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                  Start exploring financial topics to track your learning progress
                </p>
                <Link href="/">
                  <Button className="mx-auto">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {inProgressTopics.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center">
                      <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                      </span>
                      In Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inProgressTopics.map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          progress={topic.progress}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {completedTopics.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center">
                      <Check className="mr-2 h-5 w-5 text-emerald-500" />
                      Completed
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedTopics.map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          progress={topic.progress}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Bookmarked Topics Tab */}
          <TabsContent value="bookmarks">
            {bookmarkedTopics.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <BookmarkX className="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  No bookmarked topics yet
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                  Bookmark topics you want to revisit later while exploring
                </p>
                <Link href="/">
                  <Button className="mx-auto">
                    Explore Topics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedTopics.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    progress={topic.progress}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Recommended Topics Tab */}
          <TabsContent value="recommendations">
            {recommendedTopics.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Award className="h-12 w-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  You've explored all our topics!
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                  Congratulations on your dedication to financial learning
                </p>
                <Link href="/chat">
                  <Button className="mx-auto">
                    Chat with FinBuddy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTopics.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    progress={topic.progress}
                    isRecommendation={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Legal Disclaimer */}
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}

interface TopicCardProps {
  topic: Topic;
  progress?: UserProgress;
  isRecommendation?: boolean;
}

function TopicCard({ topic, progress, isRecommendation = false }: TopicCardProps) {
  // Determine category color class
  let categoryColorClass = "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  
  if (topic.category === "Economics") {
    categoryColorClass = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
  } else if (topic.category === "Investments") {
    categoryColorClass = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
  } else if (topic.category === "Personal Finance") {
    categoryColorClass = "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
  }

  return (
    <Link href={`/topics/${topic.id}`}>
      <Card className="h-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer">
        {/* Colored top accent bar */}
        <div className={`h-2 ${isRecommendation ? 'bg-gradient-to-r from-amber-500 to-amber-600' : progress?.completed ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}></div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg text-neutral-800 dark:text-neutral-100">
              {topic.title}
            </CardTitle>
            <div className="flex items-center gap-1 flex-shrink-0">
              {progress?.bookmarked && <Bookmark className="h-4 w-4 fill-primary-500 text-primary-500" />}
              {isRecommendation && <Lightbulb className="h-4 w-4 text-amber-500" />}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColorClass} flex-shrink-0`}>
                {topic.category}
              </span>
            </div>
          </div>
          <CardDescription className="line-clamp-2">
            {topic.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 pb-2">
          {progress?.quizScore !== null && progress?.quizScore !== undefined && (
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span className="mr-1">Quiz Score: </span>
              <span className="font-medium">{progress.quizScore}%</span>
              {progress.quizScore >= 80 && (
                <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Passed
                </Badge>
              )}
            </div>
          )}
          
          {progress?.difficultyRating && (
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
              <span className="mr-1">Difficulty: </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= progress.difficultyRating! 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-neutral-300 dark:text-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isRecommendation && (
            <Badge variant="outline" className="mt-2 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
              Recommended for you
            </Badge>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="w-full px-4 py-2 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg text-primary-700 dark:text-primary-300 text-sm font-medium transition-all duration-200 flex items-center justify-center">
            {progress?.completed 
              ? "Review Topic" 
              : isRecommendation 
                ? "Start Learning" 
                : "Continue Learning"}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}