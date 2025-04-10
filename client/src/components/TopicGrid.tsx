import TopicCard from './TopicCard';
import { Topic } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TopicGridProps {
  topics: Topic[];
  isLoading: boolean;
}

export default function TopicGrid({ topics, isLoading }: TopicGridProps) {
  // If loading, show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="h-2 bg-primary-100"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 rounded-lg" />
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
        <span className="material-icons text-4xl text-neutral-300 mb-2">search_off</span>
        <h3 className="text-xl font-medium text-neutral-700 mb-2">No topics found</h3>
        <p className="text-neutral-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  // Render the actual topic grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
