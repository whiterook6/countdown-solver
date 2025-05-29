const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


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

    if (currentValue === 0){
      const solved = solveRecursively(target, number, newNumbers, `${number}`);
      if (solved){
        return solved;
      }
    }

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
  const shuffledNumbers = [...numbers];
  shuffle(shuffledNumbers);
  console.log(solveRecursively(target, 0, shuffledNumbers, '0'));
};

solve(92, [3, 5, 7, 11]);
