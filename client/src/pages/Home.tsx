import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopicGrid from '@/components/TopicGrid';
import Disclaimer from '@/components/Disclaimer';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Topics');
  const [sortOrder, setSortOrder] = useState('Sort by Relevance');

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['/api/topics'],
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  // Filter topics based on search query and category
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Topics' || topic.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort topics based on selected sort order
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Financial Topic Explorer</h2>
            <p className="text-neutral-600 max-w-3xl">
              Learn key financial concepts through simple explanations, real-world examples, and interactive quizzes.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                <span className="material-icons text-xl">search</span>
              </span>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <option>All Topics</option>
                <option>Economics</option>
                <option>Investments</option>
                <option>Markets</option>
              </select>
              <select
                className="border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={sortOrder}
                onChange={handleSortChange}
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
