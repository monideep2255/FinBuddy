import { Link } from 'wouter';
import { Topic } from '@/lib/types';

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const categoryColorClass = topic.category === 'Economics' 
    ? 'bg-primary-50 text-primary-700' 
    : 'bg-secondary-50 text-secondary-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-2 bg-primary-600"></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">{topic.title}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColorClass}`}>
            {topic.category}
          </span>
        </div>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{topic.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-neutral-500">
            <span className="material-icons text-sm mr-1">schedule</span>
            <span>{topic.readingTime}</span>
          </div>
          <Link href={`/topics/${topic.id}`}>
            <a className="px-4 py-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg text-primary-700 text-sm font-medium transition-colors duration-200">
              Explore
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
