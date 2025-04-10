import { Link } from 'wouter';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * 
 * Main navigation header for the FinBuddy application.
 * Contains the app logo, navigation links, and theme toggle.
 */
export default function Header() {
  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* App Logo and Brand */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            {/* App Logo - Blue gradient background with trending icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <span className="material-icons">trending_up</span>
            </div>
            {/* Brand Name */}
            <h1 className="ml-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100">FinBuddy</h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <div className="font-medium text-primary-600 dark:text-primary-400 flex items-center cursor-pointer">
              <span className="material-icons mr-1 text-sm">menu_book</span>
              <span>Topics</span>
            </div>
          </Link>
          <div className="font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center cursor-pointer">
            <span className="material-icons mr-1 text-sm">insights</span>
            <span>Market Data</span>
          </div>
          <div className="font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center cursor-pointer">
            <span className="material-icons mr-1 text-sm">chat</span>
            <span>Ask FinBuddy</span>
          </div>
          <div className="font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center cursor-pointer">
            <span className="material-icons mr-1 text-sm">leaderboard</span>
            <span>My Progress</span>
          </div>
        </nav>
        
        {/* Right side controls - Theme toggle and mobile menu */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* Mobile Menu Button - only visible on small screens */}
          <button className="md:hidden text-neutral-500 dark:text-neutral-400">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
