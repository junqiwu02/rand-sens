"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { MainChart } from "./main-chart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReducer } from "react";
import { getStats, random } from "./api/route";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

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
      keypoints.push(avg - diff / resolution * i, avg + diff / resolution * i);
    }
  } else {
    // push turning points
    keypoints.push(avg - diff, avg + diff);
  }
  keypoints.sort((a, b) => a - b);

  const ticks = avg === 0 ? [0] : [0, avg, 2 * avg];
  const chartData = keypoints.map((x) => {
    // clamp x to [0, 2 * avg]
    x = Math.min(Math.max(x, 0), 2 * avg);
    return { x, y: calcY(x) };
  });

  const res = random(dist, avg, diff);

  return (
    <>
      <nav className="flex items-center justify-between p-8">
        <Button variant="link" className="p-0" asChild>
          <a href="/">🎯</a>
        </Button>
        <Button variant="link" className="p-0" asChild>
          <a
            href="https://github.com/junqiwu02/rand-sens"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⭐ on GitHub
          </a>
        </Button>
      </nav>
      <main className="flex flex-col items-center justify-between px-10">
        <Card className="w-[400px] max-w-[100%]">
          <CardHeader>
            🎯 rand-sens
            <CardDescription>Get a random sensivity!</CardDescription>
          </CardHeader>
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
                />
                {/* TODO: Add a button to copy the result to clipboard */}
                <Button
                  variant="ghost"
                  className="p-2"
                  onClick={forceUpdate}
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
            <Button
              variant="link"
              className="p-0 text-muted-foreground"
              asChild
            >
              <Link href={`${pathname}api?${searchParams.toString()}`}>
                API Mode
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
