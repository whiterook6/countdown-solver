import { createInterface } from 'node:readline/promises';
import { stringifyStepAndChildren, stringifyStep, tidyUpStep } from './results';
import { _solve_numbers } from './solver';
import { stdin, stdout } from 'process';
import { parseOperands } from './input';


function solve_numbers(numbers, target, stopEarly = false) {
  if (target < 101 || target > 999 || !Number.isInteger(target)) {
    return "Target must be an integer between 101 and 999.";
  } else if (!Array.isArray(numbers) || numbers.length < 2 || numbers.length > 6) {
    return "Numbers must be a list of 2 to 6 integers.";
  } else if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 100)) {
    return "All numbers must be integers between 1 and 100.";
  }

  const results = _solve_numbers(numbers, target, stopEarly);
  const tidiedResults = tidyUpStep(results);
  const serialisedResults = stringifyStepAndChildren(tidiedResults);
  const stringifiedResults = stringifyStep(serialisedResults, target);
  return stringifiedResults.join("\n");
}

const readline = createInterface(stdin, stdout);

const run = async () => {
  while (true){
    let operands;
    let validOperands = false;
    while (!validOperands) {
      const operandsResponse = await readline.question("Enter 2 to 6 integers between 1 and 100, separated by commas: ");
      operands = parseOperands(operandsResponse);
      validOperands = Array.isArray(operands) && operands.length >= 2 && operands.length <= 6 && operands.every(n => Number.isInteger(n) && n >= 1 && n <= 100);
      if (!validOperands) {
        console.log(`Invalid integers. Got ${operandsResponse}. Please try again.`);
      }
    }

    let target;
    let validTarget = false;
    while (!validTarget) {
      const targetResponse = await readline.question("Enter a target integer between 101 and 999: ");
      target = parseInt(targetResponse, 10);
      validTarget = Number.isInteger(target) && target >= 101 && target <= 999;
      if (!validTarget) {
        console.log(`Invalid target. Got ${targetResponse}. Please try again.`);
      }
    }
    console.log(solve_numbers(operands, target, true));
  }
}

run().then(() => {
  process.exit(0);
}).catch(err => {
  console.error("An error occurred:", err);
  process.exit(1);
})