import {
  Area,
  CartesianGrid,
  ComposedChart,
  Scatter,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  y: {
    label: "Y",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MainChart({
  dist,
  avg,
  diff,
  res,
}: {
  dist: string;
  avg: number;
  diff: number;
  res: number;
}) {
  // height of probability distribution at x
  const calcY = (x: number) => {
    if (dist === "norm") {
      const exponent = -Math.pow(x - avg, 2) / (2 * Math.pow(diff, 2));
      return (1 / (diff * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }
    // exclude right side to get correct behavior for stepAfter
    return avg - diff <= x && x < avg + diff ? 1 / (2 * diff) : 0;
  };

  const keypoints = [0, 2 * avg];
  if (dist === "norm") {
    // push sample points with resolution, within max sigma
    const sigma = 4;
    const resolution = 3;
    for (let i = 0; i < sigma * resolution; i++) {
      keypoints.push(
        avg - (diff / resolution) * i,
        avg + (diff / resolution) * i
      );
    }
  } else {
    // push turning points
    keypoints.push(avg - diff, avg + diff);
    // push a bit outside of the max for better visibility when max > 2 * avg
    keypoints.push(avg + 1.2 * diff);
  }
  keypoints.sort((a, b) => a - b);

  const chartData = keypoints
    .filter((x) => x >= 0)
    .map((x) => ({ x, y: calcY(x) }));

  const ticks = avg === 0 ? [0] : [0, avg, 2 * avg];
  const domain = [0, keypoints.at(-1)!];
  const lineType = dist === "norm" ? "monotone" : "stepAfter";

  return (
    <ChartContainer config={chartConfig}>
      <ComposedChart
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
          domain={domain}
          // 3 significant digits, remove trailing zeros
          tickFormatter={(value) =>
            value.toPrecision(3).replace(/(\.\d*[1-9])0+$|\.0*$/, "$1")
          }
        />
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-y)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-y)" stopOpacity={0.1} />
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
        <Scatter
          dataKey="Result"
          data={[{ x: res, Result: calcY(res) }]}
          fill="var(--color-y)"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
