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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Brand Section */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              {/* Logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-icons text-sm">trending_up</span>
              </div>
              {/* Brand Name */}
              <h2 className="ml-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100">FinBuddy</h2>
            </div>
            {/* Tagline */}
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">Your AI-Powered Finance Learning Companion</p>
          </div>
          
          {/* Links Section - organized in a grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {/* Topics Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Topics</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Economics</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Investments</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Markets</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Personal Finance</a></li>
              </ul>
            </div>
            
            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Glossary</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Market Data</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Learning Paths</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">FAQ</a></li>
              </ul>
            </div>
            
            {/* About Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">How It Works</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Legal</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Privacy</a></li>
                <li><a href="#" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">Contact</a></li>
              </ul>
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
