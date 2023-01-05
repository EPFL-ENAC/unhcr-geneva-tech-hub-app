export function computeChangeInEmission(
  baseline: number,
  endline: number
): number {
  return (endline - baseline) / baseline;
}
