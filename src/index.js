const solveRecursively = (target, currentValue, numbers, expression) => {
  if (currentValue === target) {
    return expression;
  }

  if (numbers.length === 0) {
    return false;
  }

  for (let i = 0; i < numbers.length; i++) {
    const number = numbers[i];
    const newNumbers = numbers.slice();
    newNumbers.splice(i, 1);

    const add = solveRecursively(target, currentValue + number, newNumbers, `(${expression} + ${number})`);
    if (add) {
      return add;
    }

    const subtract = solveRecursively(target, currentValue - number, newNumbers, `(${expression} - ${number})`);
    if (subtract) {
      return subtract;
    }

    const subtract2 = solveRecursively(target, number - currentValue, newNumbers, `(${number} - ${expression})`);
    if (subtract2) {
      return subtract2;
    }
    
    if (number !== 0 && currentValue !== 0){
      const multiply = solveRecursively(target, currentValue * number, newNumbers, `(${expression} * ${number})`);
      if (multiply) {
        return multiply;
      }
    }

    if (number !== 0){
      const divide = solveRecursively(target, currentValue / number, newNumbers, `(${expression} / ${number})`);
      if (divide) {
        return divide;
      }
    }
    
    if (currentValue !== 0){
      const divide2 = solveRecursively(target, number / currentValue, newNumbers, `(${number} / ${expression})`);
      if (divide2) {
        return divide2;
      }
    }
  }

  return false;
}

const solve = (target, numbers) => {
  console.log(solveRecursively(target, 0, numbers, '0'));
};

solve(952, [25, 50, 75, 100, 2, 1]);
