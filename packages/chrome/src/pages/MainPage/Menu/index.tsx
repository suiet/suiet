import classnames from 'classnames';
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
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  return (
    <div className={classnames(
      styles['menu-item'],
        {
          [styles['menu-item--active']]: props.active,
        }
      )}>
        <img src={props.icon} className={styles['menu-icon']} alt={props.alt || 'icon'} />
    </div>
  )
}

const Menu: React.FC<MenuProps> = (props) => {
  return (
    <div 
      className={classnames(styles['menu'], props.className)} 
      style={props.style}
    >
      <MenuItem icon={IconHome} alt="home" active />
      <MenuItem icon={IconTx} alt="transaction" />
      <MenuItem icon={IconSettings} alt="settings" />
    </div>
  );
}

export default Menu;
