import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, BookmarkPlus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScenarioCard } from '@/components/ScenarioCard';
import { CustomScenarioForm } from '@/components/CustomScenarioForm';
import { ScenarioImpactChart } from '@/components/ScenarioImpactChart';
import { ScenarioImpactDetail } from '@/components/ScenarioImpactDetail';
import { Scenario, ScenarioDetails, ScenarioImpact } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';

export default function ScenariosPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    details: ScenarioDetails;
    impacts: ScenarioImpact;
  } | null>(null);

  // Fetch predefined scenarios
  const {
    data: scenarios,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['/api/scenarios'],
    retry: 1,
  });

  // Convert scenarios data to an array and deduplicate based on title
  const scenariosArray = Array.isArray(scenarios) 
    ? scenarios
        // Make sure we only include unique values by title
        .filter((s, index, self) => 
          index === self.findIndex(t => t.title === s.title)
        )
    : [];

  // Handle scenario selection
  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);

    // Parse details if needed
    const details = typeof scenario.details === 'string'
      ? JSON.parse(scenario.details as string)
      : scenario.details;

    // Parse impacts if needed
    const impacts = typeof scenario.impacts === 'string'
      ? JSON.parse(scenario.impacts as string)
      : scenario.impacts;

    setCurrentAnalysis({
      details: details as ScenarioDetails,
      impacts: impacts as ScenarioImpact,
    });
    setActiveTab('analysis');
  };

  // Handle custom scenario analysis result
  const handleAnalysisResult = (data: {
    details: ScenarioDetails;
    impacts: ScenarioImpact;
  }) => {
    setCurrentAnalysis(data);
    setSelectedScenario(null);
    setActiveTab('analysis');
  };

  // Reset analysis view
  const handleResetAnalysis = () => {
    setSelectedScenario(null);
    setCurrentAnalysis(null);
    setActiveTab('explore');
  };

  // Render explore content with pagination
  const renderExploreContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load scenarios</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (scenariosArray.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No predefined scenarios available
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {scenariosArray.slice(page * 3, (page + 1) * 3).map((scenario: Scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => handleScenarioSelect(scenario)}
            />
          ))}
        </div>
        {scenariosArray.length > 3 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {[...Array(Math.ceil(scenariosArray.length / 3))].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setPage(i)}
                      isActive={page === i}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => Math.min(Math.ceil(scenariosArray.length / 3) - 1, p + 1))}
                    className={page >= Math.ceil(scenariosArray.length / 3) - 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Scenario Playground</h1>
                <p className="text-muted-foreground mt-1">
                  Explore how different economic scenarios affect markets and investments
                </p>
              </div>
              
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
              <TabsList className="inline-flex w-full justify-center bg-muted/80 p-1.5 rounded-xl">
                <TabsTrigger 
                  value="explore" 
                  className="flex-1 px-8 py-3 rounded-lg font-medium text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-all shadow-sm"
                >
                  Explore Scenarios
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="flex-1 px-8 py-3 rounded-lg font-medium text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-all shadow-sm"
                >
                  Custom Scenario
                </TabsTrigger>
              </TabsList>

              <TabsContent value="explore" className="space-y-4">
                {renderExploreContent()}
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">Create Your Scenario</h3>
                    <CustomScenarioForm onAnalyzeSuccess={handleAnalysisResult} />
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                    <Card className="border bg-background dark:bg-card text-foreground">
                      <CardHeader className="bg-background dark:bg-card">
                        <CardTitle>Economic Scenario Analysis</CardTitle>
                        <CardDescription>
                          Understand how economic changes affect markets
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="bg-background dark:bg-card">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">What is a scenario?</h4>
                            <p className="text-muted-foreground">
                              An economic scenario is a hypothetical economic change, such as an interest rate hike, inflation spike, or tax policy change.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold">How does this work?</h4>
                            <p className="text-muted-foreground">
                              Our system analyzes scenarios based on historical data and economic principles to predict likely impacts across various markets and economic indicators.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold">How to interpret results?</h4>
                            <p className="text-muted-foreground">
                              Impact scores range from -10 (severe negative) to +10 (severe positive). The analysis provides detailed explanations for each market and sector.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Why use scenario analysis?</h4>
                            <p className="text-muted-foreground">
                              Scenario analysis helps investors prepare for potential market changes, understand economic relationships, and make more informed investment decisions.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {currentAnalysis && (
                <TabsContent value="analysis" className="space-y-4">
                  <div className="flex justify-end mb-2">
                    <Button variant="default" size="sm" onClick={handleResetAnalysis}>
                      View Other Scenarios
                    </Button>
                  </div>
                  <Separator className="my-2" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"> 
                    <div className="lg:col-span-5">
                      <ScenarioImpactChart impacts={currentAnalysis.impacts} />
                      <Card className="mt-4 border bg-background dark:bg-card text-foreground">
                        <CardHeader className="pb-2 bg-background dark:bg-card">
                          <CardTitle className="text-xl">Scenario Details</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-background dark:bg-card">
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 1 column on smaller screens */}
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                              <dd className="mt-1 text-sm font-semibold">
                                {currentAnalysis.details.change.type.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Value</dt>
                              <dd className="mt-1 text-sm font-semibold">
                                {currentAnalysis.details.change.value}
                                {currentAnalysis.details.change.type === 'interest_rate' && '%'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Direction</dt>
                              <dd className="mt-1 text-sm font-semibold capitalize">
                                {currentAnalysis.details.change.direction}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Magnitude</dt>
                              <dd className="mt-1 text-sm font-semibold capitalize">
                                {currentAnalysis.details.change.magnitude}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Timeframe</dt>
                              <dd className="mt-1 text-sm font-semibold capitalize">
                                {currentAnalysis.details.timeframe.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Rationale</dt>
                              <dd className="mt-1 text-sm">
                                {currentAnalysis.details.change.rationale}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="lg:col-span-7">
                      <ScenarioImpactDetail impacts={currentAnalysis.impacts} />
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}