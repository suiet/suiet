import { formatSUI } from './formatCurrency';

export default function formatDryRunError(error: any): string {
  if (error?.message) {
    if (/^InsufficientCoinBalance/i.test(error.message)) {
      return 'Insufficient Coin Balance, please check your balance';
    }
    if (/^No valid gas coins/i.test(error.message)) {
      return 'No valid SUI to pay the gas, please check your balance';
    }
    if (/.*GasBalanceTooLow.*/i.test(error.message)) {
      const matchGroups =
        /GasBalanceTooLow { gas_balance: (\d+), needed_gas_amount: (\d+) }/.exec(
          error.message
        );
      if (matchGroups?.length !== 3) {
        return 'Insufficient SUI Balance, please check your balance';
      }

      const [_, currentSUI, neededSUI] = matchGroups;
      return `Insufficient SUI Balance (${formatSUI(
        currentSUI
      )} SUI), the needed gas is ${formatSUI(neededSUI)} SUI`;
    }
    if (/^.*object does not exist.*/i.test(error.message)) {
      return 'We were unable to locate the packageID. Please try selecting a different network or reach out to the website owner to confirm the existence of the requested package.';
    }
    return error.message;
  }
  return 'Unknown error';
}
