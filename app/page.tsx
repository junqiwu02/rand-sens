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

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleChange = (name: string, value: string) => {
    params.set(name, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const dist = params.get("dist") || "uni";
  const diff = parseFloat(params.get("diff") || "0.5");
  const avg = parseFloat(params.get("avg") || "0.5");

  const chartData: any[] = [];
  for (let i = 0; i < 2 * avg; i += 0.05 * avg) {
    let prob = 0;
    if (dist === "norm") {
      // Calculate the height of the normal distribution at point i
      const exponent = -Math.pow(i - avg, 2) / (2 * Math.pow(diff, 2));
      prob = (1 / (diff * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    } else {
      if (avg - diff <= i && i <= avg + diff) {
        prob = 1 / (2 * diff);
      } else {
        prob = 0;
      }
    }

    chartData.push({
      sens: i,
      prob: prob,
    });
  }

  // TODO: decouple animations from default values
  // Since clearing an input resets the input value to the default value

  return (
    <>
      <nav className="flex items-center justify-between p-8">
        <Link href="/">🎯</Link>
        <Link href="https://github.com/junqiwu02/rand-sens">⭐ on GitHub</Link>
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
                value={dist}
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

            <MainChart lineType={dist === "norm" ? "monotone" : "step"} chartData={chartData} />

            <div>
              <Label htmlFor="avg">Average Sens</Label>
              <Input
                id="avg"
                type="number"
                name="avg"
                value={avg}
                step={0.001}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
              <Label htmlFor="diff">Max Difference</Label>
              <Input
                id="diff"
                type="number"
                name="diff"
                value={diff}
                step={0.001}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="res">Result</Label>
              <Input id="res" name="res" readOnly />
              <p className="text-xs text-muted-foreground">
                Bookmark to get a new result on every visit!
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button variant="link" className="p-0 text-muted-foreground">
              Bare-bones Mode
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
