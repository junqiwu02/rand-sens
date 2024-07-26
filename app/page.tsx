import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import MainForm from "@/app/main-form";

export default function Home() {
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
      <main className="flex flex-col items-center justify-between p-10 pt-0">
        <Card className="w-[400px] max-w-[100%]">
          <CardHeader>
            🎯 rand-sens
            <CardDescription>Get a random sensivity!</CardDescription>
          </CardHeader>

          <MainForm />
        </Card>
      </main>
    </>
  );
}
