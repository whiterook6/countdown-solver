export type Step = [
  /** The plain value */
  number,
  
  /** no operation; this is a plain value from the start */
  false,
] | [
  /** The plain value */
  number,

  /** the operation to apply to the left and right operands */
  string,

  /** The left operand */
  Step,

  /** The right operand */
  Step,
];