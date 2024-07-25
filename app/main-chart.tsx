"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  y: {
    label: "Y",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MainChart({ lineType, chartData, ticks }: { lineType: "step" | "monotone", chartData: any[], ticks: number[] }) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 8,
          right: 8,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          type="number"
          dataKey="x"
          tickLine={false}
          axisLine={false}
          ticks={ticks}
          domain={["dataMin", "dataMax"]}
          // 3 significant digits, remove trailing zeros
          tickFormatter={(value) => value.toPrecision(3).replace(/(\.\d*[1-9])0+$|\.0*$/, '$1')}
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-y)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-y)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="y"
          type={lineType}
          fill="url(#grad)"
          fillOpacity={0.4}
          stroke="var(--color-y)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
