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

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleChange = (name: string, value: string) => {
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const dist = params.get("dist") || "uni";
  const avg = parseFloat(params.get("avg") || "1");
  const diff = parseFloat(params.get("diff") || "0.5");

  const chartData = [];
  const step = avg === 0 ? 0.05 : 0.05 * avg;
  for (let i = 0; i <= 2 * avg; i += step) {
    let prob = 0;
    if (dist === "norm") {
      // Calculate the height of the normal distribution at point i
      const exponent = -Math.pow(i - avg, 2) / (2 * Math.pow(diff, 2));
      prob = (1 / (diff * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    } else if (avg - diff <= i && i <= avg + diff) {
      prob = 1 / (2 * diff);
    }

    chartData.push({
      sens: i,
      prob: prob,
    });
  }

  const uniformRandom = () => {
    const max = avg + diff;
    const min = avg - diff;
    return Math.random() * (max - min) + min;
  };
  const normalRandom = () => {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * diff + avg;
  };

  const res = dist === "norm" ? normalRandom() : uniformRandom();

  return (
    <>
      <nav className="flex items-center justify-between p-8">
        <a href="/">🎯</a>
        <a
          href="https://github.com/junqiwu02/rand-sens"
          target="_blank"
          rel="noreferrer"
        >
          ⭐ on GitHub
        </a>
      </nav>
      <main className="flex flex-col items-center justify-between px-24">
        <Card>
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
              <div className="flex gap-2">
                <Input
                  className="font-mono"
                  id="res"
                  name="res"
                  readOnly
                  value={res.toFixed(3)}
                />
                {/* TODO: Add a button to copy the result to clipboard */}
                <Button
                  variant="link"
                  className="text-xl p-0"
                  onClick={forceUpdate}
                >
                  🔃
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
              <Link href={`${pathname}bare?${params.toString()}`}>
                Bare-bones Mode
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
