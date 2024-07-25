export default function Bare({ searchParams }: { searchParams: any }) {
  const params = new URLSearchParams(searchParams);
  const dist = params.get("dist") || "uni";
  const avg = parseFloat(params.get("avg") || "1");
  const diff = parseFloat(params.get("diff") || "0.5");

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

  let res = dist === "norm" ? normalRandom() : uniformRandom();

  return (
    <>
      <pre className="text-mono text-sm p-2">{res.toFixed(3)}</pre>
    </>
  );
}
