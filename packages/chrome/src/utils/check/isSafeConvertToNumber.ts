import isFloat from './isFloat';

export default function isSafeConvertToNumber(value: string | bigint | number) {
  let num = Number(value);
  if (isFloat(num)) {
    num = Math.ceil(num);
  }
  return Number.isSafeInteger(num);
}
