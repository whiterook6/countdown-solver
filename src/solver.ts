import { operations } from './operations';
import { Step } from './types';

export const _solve_numbers = (
  numbers: number[],
  target: number,
  stopEarly: boolean = true
): Step => {
  const wasGenerated: boolean[] = Array(numbers.length).fill(false);
  const alreadyUsed: boolean[] = Array(numbers.length).fill(false);
  let bestResult: Step = [0, false] as Step;
  let bestLowCost: number = Number.MAX_SAFE_INTEGER;

  const _recurse_solve_numbers = (
    _numbers: Step[],
    previousI: number = 0,
    depth: number = 0, // abort if too deep
    currentCostOfAllSteps: number = 0
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

          const {op, cost: opCost} = operation;
          const result = operation.apply(left[0], right[0]);
          const resultWithOperation: Step = [result, op, left, right];

          // calculate the cost of the operation
          let stepCost = Math.abs(result);
          if ((left[0] === 10 || right[0] === 10) && operation.op === '*') {
            stepCost = opCost;
          } else {
            while (stepCost % 10 === 0 && stepCost > 0) {
              stepCost /= 10;
            }
            stepCost *= opCost;
          }

          const distanceFromTarget = Math.abs(result - target);
          if (distanceFromTarget === 0 && stopEarly) {
            bestResult = resultWithOperation;
            bestLowCost = currentCostOfAllSteps + stepCost;
            return;
          }

          const totalCost = currentCostOfAllSteps + stepCost;
          const bestDistanceFromTarget = Math.abs(bestResult[0] - target);
          if (
            (distanceFromTarget < bestDistanceFromTarget) ||
            (distanceFromTarget === bestDistanceFromTarget && totalCost < bestLowCost)
          ) {
            bestResult = resultWithOperation;
            bestLowCost = totalCost;
          }

          _numbers[j] = resultWithOperation;
          const wasGeneratedJTemp = wasGenerated[j];
          wasGenerated[j] = true;

          if (depth < _numbers.length - 1 && (bestResult[0] !== target || totalCost < bestLowCost)) {
            _recurse_solve_numbers(_numbers, i + 1, depth + 1, totalCost);
          }

          wasGenerated[j] = wasGeneratedJTemp;
          _numbers[j] = right;
        }
      }

      alreadyUsed[i] = false;
    }
  };

  _recurse_solve_numbers(numbers.map(x => [x, false]));

  return bestResult;
}