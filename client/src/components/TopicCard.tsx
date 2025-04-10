import { Link } from 'wouter';
import { Topic } from '@/lib/types';

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
 */
export default function TopicCard({ topic }: TopicCardProps) {
  // Determine the category badge styling based on the topic category
  const categoryColorClass = topic.category === 'Economics' 
    ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400' 
    : 'bg-secondary-50 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-400';

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Colored top accent bar */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      
      <div className="p-6">
        {/* Topic header with title and category badge */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{topic.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColorClass}`}>
            {topic.category}
          </span>
        </div>
        
        {/* Topic description with line clamping for consistent card height */}
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3">
          {topic.description}
        </p>
        
        {/* Footer with reading time and explore button */}
        <div className="flex items-center justify-between">
          {/* Reading time indicator */}
          <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-500">
            <span className="material-icons text-sm mr-1">schedule</span>
            <span>{topic.readingTime}</span>
          </div>
          
          {/* Explore button - links to topic detail page */}
          <Link href={`/topics/${topic.id}`}>
            <div className="px-4 py-1.5 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg text-primary-700 dark:text-primary-400 text-sm font-medium transition-colors duration-200 cursor-pointer">
              Explore
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
