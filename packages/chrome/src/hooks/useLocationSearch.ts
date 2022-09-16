import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export function useLocationSearch(): URLSearchParams {
  const location = useLocation();
  return useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
}
