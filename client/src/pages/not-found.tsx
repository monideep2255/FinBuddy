import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-neutral-950">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 gap-2 text-center sm:text-left">
              <AlertCircle className="h-12 w-12 sm:h-8 sm:w-8 text-red-500 dark:text-red-400 mb-2 sm:mb-0" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">404 Page Not Found</h1>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  The page you were looking for doesn't exist or has been moved.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center sm:justify-start">
              <Link href="/">
                <div className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  Return to Home
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
