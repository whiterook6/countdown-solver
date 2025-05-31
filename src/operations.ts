import { Step } from "./types";

type Operation = {
  check: (left: number, right: number) => boolean;
  apply: (left: Step, right: Step) => Step;
  cost: number;
};

export const operations: Operation[] = [{
  check: (left: number, right: number) => {
    return (left > 0) && (right > 0); // we won't add zero or negative numbers
  },
  apply: (left: Step, right: Step) => [left[0] + right[0], "+", left, right],
  cost: 1
}, {
  check: (left: number, right: number) => {
    return (left > right) // subtract smaller from larger
      && (right > 0) // don't subtract zero or negative numbers
      && (left - right !== right); // no point getting back one of the operands
  },
  apply: (left: Step, right: Step) => [left[0] - right[0], "-", left, right],
  cost: 1.05
}, {
  // also subtract, but backwards for when left is smaller than right
  check: (right: number, left: number) => {
    return (left > right)
      && (right > 0)
      && (left - right !== right);
  },
  apply: (right: Step, left: Step) => [left[0] - right[0], "-", left, right],
  cost: 1.05
}, {
  check: (left: number, right: number) => {
    return (left > 1) && (right > 1); // no sense in multiplying by zero or one
  },
  apply: (left: Step, right: Step) => [left[0] * right[0], "*", left, right],
  cost: 1.2
}, {
  check: (left: number, right: number) => {
    return (left >= right) // divide larger by smaller to avoid fractions
      && (right > 1) // no sense in dividing by zero or one, and only whole numbers
      && (left % right === 0) // only divide if it divides evenly
      && (left / right !== right); // no sense getting back one of the operands
  },
  apply: (left: Step, right: Step) => [left[0] / right[0], "/", left, right],
  cost: 1.3
}, {
  // also divide, but backwards for when left is smaller than right
  check: (right: number, left: number) => {
    return (left >= right)
      && (right > 1)
      && (left % right === 0)
      && (left / right !== right);
  },
  apply: (right: Step, left: Step) => [left[0] / right[0], "/", left, right],
  cost: 1.3
}];