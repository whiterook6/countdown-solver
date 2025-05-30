export const parseOperands = (operands: string): number[] => {
  if (!operands){
    return [];
  }

  const parts = operands.split(",");
  return parts.map(part => {
    return parseInt(part.trim(), 10);
  }).filter(n => !isNaN(n) && n >= 1 && n <= 100);
}

export const parseTarget = (target: string): number => {
  const parsed = parseInt(target.trim(), 10);
  if (isNaN(parsed) || parsed < 101 || parsed > 999) {
    throw new Error("Target must be an integer between 101 and 999.");
  }
  return parsed;
}
