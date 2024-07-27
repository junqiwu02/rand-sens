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
import { MainChart } from "@/app/main-chart";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStats, random } from "@/app/api/lib";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function MainForm() {
  const searchParams = useSearchParams();
  const [res, setRes] = useState(0);
  const { toast } = useToast();

  const handleChange = (name: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    // use native API to avoid re-rendering server components
    window.history.replaceState(null, "", `/?${newSearchParams.toString()}`);
  };

  const { dist, avg, diff } = getStats(searchParams);

  useEffect(() => {
    setRes(random(dist, avg, diff));
  }, [dist, avg, diff]);

  const handleCopy = () => {
    navigator.clipboard.writeText(res.toFixed(3));
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

        <div onClick={handleCopy}>
          <MainChart dist={dist} avg={avg} diff={diff} res={res} />
        </div>

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
          <Label htmlFor="res">😎 Result</Label>
          <div className="flex">
            <Input
              className="font-mono"
              id="res"
              name="res"
              readOnly
              value={res.toFixed(3)}
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
            Bookmark for a new result on every visit.
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="link" className="p-0 text-muted-foreground" asChild>
          <a href={`/api?${searchParams.toString()}`}>API Mode</a>
        </Button>
      </CardFooter>
    </>
  );
}
