import { useEffect, useState } from 'react';
import { has } from 'lodash-es';
import { useLocation } from 'react-router-dom';

export enum PageEntry {
  ONBOARD,
  SWITCHER,
}

/**
 * Help pages to be aware of its entry source
 * detect entry param from location.state
 */
export function usePageEntry() {
  const [pageEntry, setPageEntry] = useState<PageEntry>(PageEntry.ONBOARD);
  const location = useLocation();

  useEffect(() => {
    if (!has(location.state, 'pageEntry')) return;
    setPageEntry((location.state as any).pageEntry);
  }, [location.state]);

  return pageEntry;
}
