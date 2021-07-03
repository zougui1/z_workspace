export const parsePercentage = (percentage: string): number => {
  return +percentage.slice(0, -1);
}

export const fromPercent = (percentage: number, denominator: number): number => {
  return denominator * (percentage / 100);
}

export const applyPercentage = (percentage: string, denominator: number): number => {
  return fromPercent(parsePercentage(percentage), denominator);
}
