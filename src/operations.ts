export const operations = [{
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