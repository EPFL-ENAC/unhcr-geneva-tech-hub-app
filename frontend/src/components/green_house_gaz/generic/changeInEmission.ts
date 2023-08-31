export function computeChangeInEmission(
  baseline: number,
  endline: number,
  ratio = 1
): number {
  const result = (endline - baseline * ratio) / baseline;
  // we are only interested in 6 digits after the decimal point to avoid weird behavior with minitessimal numbers
  return parseFloat(result.toFixed(6));
}
