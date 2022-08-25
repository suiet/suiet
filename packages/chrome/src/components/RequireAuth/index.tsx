import React, {ReactNode, useEffect} from 'react';
import {Extendable} from "../../types";
import {useAuth} from "../../hooks/useAuth";
import {Navigate, useLocation} from "react-router-dom";

function RequireAuth({children}: any) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('isAuthed', isAuthed)
    console.log('location', location)
  }, [])

  return isAuthed ? children : (
    <Navigate to={'/login'} replace state={{ path: location.pathname }} />
  )
}

export default RequireAuth;