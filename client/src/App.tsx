import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from 'react';
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TopicDetail from "@/pages/TopicDetail";

/**
 * Router Component
 * 
 * Defines the application's routes and maps them to their respective components.
 * Uses wouter for lightweight routing.
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/topics/:id" component={TopicDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * App Component
 * 
 * Main application component that provides context providers and global UI elements.
 * Initializes theme based on user preference.
 */
function App() {
  // Initialize theme from localStorage or system preference on app load
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Apply appropriate theme
    if (savedTheme === 'dark' || 
        (savedTheme === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
