import { operations } from './operations';
import { Step } from './types';

export const _solve_numbers = (
  numbers: number[],
  target: number
): Step => {
  const mappedNumbers = numbers.map(x => [x, false]);
  const wasGenerated = Array(numbers.length).fill(false);
  const alreadyUsed = Array(numbers.length).fill(false);
  let bestValueSums: number = Number.MAX_SAFE_INTEGER;
  let bestResult: Step = [0, false] as Step;

  const _recurse_solve_numbers = (
    _numbers,
    previousI: number = 0,
    depth: number = 0, // abort if too deep
    valueSums: number = 0
  ) => {
    if (depth >= _numbers.length){
      return;
    }

    for (let i = 0; i < _numbers.length - 1; i++) {
      if (alreadyUsed[i]) {
        continue;
      }
      alreadyUsed[i] = true;
      const left = _numbers[i];

      for (let j = i + 1; j < _numbers.length; j++) {
        if (alreadyUsed[j]) {
          continue;
        }
        const right = _numbers[j];

        if (i < previousI && !wasGenerated[i] && !wasGenerated[j]) {
          continue;
        }

        for (const operation of operations) {
          if (!operation.check(left[0], right[0])) {
            continue;
          }

          const {op, cost} = operation;
          const result = operation.apply(left[0], right[0]);
          const resultWithOperation = [result, op, left, right];

          // calculate the cost of the operation
          let opCost = Math.abs(result);
          if ((left[0] === 10 || right[0] === 10) && operation.op === '*') {
            opCost = cost;
          } else {
            while (opCost % 10 === 0 && opCost > 0) {
              opCost /= 10;
            }
            opCost *= cost;
          }

          const totalCost = valueSums + opCost;
          if (
            Math.abs(result - target) < Math.abs(bestResult[0] - target) ||
            (
              Math.abs(result - target) === Math.abs(bestResult[0] - target) &&
              (totalCost < bestValueSums)
            )
          ) {
            bestResult = resultWithOperation as Step;
            bestValueSums = totalCost;
          }

          _numbers[j] = resultWithOperation;
          const wasGeneratedJTemp = wasGenerated[j];
          wasGenerated[j] = true;

          if (depth < _numbers.length - 1 && (bestResult[0] !== target || totalCost < bestValueSums)) {
            _recurse_solve_numbers(_numbers, i + 1, depth + 1, totalCost);
          }

          wasGenerated[j] = wasGeneratedJTemp;
          _numbers[j] = right;
        }
      }

      alreadyUsed[i] = false;
    }
  };

  _recurse_solve_numbers(mappedNumbers);

  return bestResult;
}