import { formatSUI } from './formatCurrency';

export default function formatGasBudget(
  gasBudget: number | string | undefined
) {
  return typeof gasBudget === 'undefined' ? 'auto' : formatSUI(gasBudget);
}
