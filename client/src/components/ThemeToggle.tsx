import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeToggle Component
 * 
 * A button component that toggles between light and dark mode themes.
 * It persists the user's preference in localStorage and syncs with system preferences.
 * 
 * Usage:
 * <ThemeToggle />
 */
export default function ThemeToggle() {
  // State to track current theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Effect to initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if user has previously set a theme preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || storedTheme === 'light') {
      // Use stored preference if available
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Otherwise use system preference if available
      setTheme('dark');
    }
    
    // Apply theme to document
    applyTheme(storedTheme as 'light' | 'dark' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }, []);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Function to apply theme to HTML document
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}