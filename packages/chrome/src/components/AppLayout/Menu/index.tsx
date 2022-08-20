import classnames from 'classnames';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import type { StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import IconHome from '../../../assets/icons/home.svg';
import IconTx from '../../../assets/icons/transactions.svg';
import IconSettings from '../../../assets/icons/settings.svg';

export type MenuProps = StyleExtendable;
type MenuItemProps = StyleExtendable & {
  active?: boolean;
  icon: string;
  alt?: string;
  to: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ to, icon, alt }) => {
  const navigate = useNavigate();
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: false });

  return (
    <div
      className={classnames(styles['menu-item'], {
        [styles['menu-item--active']]: match,
      })}
      onClick={() => {
        navigate(to);
      }}
    >
      <img src={icon} className={styles['menu-icon']} alt={alt || 'icon'} />
    </div>
  );
};

const Menu: React.FC<MenuProps> = (props) => {
  return (
    <div
      className={classnames(styles['menu'], props.className)}
      style={props.style}
    >
      <MenuItem to="/home" icon={IconHome} alt="home" />
      <MenuItem to="/transaction/flow" icon={IconTx} alt="transaction" />
      <MenuItem to="/settings" icon={IconSettings} alt="settings" />
    </div>
  );
};

export default Menu;
