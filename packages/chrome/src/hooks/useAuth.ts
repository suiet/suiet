import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {updateToken} from "../store/app-context";
import {useMemo} from "react";

function requestToken(password: string): string {
  return 'TOKEN'; // TODO
}

function validateToken(token: string): boolean {
  return token !== ''; // TODO
}

export function useAuth() {
  const token = useSelector((state: RootState) => state.appContext.token)
  const isAuthed = useMemo(() => validateToken(token), [token])
  const dispatch = useDispatch();

  return {
    token,
    isAuthed,
    login: async (password: string) => {
      const token = requestToken(password);
      await dispatch(updateToken(token));
    },
    logout: async () => {
      await dispatch(updateToken(''));
    }
  }
}