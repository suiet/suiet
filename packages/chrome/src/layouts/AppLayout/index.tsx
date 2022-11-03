import Header from './Header';
import Menu from './Menu';
import styles from './index.module.scss';
import { useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { Extendable } from '../../types';

export enum LayoutMode {
  DEFAULT = 'default',
  WITHOUT_HEADER = 'without-header',
  WITHOUT_MENU = 'without-menu',
  EMPTY = 'empty',
}
export type AppLayoutProps = Extendable & {
  layoutMode?: LayoutMode;
};

function AppLayout(props: AppLayoutProps) {
  const { layoutMode = LayoutMode.DEFAULT } = props;
  const location = useLocation();
  const state = (location.state || {}) as Record<string, any>;

  return (
    <div
      className={classnames(
        styles['main-page'],
        styles[`main-page--${layoutMode}`]
      )}
    >
      <Header className={styles['header']} openSwitcher={state?.openSwitcher} />
      <main
        className={classnames(styles['main'], 'no-scrollbar', props.className)}
      >
        {props.children}
      </main>
      <Menu className={classnames(styles['menu'], 'mt-auto')} />
    </div>
  );
}

export default AppLayout;
