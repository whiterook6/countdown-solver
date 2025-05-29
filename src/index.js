let bestValueSums;
let bestResult;

const Operations = [{
  op: "+",
  check: (n1, n2) => n1 > 0 && n2 > 0, // no sense in adding zero or negative numbers
  apply: (n1, n2) => n1 + n2,
  cost: 1
}, {
  op: "-",
  check: (n1, n2) => n1 > n2 && n2 > 0, // no sense in subtracting zero or negative numbers
  apply: (n1, n2) => n1 - n2,
  cost: 1.05
}, {
  op: "_", // also subtract, but backwards for when left is smaller than right
  check: (n2, n1) => n1 > n2 && n2 > 0,
  apply: (n2, n1) => n1 - n2,
  cost: 1.05
}, {
  op: "*",
  check: (n1, n2) => n1 > 1 && n2 > 1, // no sense in multiplying by zero or one
  apply: (n1, n2) => n1 * n2,
  cost: 1.2
}, {
  op: "/",
  check: (n1, n2) => n2 > 1 && n1 % n2 === 0, // no sense in dividing by zero or one, and only whole numbers
  apply: (n1, n2) => n1 / n2,
  cost: 1.3
}, {
  op: "?", // also divide, but backwards for when left is smaller than right
  check: (n2, n1) => n2 > 1 && n1 % n2 === 0,
  apply: (n2, n1) => n1 / n2,
  cost: 1.3
}];

const ALREADY_USED = -1;
const _recurse_solve_numbers = (
  numbers,
  alreadyUsed,
  previousI,
  wasGenerated,
  target,
  levels,
  valueSums
) => {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (alreadyUsed[i]) {
      continue;
    }
    alreadyUsed[i] = true;
    const left = numbers[i];

    for (let j = i + 1; j < numbers.length; j++) {
      if (alreadyUsed[j]) {
        continue;
      }
      const right = numbers[j];

      if (i < previousI && !wasGenerated[i] && !wasGenerated[j]) {
        continue;
      }

      for (const operation of Operations) {
        if (!operation.check(left[0], right[0])) {
          continue;
        }
        const result = operation.apply(left[0], right[0]);

        // calculate the cost of the operation
        const {op, cost} = operation;
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
          bestResult = [result, op, left, right];
          bestValueSums = totalCost;
        }

        numbers[j] = [result, op, left, right];
        const wasGeneratedJTemp = wasGenerated[j];
        wasGenerated[j] = true;

        if (levels > 1 && (bestResult[0] !== target || totalCost < bestValueSums)) {
          _recurse_solve_numbers(numbers, alreadyUsed, i + 1, wasGenerated, target, levels - 1, totalCost);
        }

        wasGenerated[j] = wasGeneratedJTemp;
        numbers[j] = right;
      }
    }

    alreadyUsed[i] = false;
  }
}

function tidyup_result(result) {
  if (result.length < 4) {
    return result;
  }

  const mapping = {
    "?": "/",
    "_": "-"
  };

  const swappable = {
    "*": true,
    "+": true
  };

  for (let i = 2; i < result.length; i++) {
    let child = result[i];
    child = tidyup_result(child);

    if (child[1] === result[1] && swappable[result[1]]) {
      result.splice(i--, 1);
      result = result.concat(child.slice(2));
    } else {
      result[i] = child;
    }
  }

  if (result[1] in mapping) { // swap the operands for reversed operations
    result[1] = mapping[result[1]];
    const j = result[2];
    result[2] = result[3];
    result[3] = j;
  } else if (swappable[result[1]]) {
    const childs = result.slice(2).sort((a, b) => b[0] - a[0]);
    for (let i = 2; i < result.length; i++) {
      result[i] = childs[i - 2];
    }
  }

  return result;
}

const serialise_result = (result) => {
  const fullsize = (array, levels) => {
    if (levels < 1 || !Array.isArray(array)) {
      return 0;
    }

    return array.reduce((sum, item) => {
      if (Array.isArray(item)) {
        return sum + fullsize(item, levels - 1);
      }
      return sum + 1; // Count the number itself
    }, 0);
  };

  let childparts = [];
  for (let i = 2; i < result.length; i++) {
    const child = result[i];

    if (child.length >= 4) {
      childparts.push(serialise_result(child));
    }
  }

  childparts = childparts.sort((a, b) => fullsize(b) - fullsize(a));
  let parts = [];
  for (let i = 0; i < childparts.length; i++) {
    parts = parts.concat(childparts[i]);
  }

  const sliced = result.slice(2).map(l => l[0]);
  const thispart = [result[0], result[1]].concat(sliced);

  return parts.concat([thispart]);
}

function stringify_result(serialised, target) {
  let output = '';

  serialised = serialised.slice(0);

  for (let i = 0; i < serialised.length; i++) {
    const x = serialised[i];
    const args = x.slice(2);
    output += args.join(' ' + x[1] + ' ') + ' = ' + x[0] + '\n';
  }

  const result = serialised[serialised.length - 1][0];
  if (result !== target) {
    output += '(off by ' + Math.abs(result - target) + ')\n';
  }

  return output;
}

function _solve_numbers(numbers, target) {
  const mappedNumbers = numbers.map(x => [x, false]);
  const wasGenerated = Array(numbers.length).fill(false);
  const alreadyUsed = Array(numbers.length).fill(false);

  bestResult = [0, 0];

  _recurse_solve_numbers(mappedNumbers, alreadyUsed, 0, wasGenerated, target, numbers.length, 0);

  return bestResult;
}

function solve_numbers(numbers, target) {
  if (target < 101 || target > 999 || !Number.isInteger(target)) {
    return "Target must be an integer between 101 and 999.";
  } else if (!Array.isArray(numbers) || numbers.length < 2 || numbers.length > 6) {
    return "Numbers must be an array of 2 to 6 integers.";
  } else if (numbers.some(n => !Number.isInteger(n) || n < 1 || n > 100)) {
    return "All numbers must be integers between 1 and 100.";
  }

  numbers.sort((a, b) => a - b);
  bestResult = [numbers[0], numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    if (Math.abs(numbers[i] - target) < Math.abs(bestResult[0] - target)) {
      bestResult = [numbers[i], numbers[i]];
      bestValueSums = numbers[i];
    }
  }

  if (bestResult[0] === target) {
    return target + " = " + target;
  }

  return stringify_result(
    serialise_result(
      tidyup_result(
        _solve_numbers(numbers, target)
      )
    ),
    target
  );
}

console.log(solve_numbers([50, 75, 5, 1, 6, 10], 544));