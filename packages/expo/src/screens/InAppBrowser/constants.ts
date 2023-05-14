export const { code: DAPP_API } = require('./dapp-api.esbuild') as { code: string };
export const { code: DAPP_SITE_METADATA } = require('./dapp-siteMetadata.esbuild') as { code: string };

console.log(DAPP_API.length);
