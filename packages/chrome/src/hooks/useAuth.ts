import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateToken } from '../store/app-context';
import { useMemo } from 'react';
import { useApiClient } from './useApiClient';

function validateToken(token: unknown) {
  return typeof token === 'string' && token !== '';
}

export function useAuth() {
  const token = useSelector((state: RootState) => state.appContext.token);
  const isAuthed = useMemo(() => validateToken(token), [token]);
  const dispatch = useDispatch();
  const apiClient = useApiClient();

  return {
    token,
    isAuthed,
    login: async (password: string) => {
      const token = await apiClient.callFunc<string, string>(
        'auth.loadTokenWithPassword',
        password
      );
      await dispatch(updateToken(token));
      return token;
    },
    logout: async () => {
      await dispatch(updateToken(''));
    },
  };
}
