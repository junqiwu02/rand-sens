export function getStats(params: URLSearchParams) {
  const dist = params.get("dist") || "uni";
  const avg = parseFloat(params.get("avg") || "1");
  const diff = Math.abs(parseFloat(params.get("diff") || "0.5"));

  return { dist, avg, diff };
}

export function random(dist: string, avg: number, diff: number) {
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
  return Math.max(res, 0);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { dist, avg, diff } = getStats(searchParams);

  return new Response(random(dist, avg, diff).toFixed(3));
}
