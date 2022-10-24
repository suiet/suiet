import { Extendable } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { updateAuthed } from '../store/app-context';
import LockPage from '../pages/LockPage';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

const Session = (props: Extendable) => {
  const authed = useSelector((state: RootState) => state.appContext.authed);
  const dispatch = useDispatch();
  const apiClient = useApiClient();
  const { authenticate } = useBiometricAuth();

  async function verifyAuthStatus(ac: AbortController) {
    try {
      await apiClient.callFunc('auth.isAuthed', null);
      dispatch(updateAuthed(true));
    } catch (e) {
      dispatch(updateAuthed(false));
      await authenticate(ac.signal);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    verifyAuthStatus(controller);
    return () => {
      controller.abort();
    };
  }, []);

  if (!authed) return <LockPage />;
  return <>{props.children}</>;
};

export default Session;
