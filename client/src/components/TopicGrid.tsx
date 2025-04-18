import TopicCard from './TopicCard';
import { Topic } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Props for TopicGrid component
 */
interface TopicGridProps {
  topics: Topic[];
  isLoading: boolean;
}

/**
 * TopicGrid Component
 * 
 * Displays a responsive grid of topic cards with pagination.
 * Shows skeletons while loading or a message when no topics are found.
 * 
 * @param {TopicGridProps} props - Component props
 * @returns {JSX.Element} Grid of topic cards with pagination
 */
export default function TopicGrid({ topics, isLoading }: TopicGridProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 6;
  
  // Calculate pagination values
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = topics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(topics.length / topicsPerPage);
  
  // Pagination handlers
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(page => Math.max(page - 1, 1));

  // If loading, show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className="h-2 bg-primary-100 dark:bg-primary-900"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700" />
                <Skeleton className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <Skeleton className="h-4 w-full mb-2 bg-neutral-200 dark:bg-neutral-700" />
              <Skeleton className="h-4 w-full mb-2 bg-neutral-200 dark:bg-neutral-700" />
              <Skeleton className="h-4 w-3/4 mb-4 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700" />
                <Skeleton className="h-8 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no topics found
  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-icons text-4xl text-neutral-300 dark:text-neutral-600 mb-2">search_off</span>
        <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          No topics found
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  // Render the actual topic grid with pagination
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center h-9 w-9 rounded-md border border-neutral-200 dark:border-neutral-800 
                      ${currentPage === 1 
                        ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' 
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="text-sm text-neutral-700 dark:text-neutral-300 px-3">
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center h-9 w-9 rounded-md border border-neutral-200 dark:border-neutral-800 
                      ${currentPage === totalPages 
                        ? 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed' 
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
