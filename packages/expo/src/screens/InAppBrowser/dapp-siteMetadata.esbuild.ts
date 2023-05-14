export type SiteMetadata = {
  name: string;
  icon: string | null;
};

/**
 * Gets site metadata and returns it
 *
 */
export async function getSiteMetadata(): Promise<SiteMetadata> {
  return {
    name: getSiteName(window),
    icon: await getSiteIcon(window),
  };
}

function getSiteName(windowObject: typeof window): string {
  const { document } = windowObject;

  const siteName: HTMLMetaElement | null = document.querySelector('head > meta[property="og:site_name"]');
  if (siteName) {
    return siteName.content;
  }

  const metaTitle: HTMLMetaElement | null = document.querySelector('head > meta[name="title"]');
  if (metaTitle) {
    return metaTitle.content;
  }

  if (document.title && document.title.length > 0) {
    return document.title;
  }

  return window.location.hostname;
}

/**
 * Extracts an icon for the site from the DOM
 * @returns an icon URL
 */
async function getSiteIcon(windowObject: typeof window): Promise<string | null> {
  const { document } = windowObject;

  const icons: NodeListOf<HTMLLinkElement> = document.querySelectorAll('head > link[rel~="icon"]');
  for (const icon of Array.from(icons)) {
    if (icon && (await imgExists(icon.href))) {
      return icon.href;
    }
  }

  return null;
}

/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns Whether the image exists.
 */
async function imgExists(url: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    try {
      const img = document.createElement('img');
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

(async function () {
  const metadata = await getSiteMetadata();
  // @ts-expect-error
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      target: 'SUIET_CONTENT',
      payload: {
        funcName: 'dapp.saveSiteMetadata',
        payload: {
          metadata,
        },
      },
    })
  );
})();
