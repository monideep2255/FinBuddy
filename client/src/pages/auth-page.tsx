import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
import { useAuth, loginSchema, LoginData } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * AuthPage Component
 * 
 * Handles user authentication with login and registration forms.
 * Redirects already authenticated users to the home page.
 */
export default function AuthPage() {
  // Get auth context
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  // Track which form is active
  const [isLogin, setIsLogin] = useState(true);
  
  // Setup form validation with react-hook-form and zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Handle form submission
  const onSubmit = async (data: LoginData) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  // Toggle between login and registration forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
  };

  // Redirect authenticated users to home page
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Auth Form Column */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || loginMutation.isPending || registerMutation.isPending}
                >
                  {(isSubmitting || loginMutation.isPending || registerMutation.isPending) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="ml-2 text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
                  >
                    {isLogin ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
            
            {/* Hero Content Column */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                FinBuddy
              </h1>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
                Your personal guide to understanding finances
              </p>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Learn key financial concepts
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Track your learning progress
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Test your knowledge with quizzes
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Understand real-world applications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}