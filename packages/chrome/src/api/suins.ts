import { envUrl, suietHttp } from '../utils/request';
import { has } from 'lodash-es';

/**
 * resolve default name for address
 * @param address
 * @param opts
 */
export async function resolveAddress(
  address: string,
  opts: {
    networkId: string;
  }
) {
  if (typeof address !== 'string' || typeof opts?.networkId !== 'string') {
    throw new Error('invalid params');
  }
  const resultMap: Record<string, any> = await suietHttp.get(
    envUrl('/ns/resolve', opts.networkId),
    {
      params: {
        address,
      },
    }
  );
  if (!has(resultMap, address)) return undefined;
  const info = resultMap[address];
  if (!has(info, 'domain')) {
    throw new Error('response data structure incorrect');
  }
  return info.domain;
}

// /**
//  * resolve address for domain name
//  * @param domain
//  */
// export async function resolveDomain(domain: string) {
//   return await suietHttp.get('/ns/resolve', {
//     params: {
//       domain,
//     },
//   });
// }

/**
 * resolve default name for address
 * @param address
 * @param opts
 */
export async function resolveDomain(
  domain: string,
  opts: {
    networkId: string;
  }
) {
  if (typeof domain !== 'string' || typeof opts?.networkId !== 'string') {
    throw new Error('invalid params');
  }
  const resultMap: Record<string, any> = await suietHttp.get(
    envUrl('/ns/resolve', opts.networkId),
    {
      params: {
        domain,
      },
    }
  );
  if (!has(resultMap, domain)) return undefined;
  const info = resultMap[domain];
  if (!has(info, 'address')) {
    throw new Error('response data structure incorrect');
  }
  return info.address;
}
