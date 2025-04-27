import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ScenarioImpact } from '@shared/schema';

interface ImpactData {
  name: string;
  value: number;
  color: string;
}

interface ScenarioImpactChartProps {
  impacts: ScenarioImpact;
}

export function ScenarioImpactChart({ impacts }: ScenarioImpactChartProps) {
  // Prepare data for the chart
  const prepareChartData = (): ImpactData[] => {
    const data: ImpactData[] = [
      {
        name: 'Stocks',
        value: impacts.markets.stocks.overall,
        color: impacts.markets.stocks.overall >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'Bonds',
        value: impacts.markets.bonds.overall,
        color: impacts.markets.bonds.overall >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'Gold',
        value: impacts.markets.commodities.gold,
        color: impacts.markets.commodities.gold >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'Oil',
        value: impacts.markets.commodities.oil,
        color: impacts.markets.commodities.oil >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'Employment',
        value: impacts.markets.economy.employment,
        color: impacts.markets.economy.employment >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'Inflation',
        value: impacts.markets.economy.inflation,
        color: impacts.markets.economy.inflation >= 0 ? '#4ade80' : '#f87171',
      },
      {
        name: 'GDP',
        value: impacts.markets.economy.gdp,
        color: impacts.markets.economy.gdp >= 0 ? '#4ade80' : '#f87171',
      },
    ];

    return data;
  };

  const chartData = prepareChartData();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Market Impact Overview</CardTitle>
        <CardDescription>
          Impact scale: -10 (severe negative) to +10 (severe positive)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[-10, 10]}
                tickCount={11}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(1)}`,
                  'Impact Score',
                ]}
                labelFormatter={(name) => `${name}`}
              />
              <Bar
                dataKey="value"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
              >
                {chartData.map((entry, index) => (
                  <LabelList
                    key={`label-${index}`}
                    dataKey="value"
                    position="right"
                    formatter={(value) => Number(value).toFixed(1)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}