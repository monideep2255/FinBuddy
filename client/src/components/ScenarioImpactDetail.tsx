import React from 'react';
import { ScenarioImpact } from '@shared/schema';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ScenarioImpactDetailProps {
  impacts: ScenarioImpact;
}

export function ScenarioImpactDetail({ impacts }: ScenarioImpactDetailProps) {
  const impactColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const impactText = (value: number) => {
    const formatted = Math.abs(value).toFixed(1);
    if (value > 0) return `+${formatted}`;
    if (value < 0) return `-${formatted}`;
    return formatted;
  };

  const renderSectorTable = (sectors: Record<string, { impact: number; reason: string }>) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sector</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(sectors).map(([sector, data]) => (
            <TableRow key={sector}>
              <TableCell className="font-medium">{sector}</TableCell>
              <TableCell className={impactColor(data.impact)}>
                {impactText(data.impact)}
              </TableCell>
              <TableCell className="hidden md:table-cell">{data.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderBondsTable = (types: Record<string, { impact: number; reason: string }>) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bond Type</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead className="hidden md:table-cell">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(types).map(([type, data]) => (
            <TableRow key={type}>
              <TableCell className="font-medium">{type}</TableCell>
              <TableCell className={impactColor(data.impact)}>
                {impactText(data.impact)}
              </TableCell>
              <TableCell className="hidden md:table-cell">{data.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of market and economic impacts
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base">
          <p className="mb-4">{impacts.analysis}</p>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Key Learning Points:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {impacts.learningPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="stocks">
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
              <span>Stock Markets</span>
              <span className={impactColor(impacts.markets.stocks.overall)}>
                {impactText(impacts.markets.stocks.overall)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <p className="mb-4">{impacts.markets.stocks.description}</p>
              {renderSectorTable(impacts.markets.stocks.sectors)}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bonds">
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
              <span>Bond Markets</span>
              <span className={impactColor(impacts.markets.bonds.overall)}>
                {impactText(impacts.markets.bonds.overall)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <p className="mb-4">{impacts.markets.bonds.description}</p>
              {renderBondsTable(impacts.markets.bonds.types)}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="commodities">
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
              <span>Commodities</span>
              <span>
                <span className={impactColor(impacts.markets.commodities.gold)}>
                  Gold: {impactText(impacts.markets.commodities.gold)}
                </span>
                <span className="mx-2">|</span>
                <span className={impactColor(impacts.markets.commodities.oil)}>
                  Oil: {impactText(impacts.markets.commodities.oil)}
                </span>
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <p>{impacts.markets.commodities.description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="economy">
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
              <span>Economic Indicators</span>
              <span>
                <span className={impactColor(impacts.markets.economy.gdp)}>
                  GDP: {impactText(impacts.markets.economy.gdp)}
                </span>
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-2">
              <p className="mb-4">{impacts.markets.economy.description}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Employment</TableCell>
                    <TableCell className={impactColor(impacts.markets.economy.employment)}>
                      {impactText(impacts.markets.economy.employment)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inflation</TableCell>
                    <TableCell className={impactColor(impacts.markets.economy.inflation)}>
                      {impactText(impacts.markets.economy.inflation)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GDP</TableCell>
                    <TableCell className={impactColor(impacts.markets.economy.gdp)}>
                      {impactText(impacts.markets.economy.gdp)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}