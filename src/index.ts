import { createInterface } from 'node:readline/promises';
import { stringifyStepAndChildren, stringifyStep, tidyUpStep } from './results';
import { _solve_numbers } from './solver';
import { stdin, stdout } from 'process';
import { parseOperands, parseTarget } from './input';


function solve_numbers(numbers, target, stopEarly = true) {
  const results = _solve_numbers(numbers, target, stopEarly);
  const tidiedResults = tidyUpStep(results);
  const serialisedResults = stringifyStepAndChildren(tidiedResults);
  const stringifiedResults = stringifyStep(serialisedResults, target);
  return stringifiedResults.join("\n");
}

const readline = createInterface(stdin, stdout);

const run = async () => {
  while (true){
    let operands = [];
    while (operands.length < 1){
      try {
        const operandsResponse = await readline.question("Enter a list of 2 to 6 integers between 1 and 100, separated by commas or spaces: ");
        operands = parseOperands(operandsResponse);
      } catch (err) {
        console.log(err.message);
      }
    }

    let target = 0;
    while (!target) {
      try {
        const targetResponse = await readline.question("Enter a target integer between 100 and 999: ");
        target = parseTarget(targetResponse);
      } catch (err) {
        console.log(err.message);
      }
    }
    console.log(solve_numbers(operands, target));
  }
}

run().then(() => {
  process.exit(0);
}).catch(err => {
  console.error("An error occurred:", err);
  process.exit(1);
})