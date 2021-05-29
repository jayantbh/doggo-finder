export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const randomInt = (min = 0, max = 100) =>
  Math.round(Math.random() * (max - min) + min);
