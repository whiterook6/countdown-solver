export type Step = [
  number, // result of the operation
  false,
] | [
  number, // result of the operation
  string, // operation symbol
  Step, // left operand
  Step, // right operand
];