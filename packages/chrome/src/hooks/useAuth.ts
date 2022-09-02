import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateToken } from '../store/app-context';
import { useEffect, useMemo, useState } from 'react';
import { coreApi } from '@suiet/core';

function validateToken(token: unknown) {
  return typeof token === 'string' && token !== '';
}

export function useAuth() {
  const token = useSelector((state: RootState) => state.appContext.token);
  const isAuthed = useMemo(() => validateToken(token), [token]);
  const dispatch = useDispatch();

  return {
    token,
    isAuthed,
    login: async function (password: string): Promise<string> {
      const token = await coreApi.auth.loadTokenWithPassword(password);
      await dispatch(updateToken(token));
      return token;
    },
    logout: async () => {
      await dispatch(updateToken(''));
    },
  };
}
