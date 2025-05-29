let bestValueSums;
let bestResult;

const Operations = {
  "+": {
    check: (n1, n2) => n1 > 0 && n2 > 0, // no sense in adding zero or negative numbers
    apply: (n1, n2) => n1 + n2,
    cost: 1
  },
  "-": {
    check: (n1, n2) => n1 > n2 && n2 > 0, // no sense in subtracting zero or negative numbers
    apply: (n1, n2) => n1 - n2,
    cost: 1.05
  },
  "_": {
    check: (n2, n1) => n1 > n2 && n2 > 0, // no sense in subtracting zero or negative numbers
    apply: (n2, n1) => n1 - n2,
    cost: 1.05
  },
  "*": {
    check: (n1, n2) => n1 > 1 && n2 > 1, // no sense in multiplying by zero or one
    apply: (n1, n2) => n1 * n2,
    cost: 1.2
  },
  "/": {
    check: (n1, n2) => n2 > 1 && n1 % n2 === 0, // no sense in dividing by zero or one, and only whole numbers
    apply: (n1, n2) => n1 / n2,
    cost: 1.3
  },
  "?": {
    check: (n2, n1) => n2 > 1 && n1 % n2 === 0, // no sense in dividing by zero or one, and only whole numbers
    apply: (n2, n1) => n1 / n2,
    cost: 1.3
  }
}

const ALREADY_USED = -1;
const _recurse_solve_numbers = (
  numbers,
  previousI,
  wasGenerated,
  target,
  levels,
  valueSums
) => {
  for (let i = 0; i < numbers.length - 1; i++) {
    const left = numbers[i];
    if (left === ALREADY_USED) {
      continue;
    }
    numbers[i] = ALREADY_USED;

    for (let j = i + 1; j < numbers.length; j++) {
      const right = numbers[j];
      if (right === ALREADY_USED) {
        continue;
      }

      if (i < previousI && !wasGenerated[i] && !wasGenerated[j]) {
        continue;
      }

      for (const op in Operations) {
        if (!Operations[op].check(left[0], right[0])) {
          continue;
        }

        const result = Operations[op].apply(left[0], right[0]);

        let opCost = Math.abs(result);
        while (opCost % 10 === 0 && opCost !== 0) {
          opCost /= 10;
        }
        if ((left[0] === 10 || right[0] === 10) && op === '*') {
          opCost = 1;
        }
        opCost *= Operations[op].cost;

        const newValueSums = valueSums + opCost;

        if (
          Math.abs(result - target) < Math.abs(bestResult[0] - target) ||
          (
            Math.abs(result - target) === Math.abs(bestResult[0] - target) &&
            (newValueSums < bestValueSums)
          )
        ) {
          bestResult = [result, op, left, right];
          bestValueSums = newValueSums;
        }

        numbers[j] = [result, op, left, right];
        const wasGeneratedJTemp = wasGenerated[j];
        wasGenerated[j] = true;

        if (levels > 1 && (bestResult[0] !== target || newValueSums < bestValueSums)) {
          _recurse_solve_numbers(numbers, i + 1, wasGenerated, target, levels - 1, newValueSums);
        }

        wasGenerated[j] = wasGeneratedJTemp;
        numbers[j] = right;
      }
    }

    numbers[i] = left;
  }
}

function tidyup_result(result) {
  const mapping = {
    "?": "/",
    "_": "-"
  };

  const swappable = {
    "*": true,
    "+": true
  };

  if (result.length < 4) {
    return result;
  }

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

  if (result[1] in mapping) {
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

function fullsize(array) {
  if (!Array.isArray(array)) {
    return 0;
  }

  let l = 0;

  for (let i = 0; i < array.length; i++) {
    l += fullsize(array[i]);
  }

  return l + array.length;
}

function serialise_result(result) {
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
  const was_generated = Array(numbers.length).fill(false);

  bestResult = [0, 0];

  _recurse_solve_numbers(mappedNumbers, 0, was_generated, target, numbers.length, 0);

  return bestResult;
}

function solve_numbers(numbers, target) {
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

console.log(solve_numbers([25, 50, 75, 100, 4, 6], 821));