// import * as cherrio from 'cheerio';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import type { SiteMetadata } from '@suiet/chrome-ext/src/scripts/content/utils/utils';

// TODO: add cache invalidation and persistence
const cache = new Map<string, SiteMetadata>();

export function saveSiteMetadata(href: string, metadata: SiteMetadata): void {
  cache.set(href, metadata);
}

// export async function getSiteMetadata(href: string): Promise<SiteMetadata> {
//   // check cache
//   if (cache.has(href)) {
//     return cache.get(href)!;
//   }

//   const response = await fetch(href);
//   const html = await response.text();
//   const $ = cherrio.load(html);

//   const name =
//     $('head > meta[property="og:site_name"]').attr('content') ??
//     $('head > meta[property="og:title"]').attr('content') ??
//     $('head > meta[name="title"]').attr('content');

//   let icon = $('head > link[rel~="icon"][type="image/png"]').attr('href') ?? $('head > link[rel~="icon"]').attr('href');

//   icon = icon ? new URL(icon, href).href : undefined;

//   const { origin } = new URL(href);

//   // only cache if we have both name and icon
//   if (name && icon) {
//     cache.set(href, {
//       name,
//       icon,
//       origin,
//     });
//   }

//   return {
//     name: name ?? href,
//     icon: icon ?? null,
//     origin,
//   };
// }

// spin lock version
export async function getSiteMetadata(href: string): Promise<SiteMetadata> {
  if (cache.has(href)) {
    return cache.get(href)!;
  }

  while (1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (cache.has(href)) {
      return cache.get(href)!;
    }
  }

  throw new Error('unreachable');
}
