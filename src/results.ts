import { Step } from "./types";

/**
 * Counts the number of elements in a nested array, including the number of arrays.
 * @returns number
 * @example fullsize(123) => 0
 *          fullsize([]) => 0
 *          fullsize([1]) => 1
 *          fullsize([[1]]) => 2
 *          fullsize([1, [2, 3], [4, [5, 6]]]) => 9
 */
const fullsize = (array: any[] | any) => {
  if (!Array.isArray(array) || array.length === 0) {
    return 0;
  }

  return array.reduce((sum, item) => sum + fullsize(item), array.length); // clever, I like starting with the length of the array
};

export const tidyUpStep = (step: Step) => {
  if (step.length < 4) {
    return step;
  }

  const stepOp = step[1] as string;
  const commutativeOps = [
    "+", "*"
  ];

  for (let i = 2; i < step.length; i++) { // for each operands in this step
    const childStep = tidyUpStep(step[i] as Step);

    if (childStep[1] === stepOp && commutativeOps.includes(stepOp)) {
      step.splice(i--, 1);
      step = step.concat(childStep.slice(2)) as Step;
    } else {
      step[i] = childStep;
    }
  }

  const mapping = {
    "?": "/",
    "_": "-"
  };

  if (stepOp in mapping) { // swap the operands for reversed operations
    const j = step[2];
    step[2] = step[3];
    step[3] = j;
    
    step[1] = mapping[stepOp];
  } else if (commutativeOps.includes(stepOp)) {
    const childs = step.slice(2).sort((a, b) => b[0] - a[0]);
    for (let i = 2; i < step.length; i++) {
      step[i] = childs[i - 2];
    }
  }

  return step;
}

/**
 * Takes a step and flattens it into a list of steps with all of the recursion flattened.
 * All of its child steps happen before this does.
 * @example [6, *, [3, +, 1, 2], [2, +, 1, 1]] => [[2, +, 1, 1], [3, +, 1, 2], [6, *, 2, 3]]
 */
export const stringifyStepAndChildren = (result: Step): Step[] => {
  const childparts = [];
  for (let i = 2; i < result.length; i++) {
    const child = result[i] as Step;

    if (child.length >= 4) {
      childparts.push(stringifyStepAndChildren(child));
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

  parts.push(thispart);
  return parts;
}

/**
 * Turns a list of steps into a list of human-readable math instructions
 * @example [... [5, +, 1, 1, 1, 1, 1], ...] => [..., '1 + 1 + 1 + 1 + 1 = 5', ...]
 * Also adds a note if the result is not equal to the target
 */
export const stringifyStep = (serialised: Array<Step>, target: number): string[] => {
  const output: string[] = serialised.map(step => {
    const args = step.slice(2);
    return `${args.join(` ${step[1]} `)} = ${step[0]}`; // turn [5, +, 1, 1, 1, 1, 1] into `1 + 1 + 1 + 1 + 1 = 5`
  });

  const lastStep = serialised[serialised.length - 1];
  const distanceFromTarget = Math.abs(lastStep[0] - target);
  if (distanceFromTarget > 0) {
    output.push(`(off by ${distanceFromTarget})`);
  }

  return output;
}