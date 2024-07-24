"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  prob: {
    label: "Prob",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MainChart({ lineType, chartData }: { lineType: "step" | "monotone", chartData: any[] }) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          type="number"
          dataKey="sens"
          tickLine={false}
          axisLine={false}
          tickCount={3}
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => value.toFixed(1)}
        />
        <defs>
          <linearGradient id="fillProb" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-prob)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-prob)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="prob"
          type={lineType}
          fill="url(#fillProb)"
          fillOpacity={0.4}
          stroke="var(--color-prob)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
