import { useNavigate } from 'react-router-dom';
import './common.scss';

function Nav() {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full left-0">
      <div className="flex items-center h-14 w-full bg-white"></div>
      <div
        className="setting-cancel"
        onClick={() => navigate('/settings')}
      ></div>
    </div>
  );
}

export default Nav;
