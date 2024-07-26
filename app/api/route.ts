import { getStats, random } from "@/app/api/lib";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { dist, avg, diff } = getStats(searchParams);

  return new Response(random(dist, avg, diff).toFixed(3));
}

export const runtime = "edge";