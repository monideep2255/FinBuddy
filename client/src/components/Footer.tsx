import { Link } from 'wouter';

/**
 * Footer Component
 * 
 * Website footer containing links to topic categories, resources, and company information.
 * Also displays copyright information and branding.
 */
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* App description */}
          <div className="w-full">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">FinBuddy</h3>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 max-w-lg">
              FinBuddy is your AI-powered financial education companion. Learn key financial concepts through simple explanations, real-world examples, and interactive quizzes.
            </p>
            
            {/* Categories as tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Link href="/">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
                  Economics
                </span>
              </Link>
              <Link href="/">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full">
                  Investments
                </span>
              </Link>
              <Link href="/">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full">
                  Markets
                </span>
              </Link>
              <Link href="/">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full">
                  Personal Finance
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 text-center">
          <p>© {new Date().getFullYear()} FinBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
