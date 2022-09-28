import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateAuthed } from '../store/app-context';
import { useApiClient } from './useApiClient';

export function useAuth() {
  const isAuthed = useSelector((state: RootState) => state.appContext.authed);
  const dispatch = useDispatch();
  const apiClient = useApiClient();

  return {
    isAuthed,
    login: async (password: string) => {
      await apiClient.callFunc<string, string>('auth.login', password);
      await dispatch(updateAuthed(true));
    },
    logout: async () => {
      await apiClient.callFunc<null, string>('auth.logout', null);
      await dispatch(updateAuthed(false));
    },
  };
}
