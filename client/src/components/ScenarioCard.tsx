import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { Scenario } from '@shared/schema';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
}

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  const [_, setLocation] = useLocation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation(`/scenarios/${scenario.id}`);
    }
  };
  
  // Parse details to ensure type safety
  const details = typeof scenario.details === 'string' 
    ? JSON.parse(scenario.details) 
    : scenario.details;
    
  const change = details?.change || {
    type: 'unknown',
    value: 0,
    direction: 'unknown',
    magnitude: 'unknown'
  };
  
  const timeframe = details?.timeframe || 'unknown';
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md hover:bg-background hover:brightness-105 dark:hover:brightness-125 transition-all duration-300 bg-background dark:bg-card border border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground">{scenario.title}</CardTitle>
          <Badge variant="outline" className="ml-2 text-foreground">{scenario.category}</Badge>
        </div>
        <CardDescription className="line-clamp-3 text-muted-foreground">{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground font-medium">Type:</span>
            <span className="text-foreground font-semibold">{change.type.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground font-medium">Value:</span>
            <span className="text-foreground font-semibold">
              {change.value}{change.type === 'interest_rate' ? '%' : ''}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground font-medium">Direction:</span>
            <span className="text-foreground font-semibold capitalize">{change.direction}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Timeframe:</span>
            <span className="text-foreground font-semibold capitalize">{timeframe}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="default" className="w-full" onClick={handleClick}>
          Explore Impacts
        </Button>
      </CardFooter>
    </Card>
  );
}