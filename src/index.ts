import { createInterface } from 'node:readline/promises';
import { stringifyStepAndChildren, stringifyStep, tidyUpStep } from './results';
import { _solve_numbers } from './solver';
import { stdin, stdout } from 'process';
import { parseOperands } from './input';


function solve_numbers(numbers, target, stopEarly = true) {
  if (target < 101 || target > 999 || !Number.isInteger(target)) {
    return "Target must be an integer between 101 and 999.";
  } else if (!Array.isArray(numbers) || numbers.length < 2 || numbers.length > 6) {
    return "Numbers must be an array of 2 to 6 integers.";
  } else if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 100)) {
    return "All numbers must be integers between 1 and 100.";
  }

  numbers.sort((a, b) => a - b);
  const results = _solve_numbers(numbers, target, stopEarly);
  const tidiedResults = tidyUpStep(results);
  const serialisedResults = stringifyStepAndChildren(tidiedResults);
  const stringifiedResults = stringifyStep(serialisedResults, target);
  return stringifiedResults.join("\n");
}

const readline = createInterface(stdin, stdout);

const run = async () => {
  while (true){
    const operandsResponse = await readline.question("Enter 2 to 6 integers between 1 and 100, separated by commas: ");
    const operands = parseOperands(operandsResponse);
    const targetResponse = await readline.question("Enter a target integer between 101 and 999: ");
    const target = parseInt(targetResponse, 10);
  
    console.log(solve_numbers(operands, target, true));
  }
}

run().then(() => {
  process.exit(0);
}).catch(err => {
  console.error("An error occurred:", err);
  process.exit(1);
})