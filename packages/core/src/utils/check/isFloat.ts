export default function isFloat(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) && !Number.isInteger(num);
}
