function uniformRandom(avg, diff) {
  const max = avg + diff;
  const min = avg - diff;
  return Math.random() * (max - min) + min;
}

// from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean, stdev) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function main() {
  document.getElementById("uni").addEventListener("change", function () {
    document.getElementById("diff-label").textContent = "Max Difference";
  });
  document.getElementById("norm").addEventListener("change", function () {
    document.getElementById("diff-label").textContent = "Standard Deviation";
  });

  if (!window.location.search) {
    return;
  }
  const params = new URLSearchParams(window.location.search);

  const avg = parseFloat(params.get("avg"));
  const diff = parseFloat(params.get("diff"));
  const sens = (
    params.get("dist") === "uni"
      ? uniformRandom(avg, diff)
      : gaussianRandom(avg, diff)
  ).toFixed(3);

  const res = document.getElementById("res");
  res.textContent = sens;

  if (params.get("bare")) {
    // replace everything with result
    document.body.innerHTML = "";
    document.body.appendChild(res);
    return;
  }

  // populate form
  document.getElementById("uni").checked = params.get("dist") === "uni";
  document.getElementById("norm").checked = params.get("dist") === "norm";
  document.getElementById("avg").value = avg;
  document.getElementById("diff").value = diff;

  document.getElementById("diff-label").textContent =
    params.get("dist") === "uni" ? "Max Difference" : "Standard Deviation";
}

document.addEventListener("DOMContentLoaded", main);
