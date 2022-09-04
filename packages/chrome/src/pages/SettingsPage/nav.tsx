import { useNavigate } from 'react-router-dom';
import './common.scss';

function Nav() {
  const navigate = useNavigate();
  return (
    <div className="flex fixed items-center h-14 top-0">
      <div className="setting-cancel" onClick={() => navigate('..')}></div>
    </div>
  );
}

export default Nav;
