export const roundDecimal = (value: number): number =>
  Math.round(value * 100) / 100;

export const divideNumberDigits = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
