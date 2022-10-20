import { FeatureFlagRes } from '../../../api';
import { version } from '../../../package-json';

export async function fetchFeatureFlags(): Promise<FeatureFlagRes> {
  const res = await fetch('https://api.suiet.app/feature-flag', {
    method: 'get',
    headers: {
      'x-suiet-client-type': 'suiet-desktop-extension',
      'x-suiet-client-version': version,
    },
  });
  const resData = await res.json();
  if (!resData.data) {
    throw new Error('Fetching feature flags failed');
  }
  return resData.data;
}
