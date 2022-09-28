import { Extendable } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect } from 'react';
// import Lock from './Lock';

import { useApiClient } from '../hooks/useApiClient';
import { updateAuthed } from '../store/app-context';
import LoginPage from '../pages/OnBoarding/LoginPage';

const Session = (props: Extendable) => {
  const authed = useSelector((state: RootState) => state.appContext.authed);
  const dispatch = useDispatch();
  const apiClient = useApiClient();

  async function verifyAuthStatus() {
    try {
      await apiClient.callFunc('auth.getToken', null);
      dispatch(updateAuthed(true));
    } catch (e) {
      console.error('auth getToken', e);
      dispatch(updateAuthed(false));
    }
  }

  useEffect(() => {
    verifyAuthStatus();
  }, []);

  if (!authed) return <LoginPage />;
  return <>{props.children}</>;
};

export default Session;
