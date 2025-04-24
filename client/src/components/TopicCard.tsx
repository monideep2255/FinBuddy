import { Link } from 'wouter';
import { Topic } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

/**
 * Props for the TopicCard component
 */
interface TopicCardProps {
  topic: Topic;
}

/**
 * TopicCard Component
 * 
 * Displays information about a single financial topic in a card format.
 * Used in the topic grid on the homepage.
 * 
 * @param {TopicCardProps} props - Component props
 * @returns {JSX.Element} A card component with topic details
 * 
 * Enhanced for mobile devices:
 * - The entire card is wrapped in Link
 * - Clear visual cues for interaction
 * - Proper hover states
 */
export default function TopicCard({ topic }: TopicCardProps) {
  // Determine the category badge styling based on the topic category
  const categoryColorClass = topic.category === 'Economics' 
    ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400' 
    : 'bg-secondary-50 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-400';

  return (
    <Link href={`/topics/${topic.id}`} className="block group">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:border-primary-200 dark:group-hover:border-primary-800 h-full flex flex-col">
        {/* Colored top accent bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        
        <div className="p-6 flex flex-col flex-grow">
          {/* Topic header with title and category badge */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {topic.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColorClass} flex-shrink-0 self-start`}>
              {topic.category}
            </span>
          </div>
          
          {/* Topic description with line clamping for consistent card height */}
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3 flex-grow">
            {topic.description}
          </p>
          
          {/* Footer with explore button (enhanced visibility on mobile) */}
          <div className="flex items-center justify-center sm:justify-end mt-auto pt-2">
            <div className="px-4 py-3 sm:py-2 bg-primary-100 dark:bg-primary-900 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 rounded-lg text-primary-700 dark:text-primary-300 text-sm font-medium transition-colors duration-200 w-full flex items-center justify-center">
              <span>Explore Topic</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
