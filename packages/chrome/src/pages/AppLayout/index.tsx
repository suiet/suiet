import Header from './Header';
import Menu from './Menu';
import styles from './index.module.scss';
import { Outlet, useLocation } from 'react-router-dom';

function AppLayout() {
  const location = useLocation();
  const state = (location.state || {}) as Record<string, any>;

  return (
    <div className={styles['main-page']}>
      {!state.hideApplayout && <Header walletSwitch={state?.walletSwitch} />}
      {/* child route view */}
      <Outlet />
      {!state.hideApplayout && <Menu className="mt-auto" />}
    </div>
  );
}

export default AppLayout;
