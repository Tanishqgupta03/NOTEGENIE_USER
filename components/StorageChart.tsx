"use client";

import { Progress } from "@/components/ui/progress";

interface StorageChartProps {
  used: number;  // in MB
  total: number; // in MB
}

export function StorageChart({ used, total }: StorageChartProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const formattedPercentage = percentage.toFixed(1);
  
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Storage Used</span>
        <span className="text-sm text-muted-foreground">{formattedPercentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>{used} MB</span>
        <span>{total} MB</span>
      </div>
    </div>
  );
}