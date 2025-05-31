import { operations } from './operations';
import { Step } from './types';

export const _solve_numbers = (
  numbers: number[],
  target: number,
  stopEarly: boolean = false
): Step => {
  const wasGenerated: boolean[] = Array(numbers.length).fill(false);
  const alreadyUsed: boolean[] = Array(numbers.length).fill(false);
  let bestResult: Step = [0, false] as Step;
  let bestLowCost: number = Number.MAX_SAFE_INTEGER;

  const _recurse_solve_numbers = (
    steps: Step[],
    previousI: number = 0,
    depth: number = 0, // abort if too deep
    currentCostOfAllSteps: number = 0
  ) => {
    if (depth >= steps.length){
      return;
    }

    for (let i = 0; i < steps.length - 1; i++) {
      if (alreadyUsed[i]) {
        continue;
      }
      alreadyUsed[i] = true;
      const left: Step = steps[i];

      for (let j = i + 1; j < steps.length; j++) {
        if (alreadyUsed[j]) {
          continue;
        }
        const right: Step = steps[j];

        if (i < previousI && !wasGenerated[i] && !wasGenerated[j]) {
          continue;
        }

        for (const operation of operations) {
          if (!operation.check(left[0], right[0])) {
            continue;
          }

          const opCost = operation.cost;
          const result = operation.apply(left, right);

          // calculate the cost of the operation
          let stepCost = Math.abs(result[0]);
          if (left[0] === 100 || right[0] === 100) {
            stepCost = 100; // if one of the inputs is 100, the cost is 100
          } else {
            while (stepCost % 10 === 0 && stepCost > 0) {
              stepCost /= 10;
            }
          }
          stepCost *= opCost;

          const distanceFromTarget = Math.abs(result[0] - target);
          if (distanceFromTarget === 0 && stopEarly) {
            bestResult = result;
            bestLowCost = currentCostOfAllSteps + stepCost;
            return;
          }

          const totalCost = currentCostOfAllSteps + stepCost;
          const bestDistanceFromTarget = Math.abs(bestResult[0] - target);
          if (
            (distanceFromTarget < bestDistanceFromTarget) ||
            (distanceFromTarget === bestDistanceFromTarget && totalCost < bestLowCost)
          ) {
            bestResult = result;
            bestLowCost = totalCost;
          }

          steps[j] = result;
          const wasGeneratedJTemp = wasGenerated[j];
          wasGenerated[j] = true;

          if (depth < steps.length - 1 && (bestResult[0] !== target || totalCost < bestLowCost)) {
            _recurse_solve_numbers(steps, i + 1, depth + 1, totalCost);
          }

          wasGenerated[j] = wasGeneratedJTemp;
          steps[j] = right;
        }
      }

      alreadyUsed[i] = false;
    }
  };

  _recurse_solve_numbers(numbers.map(x => [x, false]));

  return bestResult;
}