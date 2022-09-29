import { Extendable } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { updateAuthed } from '../store/app-context';
import LockPage from '../pages/LockPage';

const Session = (props: Extendable) => {
  const authed = useSelector((state: RootState) => state.appContext.authed);
  const dispatch = useDispatch();
  const apiClient = useApiClient();

  async function verifyAuthStatus() {
    try {
      await apiClient.callFunc('auth.isAuthed', null);
      dispatch(updateAuthed(true));
    } catch (e) {
      dispatch(updateAuthed(false));
    }
  }

  useEffect(() => {
    verifyAuthStatus();
  }, []);

  if (!authed) return <LockPage />;
  return <>{props.children}</>;
};

export default Session;
