
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  return (
    <div className="container px-2 sm:px-4 md:px-6 py-4 sm:py-6 max-w-4xl mx-auto min-h-[calc(100vh-250px)]">
      <Card className="flex flex-col shadow-lg h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden bg-background">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2 text-foreground font-semibold">
            <Info className="h-5 w-5" />
            Ask Me Anything
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
