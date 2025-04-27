import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { apiRequest } from '@/lib/queryClient';

// Form schema
const customScenarioSchema = z.object({
  scenarioType: z.string().min(1, { message: 'Please select a scenario type' }),
  value: z.number().min(0.1).max(20),
  direction: z.string().min(1, { message: 'Please select a direction' }),
  customDetails: z.string().optional(),
});

type CustomScenarioFormValues = z.infer<typeof customScenarioSchema>;

interface CustomScenarioFormProps {
  onAnalyzeSuccess: (data: any) => void;
  onAnalyzeStart?: () => void;
}

export function CustomScenarioForm({ onAnalyzeSuccess, onAnalyzeStart }: CustomScenarioFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: CustomScenarioFormValues = {
    scenarioType: '',
    value: 1.0,
    direction: '',
    customDetails: '',
  };

  const form = useForm<CustomScenarioFormValues>({
    resolver: zodResolver(customScenarioSchema),
    defaultValues,
  });

  const onSubmit = async (data: CustomScenarioFormValues) => {
    setIsLoading(true);
    if (onAnalyzeStart) onAnalyzeStart();
    
    try {
      const response = await apiRequest('/api/scenarios/analyze', {
        method: 'POST',
        data,
      });
      
      onAnalyzeSuccess(response);
    } catch (error) {
      console.error('Error analyzing scenario:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze the scenario. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Scenario</CardTitle>
        <CardDescription>
          Define your own economic scenario to analyze its market impacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="scenarioType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a scenario type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="interest_rate">Interest Rate Change</SelectItem>
                      <SelectItem value="inflation">Inflation Rate Change</SelectItem>
                      <SelectItem value="tariff">Tariff Policy Change</SelectItem>
                      <SelectItem value="tax">Tax Policy Change</SelectItem>
                      <SelectItem value="fiscal_stimulus">Fiscal Stimulus</SelectItem>
                      <SelectItem value="currency">Currency Value Change</SelectItem>
                      <SelectItem value="oil_price">Oil Price Change</SelectItem>
                      <SelectItem value="housing_market">Housing Market Change</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of economic change to simulate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={20}
                      step={0.1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The magnitude of the change (0.1 to 20)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Whether the value is increasing or decreasing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more context about this scenario..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide additional context to help with the analysis
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze Scenario'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}