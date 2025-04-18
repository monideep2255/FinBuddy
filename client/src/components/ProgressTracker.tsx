import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Topic, UserProgressResponse } from "@/lib/types";

interface ProgressTrackerProps {
  userId: number;
}

/**
 * ProgressTracker Component
 * 
 * Displays a user's progress across all financial topics,
 * including completed topics and overall progress.
 */
export default function ProgressTracker({ userId }: ProgressTrackerProps) {
  // Fetch the user's progress data
  const { data: userProgress, isLoading: isProgressLoading } = useQuery<UserProgressResponse>({
    queryKey: [`/api/users/${userId}/progress`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch all topics to display progress against
  const { data: topics, isLoading: isTopicsLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const isLoading = isProgressLoading || isTopicsLoading;

  // If we don't have the data yet, show a loading state
  if (isLoading || !topics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>Track your journey through financial topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Loading your progress...</span>
              <Progress value={0} className="w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate progress statistics
  const completedTopics = userProgress?.completedTopics || [];
  const totalTopics = topics.length;
  const completedCount = completedTopics.length;
  const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center text-neutral-800 dark:text-neutral-100">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Your Learning Progress
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-neutral-400">Track your journey through financial topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Overall progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Overall Progress</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Summary statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed</p>
                <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{completedCount} Topics</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Remaining</p>
                <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{totalTopics - completedCount} Topics</p>
              </div>
            </div>
          </div>

          {/* Recent achievements */}
          {completedTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-neutral-800 dark:text-neutral-100">Recently Completed</h4>
              <div className="flex flex-wrap gap-2">
                {completedTopics.slice(0, 3).map((topicId: number) => {
                  const topic = topics.find((t: Topic) => t.id === topicId);
                  return topic ? (
                    <Badge key={topic.id} variant="secondary" className="text-xs">
                      {topic.title}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Encouragement message */}
          {progressPercentage < 100 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              {progressPercentage === 0
                ? "Start your financial education journey today!"
                : progressPercentage < 30
                ? "Great start! Keep exploring more topics."
                : progressPercentage < 70
                ? "You're making good progress! Keep it up."
                : "Almost there! Just a few more topics to master."}
            </p>
          )}

          {progressPercentage === 100 && (
            <div className="bg-primary/10 p-3 rounded-md mt-2">
              <p className="text-sm font-medium text-primary flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Congratulations! You've completed all topics.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}