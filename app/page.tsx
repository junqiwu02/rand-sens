"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "next/navigation";

export default function Home({ searchParams }: { searchParams: any }) {
  const router = useRouter();

  const test = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(formData as any);
    router.push(`?${params.toString()}`);
  };

  console.log(JSON.stringify(searchParams, null, 2));

  // TODO: parallel routes to display the result

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
          <form onSubmit={test}>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label htmlFor="dist">Distribution</Label>
                <Select name="dist" defaultValue="uni" required>
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

              <MainChart />

              <div>
                <Label htmlFor="avg">Average Sens</Label>
                <Input
                  id="avg"
                  type="number"
                  name="avg"
                  defaultValue="0.5"
                  step={0.001}
                  required
                />
                <Label htmlFor="diff">Max Difference</Label>
                <Input
                  id="diff"
                  type="number"
                  name="diff"
                  defaultValue="0.5"
                  step={0.001}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox name="bare" id="bare" />
                <Label htmlFor="bare">Bare-bones Result</Label>
              </div>
            </CardContent>

            <CardFooter>
              <Button>Generate</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
}
