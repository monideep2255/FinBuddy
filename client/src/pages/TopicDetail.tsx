import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExplanationTab from '@/components/ExplanationTab';
import RealWorldExampleTab from '@/components/RealWorldExampleTab';
import QuizTab from '@/components/QuizTab';
import Disclaimer from '@/components/Disclaimer';
import { Skeleton } from '@/components/ui/skeleton';

type TabType = 'explanation' | 'example' | 'quiz' | 'liveData';

export default function TopicDetail() {
  const [, params] = useRoute('/topics/:id');
  const topicId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState<TabType>('explanation');

  const { data: topic, isLoading: isTopicLoading } = useQuery({
    queryKey: [`/api/topics/${topicId}`],
  });

  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: [`/api/topics/${topicId}/quiz`],
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (isTopicLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <section className="container mx-auto px-4 py-8 bg-white rounded-xl shadow-sm border border-neutral-100 mb-8">
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
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Topic Not Found</h2>
              <p className="text-neutral-600 mb-6">The topic you're looking for could not be found.</p>
              <Link href="/">
                <a className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                  Return to Topics
                </a>
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
        <section className="container mx-auto px-4 py-8 bg-white rounded-xl shadow-sm border border-neutral-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <div className="flex items-center mb-4">
                <Link href="/">
                  <a className="mr-3 text-neutral-500 hover:text-neutral-700">
                    <span className="material-icons">arrow_back</span>
                  </a>
                </Link>
                <h2 className="text-2xl font-semibold text-neutral-800">{topic.title}</h2>
                <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-secondary-50 text-secondary-700">
                  {topic.category}
                </span>
              </div>
              <p className="text-neutral-600 max-w-3xl">{topic.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 text-sm font-medium transition-colors duration-200 flex items-center">
                <span className="material-icons text-sm mr-1">bookmark</span>
                Save
              </button>
              <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 text-sm font-medium transition-colors duration-200 flex items-center">
                <span className="material-icons text-sm mr-1">share</span>
                Share
              </button>
            </div>
          </div>

          {/* Topic Content Tabs */}
          <div className="border-b border-neutral-200">
            <div className="flex -mb-px">
              <button 
                className={`px-4 py-3 border-b-2 font-medium ${
                  activeTab === 'explanation' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => handleTabChange('explanation')}
              >
                Explanation
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium ${
                  activeTab === 'example' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => handleTabChange('example')}
              >
                Real-world Example
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium ${
                  activeTab === 'quiz' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => handleTabChange('quiz')}
              >
                Quiz
              </button>
              <button 
                className={`px-4 py-3 border-b-2 font-medium ${
                  activeTab === 'liveData' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
                onClick={() => handleTabChange('liveData')}
              >
                Live Data
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'explanation' && (
            <ExplanationTab explanation={topic.content.explanation} title={topic.title} />
          )}
          
          {activeTab === 'example' && (
            <RealWorldExampleTab example={topic.content.realWorldExample} title={topic.title} />
          )}
          
          {activeTab === 'quiz' && (
            <QuizTab quiz={quiz} isLoading={isQuizLoading} />
          )}
          
          {activeTab === 'liveData' && (
            <div className="py-6 font-serif">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Live Market Data</h3>
              <p className="text-neutral-700 mb-4">
                This feature will be available in Phase 2. Stay tuned for real-time market data related to {topic.title}.
              </p>
              <div className="p-8 border border-dashed border-neutral-300 rounded-lg text-center">
                <span className="material-icons text-4xl text-neutral-400 mb-2">insights</span>
                <p className="text-neutral-500">Live data integration coming soon</p>
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
