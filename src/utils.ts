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