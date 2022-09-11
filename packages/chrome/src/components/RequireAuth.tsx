import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: any) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  return isAuthed ? (
    children
  ) : (
    <Navigate to={'/login'} replace state={{ path: location.pathname }} />
  );
}

export default RequireAuth;
