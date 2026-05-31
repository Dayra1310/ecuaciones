export function formatNum(n: number | undefined, maxDecimals: number = 6): string {
  if (n === undefined) return "";
  return Number(n.toFixed(maxDecimals)).toString();
}
