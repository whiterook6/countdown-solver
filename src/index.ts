import { serialise_result, stringify_result, tidyup_result } from './results';
import { _solve_numbers } from './solver';


function solve_numbers(numbers, target, stopEarly = true) {
  if (target < 101 || target > 999 || !Number.isInteger(target)) {
    return "Target must be an integer between 101 and 999.";
  } else if (!Array.isArray(numbers) || numbers.length < 2 || numbers.length > 6) {
    return "Numbers must be an array of 2 to 6 integers.";
  } else if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 100)) {
    return "All numbers must be integers between 1 and 100.";
  }

  numbers.sort((a, b) => a - b);

  return stringify_result(
    serialise_result(
      tidyup_result(
        _solve_numbers(numbers, target, stopEarly)
      )
    ),
    target
  ).join("\n");
}

console.log(solve_numbers([50, 75, 5, 1, 6, 10], 542));