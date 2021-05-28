export const splitEvery = (n: number, array: any[]) => {
  const arr = [...array];
  const newArr = [];

  do {
    newArr.push(arr.splice(0, n));
  } while (arr.length);

  return newArr;
};

// https://stackoverflow.com/a/17428705/2968465
export const transpose = (array: any[][]) =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
