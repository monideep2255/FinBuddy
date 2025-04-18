import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicGrid from '@/components/TopicGrid';
import Disclaimer from '@/components/Disclaimer';
import ProgressTracker from '@/components/ProgressTracker';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Topic } from '@/lib/types';

// Temporary simulated auth state - in a real app this would come from an auth context
const demoIsLoggedIn = true; // Change to false to simulate logged out state

/**
 * Home Page Component
 * 
 * Main landing page of the FinBuddy application. Displays a grid of financial topics
 * with search and filtering capabilities.
 */
export default function Home() {
  // State for search and filtering options
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Topics');
  const [sortOrder, setSortOrder] = useState('Sort by Relevance');

  // Fetch topics data from API
  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  /**
   * Event handler for search input changes
   * @param e - Input change event
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Event handler for category filter changes
   * @param e - Select change event
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  /**
   * Event handler for sort order changes
   * @param e - Select change event
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  /**
   * Filter topics based on search query and category
   */
  const filteredTopics = topics.filter((topic: Topic) => {
    // Check if topic matches search query (title or description)
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if topic matches selected category or "All Topics" is selected
    const matchesCategory = categoryFilter === 'All Topics' || topic.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  /**
   * Sort topics based on selected sort order
   */
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortOrder === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'Recently Added') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: Sort by Relevance (keep original order)
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${demoIsLoggedIn ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {/* Page Title and Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  Financial Topic Explorer
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl">
                  Learn key financial concepts through simple explanations, real-world examples, and interactive quizzes.
                </p>
              </div>
            </div>
            
            {/* Progress Tracker - Only shown for logged in users */}
            {demoIsLoggedIn && (
              <div className="lg:col-span-1">
                <ProgressTracker userId={1} />
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 dark:text-neutral-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-neutral-200 dark:border-neutral-800 
                          bg-white dark:bg-neutral-900 
                          text-neutral-800 dark:text-neutral-200
                          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Filter and Sort Dropdowns */}
            <div className="flex space-x-2">
              {/* Category Filter */}
              <select
                className="border border-neutral-200 dark:border-neutral-800 
                          rounded-lg px-3 py-2 
                          bg-white dark:bg-neutral-900 
                          text-neutral-700 dark:text-neutral-300 
                          focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={categoryFilter}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
              >
                <option>All Topics</option>
                <option>Economics</option>
                <option>Investments</option>
                <option>Personal Finance</option>
              </select>
              
              {/* Sort Order */}
              <select
                className="border border-neutral-200 dark:border-neutral-800 
                          rounded-lg px-3 py-2 
                          bg-white dark:bg-neutral-900 
                          text-neutral-700 dark:text-neutral-300 
                          focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={sortOrder}
                onChange={handleSortChange}
                aria-label="Sort by"
              >
                <option>Sort by Relevance</option>
                <option>Alphabetical</option>
                <option>Recently Added</option>
              </select>
            </div>
          </div>

          {/* Topic Cards Grid */}
          <TopicGrid topics={sortedTopics} isLoading={isLoading} />
        </section>

        {/* Legal Disclaimer */}
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}
