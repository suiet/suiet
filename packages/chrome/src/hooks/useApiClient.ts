import React, { useCallback, useContext, useEffect } from 'react';
import { BackgroundApiClient } from '../scripts/shared/ui-api-client';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuthed } from '../store/app-context';
import { RootState } from '../store';

export const ApiClientContext = React.createContext<BackgroundApiClient | null>(
  null
);

export function useApiClient() {
  const apiClient = useContext(ApiClientContext);
  const { authed } = useSelector((state: RootState) => state.appContext);
  const dispatch = useDispatch();

  const handleAuthExpired = useCallback(() => {
    if (!authed) return;
    dispatch(updateAuthed(false));
    console.log(
      '[api client] no auth event triggered, set app state to unauthed'
    );
  }, [authed]);

  useEffect(() => {
    if (!apiClient) return;
    const off = apiClient.on('authExpired', handleAuthExpired);
    return () => {
      off();
    };
  }, [apiClient, handleAuthExpired]);

  return apiClient as BackgroundApiClient;
}
