import React from 'react';
import {useAuth} from "../hooks/useAuth";
import {Navigate, useLocation} from "react-router-dom";

function RequireAuth({children}: any) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  console.log('isAuthed', isAuthed)

  return isAuthed ? children : (
    <Navigate to={'/login'} replace state={{ path: location.pathname }} />
  )
}

export default RequireAuth;