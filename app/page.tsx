import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import MainForm from "@/app/main-form";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <nav className="flex items-center justify-between p-8">
      </nav>
      <main className="flex flex-col items-center justify-between p-10 pt-0">
        <Card className="w-[400px] max-w-[100%]">
          <CardHeader>
            🎯 rand-sens
            <CardDescription>Get a random sensitivity!</CardDescription>
          </CardHeader>

          <Suspense>
            <MainForm />
          </Suspense>
        </Card>
      </main>
    </>
  );
}
