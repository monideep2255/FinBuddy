import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScenarioCard } from '@/components/ScenarioCard';
import { Scenario } from '@shared/schema';

export default function ScenariosPage() {
  const {
    data: scenarios,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/api/scenarios'],
    retry: 1,
  });

  // Convert scenarios data to an array
  const scenariosArray = Array.isArray(scenarios) ? scenarios : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6">
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Scenario Playground</h1>
              <p className="text-muted-foreground mt-1">
                Explore how different economic scenarios affect markets and investments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Scenarios
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load scenarios</p>
                    <Button onClick={() => refetch()}>Try Again</Button>
                  </div>
                </CardContent>
              </Card>
            ) : scenariosArray.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    No predefined scenarios available
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenariosArray.map((scenario: Scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onClick={() => console.log("Selected scenario:", scenario.title)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}