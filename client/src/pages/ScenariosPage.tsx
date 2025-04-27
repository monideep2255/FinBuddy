import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioCard } from '@/components/ScenarioCard';
import { CustomScenarioForm } from '@/components/CustomScenarioForm';
import { ScenarioImpactChart } from '@/components/ScenarioImpactChart';
import { ScenarioImpactDetail } from '@/components/ScenarioImpactDetail';
import { Scenario, ScenarioDetails, ScenarioImpact } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, BookmarkPlus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ScenariosPage() {
  const { toast } = useToast();
  const { user } = useAuth();
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

  // Handle scenario selection
  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentAnalysis({
      details: scenario.details,
      impacts: scenario.impacts,
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

  // Content for the Explore tab
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

    if (!scenarios || scenarios.length === 0) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario: Scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onClick={() => handleScenarioSelect(scenario)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Playground</h1>
          <p className="text-muted-foreground mt-1">
            Explore how different economic scenarios affect markets and investments
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="explore">Explore Scenarios</TabsTrigger>
          <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
          {currentAnalysis && (
            <TabsTrigger value="analysis" className="col-span-2">
              Analysis Results
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Predefined Scenarios</h3>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Separator />
          {renderExploreContent()}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold mb-4">Create Your Scenario</h3>
              <CustomScenarioForm onAnalyzeSuccess={handleAnalysisResult} />
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Economic Scenario Analysis</CardTitle>
                  <CardDescription>
                    Understand how economic changes affect markets
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
          <TabsContent value="analysis" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedScenario
                    ? selectedScenario.title
                    : `Custom Scenario: ${currentAnalysis.details.change.type} ${
                        currentAnalysis.details.change.direction
                      } by ${currentAnalysis.details.change.value}`}
                </h3>
                <p className="text-muted-foreground">
                  {selectedScenario
                    ? selectedScenario.description
                    : currentAnalysis.details.change.rationale}
                </p>
              </div>
              <div className="flex gap-2">
                {user && selectedScenario && (
                  <Button variant="outline" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save Scenario
                  </Button>
                )}
                <Button variant="default" size="sm" onClick={handleResetAnalysis}>
                  View Other Scenarios
                </Button>
              </div>
            </div>
            <Separator />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ScenarioImpactChart impacts={currentAnalysis.impacts} />
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Scenario Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                        <dd className="mt-1 text-sm font-semibold">
                          {currentAnalysis.details.change.type.replace('_', ' ')}
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
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-muted-foreground">Timeframe</dt>
                        <dd className="mt-1 text-sm font-semibold capitalize">
                          {currentAnalysis.details.timeframe}
                        </dd>
                      </div>
                      <div className="col-span-2">
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
  );
}