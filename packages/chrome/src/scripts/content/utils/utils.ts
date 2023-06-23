export type SiteMetadata = {
  name: string;
  icon: string | null;
  origin: string;
};

/**
 * Gets site metadata and returns it
 *
 */
export function getSiteMetadata(): SiteMetadata {
  return {
    name: getSiteName(window),
    icon: getSiteIcon(window),
    origin: window.origin,
  };
}

function getSiteName(windowObject: typeof window): string {
  const { document } = windowObject;

  const siteName: HTMLMetaElement | null = document.querySelector(
    'head > meta[property="og:site_name"]'
  );
  if (siteName) {
    return siteName.content;
  }

  const metaTitle: HTMLMetaElement | null = document.querySelector(
    'head > meta[name="title"]'
  );
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
function getSiteIcon(windowObject: typeof window): string | null {
  const { document } = windowObject;

  const icons: NodeListOf<HTMLLinkElement> = document.querySelectorAll(
    'head > link[rel~="icon"]'
  );
  for (const icon of icons) {
    if (icon && icon.href) {
      return icon.href;
    }
  }

  return null;
}
