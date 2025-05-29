import { Step } from "./types";

/**
 * Counts the number of elements in a nested array, including the number of arrays.
 * @returns number
 * @example fullsize([1]) => 1
 *          fullsize([[1]]) => 2
 *          fullsize([1, [2, 3], [4, [5, 6]]]) => 9
 */
export const fullsize = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return 0;
  }

  return array.reduce((sum, item) => sum + fullsize(item), array.length);
};

export const serialise_result = (result: Step) => {
  const childparts = [];
  for (let i = 2; i < result.length; i++) {
    const child = result[i] as Step;

    if (child.length >= 4) {
      childparts.push(serialise_result(child));
    }
  }

  childparts.sort((a, b) => fullsize(b) - fullsize(a));
  let parts = [];
  for (let i = 0; i < childparts.length; i++) {
    parts = parts.concat(childparts[i]);
  }

  // flatten this step into the result, the op, and the operands without their own steps
  const thispart = [result[0], result[1], ...result.slice(2).map(l => {
    return l[0]; // only the result of the operation, not the whole step
  })];

  return parts.concat([thispart]);
}

export const stringify_result = (serialised: Array<any>, target: number): string[] => {
  const output = [];

  serialised = serialised.slice(0);

  for (let i = 0; i < serialised.length; i++) {
    const x = serialised[i];
    const args = x.slice(2);
    output.push(args.join(' ' + x[1] + ' ') + ' = ' + x[0]);
  }

  const result = serialised[serialised.length - 1][0];
  if (result !== target) {
    output.push('(off by ' + Math.abs(result - target) + ')');
  }

  return output;
}

export const tidyup_result = (result) => {
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