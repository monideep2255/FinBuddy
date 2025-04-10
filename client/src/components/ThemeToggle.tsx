import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { toast } = useToast();

  // Effect to initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if user has previously set a theme preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
      // Use stored preference if available
      setTheme(storedTheme as 'light' | 'dark' | 'system');
    }
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
    
    // Show toast notification
    toast({
      title: `${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} theme activated`,
      description: nextTheme === 'system' 
        ? "Following your system preference" 
        : `Switched to ${nextTheme} mode`,
      duration: 2000,
    });
  };
  
  // Function to get the next theme in the cycle
  const getNextTheme = (): 'light' | 'dark' | 'system' => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  // Function to apply theme to HTML document
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    // Logic for system preference
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  // Get current effective theme (accounting for system setting)
  const effectiveTheme = 
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      title={`Theme: ${theme} (click to change)`}
      aria-label="Toggle theme"
      className="text-neutral-700 dark:text-neutral-300"
    >
      {/* Show icon based on effective theme */}
      {effectiveTheme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}