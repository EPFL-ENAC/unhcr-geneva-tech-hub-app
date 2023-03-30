export function computeChangeInEmission(
  baseline: number,
  endline: number,
  ratioEndline = 1
): number {
  return (endline - baseline * ratioEndline) / baseline;
}
