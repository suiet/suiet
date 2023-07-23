import { WindowMsgTarget } from '@suiet/chrome-ext/src/scripts/shared';
import { getSiteMetadata } from '@suiet/chrome-ext/src/scripts/content/utils/utils';

(async function () {
  const metadata = await getSiteMetadata();
  // @ts-expect-error
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      target: WindowMsgTarget.SUIET_CONTENT,
      payload: {
        funcName: 'dapp.saveSiteMetadata',
        payload: {
          metadata,
        },
      },
    })
  );
})();
