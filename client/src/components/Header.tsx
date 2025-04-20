import { Link } from 'wouter';
import ThemeToggle from './ThemeToggle';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Header Component
 * 
 * Main navigation header for the FinBuddy application.
 * Contains the app logo, navigation links, and theme toggle.
 * Responsive design for both mobile and desktop views.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* App Logo and Brand */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            {/* App Logo - Blue gradient background with coin icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
              </svg>
            </div>
            {/* Brand Name */}
            <h1 className="ml-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100">FinBuddy</h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 flex-grow justify-center">
          <Link href="/">
            <div className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 data-[active=true]:text-primary-600 dark:data-[active=true]:text-primary-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <span>Topics</span>
            </div>
          </Link>
          <Link href="/market-data">
            <div className="font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
              </svg>
              <span>Market Data</span>
            </div>
          </Link>
          <div className="font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
            </svg>
            <span>Ask FinBuddy</span>
          </div>
        </nav>
        
        {/* Right side controls - Auth buttons, Mobile menu, and Theme toggle */}
        <div className="flex items-center space-x-3">
          {/* Auth Buttons - Desktop */}
          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <User className="h-4 w-4 inline mr-1" />
                <span className="hidden lg:inline">{user.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></span> : 
                  <LogOut className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Link href="/auth" className="hidden md:block">
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            </Link>
          )}

          {/* Auth Button - Mobile (More visible) */}
          {!user ? (
            <Link href="/auth" className="md:hidden">
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                <span>Login</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="md:hidden h-9 w-9 p-0 rounded-full bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></span> : 
                <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
            </Button>
          )}
          
          {/* Mobile Menu Button - only visible on small screens */}
          <button 
            className="md:hidden text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          
          {/* Theme Toggle Button - always at the end */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu - Overlay Style */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 absolute w-full z-50 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3 py-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 data-[active=true]:text-primary-600 dark:data-[active=true]:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  <span className="text-lg">Topics</span>
                </div>
              </Link>
              <Link href="/market-data" onClick={() => setMobileMenuOpen(false)}>
                <div className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 data-[active=true]:text-primary-600 dark:data-[active=true]:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                  </svg>
                  <span>Market Data</span>
                </div>
              </Link>
              <div className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                </svg>
                <span>Ask FinBuddy</span>
              </div>
              {/* Removed My Progress entry */}
              
              {/* Mobile Auth Options */}
              {user ? (
                <div
                  className="font-medium text-neutral-600 dark:text-neutral-300 flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => {
                    logoutMutation.mutate();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                  <span>Logout ({user.username})</span>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <div className="font-medium text-neutral-600 dark:text-neutral-300 flex items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <LogIn className="w-5 h-5 mr-3 text-primary-500 dark:text-primary-400" />
                    <span>Login / Register</span>
                  </div>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
