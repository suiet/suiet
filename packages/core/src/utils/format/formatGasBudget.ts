export default function formatGasBudget(
  gasBudget: number | string | undefined
) {
  return typeof gasBudget === 'undefined' ? 'auto' : String(gasBudget);
}
