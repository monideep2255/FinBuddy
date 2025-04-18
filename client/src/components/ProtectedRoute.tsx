import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType<any>;
};

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that should only be accessible to authenticated users.
 * Redirects to the login page if the user is not authenticated.
 * Shows a loading spinner while checking authentication status.
 * 
 * @param {string} path - The route path
 * @param {Component} component - The component to render when authenticated
 */
export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Render the protected component if authenticated
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}