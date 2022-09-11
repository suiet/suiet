import React, { useContext } from 'react';
import { BackgroundApiClient } from '../scripts/shared/ui-api-client';

export const ApiClientContext = React.createContext<BackgroundApiClient | null>(
  null
);

export function useApiClient() {
  const apiClient = useContext(ApiClientContext);
  return apiClient as BackgroundApiClient;
}
