import React, { useContext, useEffect } from 'react';
import { BackgroundApiClient } from '../scripts/shared/ui-api-client';
import { useDispatch } from 'react-redux';
import { updateAuthed } from '../store/app-context';

export const ApiClientContext = React.createContext<BackgroundApiClient | null>(
  null
);

export function useApiClient() {
  const apiClient = useContext(ApiClientContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!apiClient) return;
    const off = apiClient.on('authExpired', () => {
      console.log(
        '[api client] no auth event triggered, set app state to unauthed'
      );
      dispatch(updateAuthed(false));
    });
    return () => {
      off();
    };
  }, [apiClient]);
  return apiClient as BackgroundApiClient;
}
