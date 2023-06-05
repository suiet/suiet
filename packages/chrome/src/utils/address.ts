import { isValidSuiAddress } from '@mysten/sui.js';

export function isValidDomain(domain: string) {
  return (
    domain && domain.indexOf('.') > 0 && domain.indexOf('.') < domain.length - 1
  );
}

export function isValidDomainOrAddress(input: string) {
  return isValidSuiAddress(input) || isValidDomain(input);
}
