import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
import { useAuth, loginSchema, LoginData } from "@/hooks/use-auth";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

/**
 * AuthPage Component
 * 
 * Handles user authentication with login and registration forms.
 * Redirects already authenticated users to the home page.
 * Fully responsive and handles dark mode correctly.
 */
export default function AuthPage() {
  // Get auth context
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // Track which form is active
  const [isLogin, setIsLogin] = useState(true);
  
  // Show success toast when login or registration succeeds
  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${loginMutation.data?.username}!`,
      });
    }
    
    if (registerMutation.isSuccess) {
      toast({
        title: "Registration successful",
        description: `Welcome, ${registerMutation.data?.username}!`,
      });
    }
  }, [loginMutation.isSuccess, registerMutation.isSuccess, toast]);
  
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
      
      <main className="flex-grow flex items-center py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Auth Form Column */}
            <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm order-2 md:order-1">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-neutral-800 dark:text-neutral-200">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.username.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-800 dark:text-neutral-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
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

                {/* Error message if login/register fails */}
                {(loginMutation.isError || registerMutation.isError) && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm mt-4">
                    {isLogin 
                      ? "Login failed. Please check your username and password." 
                      : "Registration failed. Username may already be taken."}
                  </div>
                )}
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
            <div className="text-center md:text-left order-1 md:order-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-md mx-auto md:mx-0 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                FinBuddy
              </h1>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                Your personal guide to understanding finances
              </p>
              
              <div className="max-w-md mx-auto md:mx-0">
                <ul className="space-y-4 text-neutral-600 dark:text-neutral-400 text-left">
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-1 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Learn key financial concepts through easy-to-understand explanations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-1 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Track your learning progress and build your financial knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-1 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Test your understanding with interactive quizzes on each topic</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/50 p-1 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>See how financial concepts apply in real-world situations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}