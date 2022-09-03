import Header from './Header';
import Menu from './Menu';
import styles from './index.module.scss';
import { Outlet, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { useEffect, useState } from 'react';

export enum LayoutMode {
  DEFAULT = 'default',
  WITHOUT_HEADER = 'without-header',
  WITHOUT_MENU = 'without-menu',
  EMPTY = 'empty',
}

function AppLayout() {
  const location = useLocation();
  const state = (location.state || {}) as Record<string, any>;
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.DEFAULT);

  useEffect(() => {
    if (state?.hideAppLayout) {
      setLayoutMode(LayoutMode.EMPTY);
    } else {
      setLayoutMode(LayoutMode.DEFAULT);
    }
  }, [state]);

  return (
    <div
      className={classnames(
        styles['main-page'],
        styles[`main-page--${layoutMode}`]
      )}
    >
      <Header className={styles['header']} openSwitcher={state?.openSwitcher} />
      {/* child route view */}
      <main className={styles['main']}>
        <Outlet />
      </main>
      <Menu className={classnames(styles['menu'], 'mt-auto')} />
    </div>
  );
}

export default AppLayout;
