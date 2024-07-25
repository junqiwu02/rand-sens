"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { MainChart } from "@/app/main-chart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStats, random } from "@/app/api/route";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function MainForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [res, setRes] = useState("");
  const { toast } = useToast();

  const handleChange = (name: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const { dist, avg, diff } = getStats(searchParams);

  // height of probability distribution at x
  const calcY = (x: number) => {
    if (dist === "norm") {
      const exponent = -Math.pow(x - avg, 2) / (2 * Math.pow(diff, 2));
      return (1 / (diff * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }
    return avg - diff <= x && x <= avg + diff ? 1 / (2 * diff) : 0;
  };

  const keypoints = [0, 2 * avg];
  if (dist === "norm") {
    // push sample points with resolution, within max sigma
    const sigma = 5;
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
  }
  keypoints.sort((a, b) => a - b);

  const ticks = avg === 0 ? [0] : [0, avg, 2 * avg];
  // TODO need to fix unifrom chart data since step line steps at the midpoint and not the specific point.
  const chartData = keypoints.map((x) => {
    // clamp x to [0, 2 * avg]
    x = Math.min(Math.max(x, 0), 2 * avg);
    return { x, y: calcY(x) };
  });

  // const res = random(dist, avg, diff);
  useEffect(() => {
    setRes(random(dist, avg, diff));
  }, [dist, avg, diff]);

  const handleCopy = () => {
    navigator.clipboard.writeText(res);
    toast({
      description: "📋 Copied to clipboard!",
    });
  };

  return (
    <>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label htmlFor="dist">Distribution</Label>
          <Select
            name="dist"
            defaultValue={dist}
            onValueChange={(value) => handleChange("dist", value)}
            required
          >
            <SelectTrigger id="dist">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="uni">Uniform</SelectItem>
                <SelectItem value="norm">Normal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <MainChart
          lineType={dist === "norm" ? "monotone" : "step"}
          chartData={chartData}
          ticks={ticks}
        />

        <div>
          <Label htmlFor="avg">Average Sens</Label>
          <Input
            id="avg"
            type="number"
            name="avg"
            defaultValue={avg}
            step={0.001}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
          />
          <Label htmlFor="diff">
            {dist === "norm" ? "Standard Deviation" : "Max Difference"}
          </Label>
          <Input
            id="diff"
            type="number"
            name="diff"
            defaultValue={diff}
            step={0.001}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="res">Result</Label>
          <div className="flex">
            <Input
              className="font-mono"
              id="res"
              name="res"
              readOnly
              value={res}
              onClick={handleCopy}
            />
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setRes(random(dist, avg, diff))}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Bookmark to get a new result on every visit!
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="link" className="p-0 text-muted-foreground" asChild>
          <Link href={`${pathname}api?${searchParams.toString()}`}>
            API Mode
          </Link>
        </Button>
      </CardFooter>
    </>
  );
}
