export const parseOperands = (operands: string): number[] => {
  const splitOperands = operands.split(/[,\s]+/);
  const validOperands = splitOperands.map(n => parseInt(n.trim(), 10))
    .filter(n => !isNaN(n) && n >= 1 && n <= 100);
  if (validOperands.length < 2 || validOperands.length > 6) {
    throw new Error(`Operands must be a list of 2 to 6 integers between 1 and 100. Got ${JSON.stringify(splitOperands)}.`);
  }
  return validOperands;
}

export const parseTarget = (target: string): number => {
  const parsed = parseInt(target.trim(), 10);
  if (isNaN(parsed) || parsed < 100 || parsed > 999) {
    throw new Error("Target must be an integer between 100 and 999.");
  }
  return parsed;
}
