import classnames from 'classnames';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import type { Extendable, StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import { ReactComponent as IconHome } from '../../../assets/icons/home.svg';
import { ReactComponent as IconNFT } from '../../../assets/icons/nft.svg';
import { ReactComponent as IconHistory } from '../../../assets/icons/history.svg';
import { ReactComponent as IconGrid } from '../../../assets/icons/grid.svg';
import { ReactComponent as IconSwap } from '../../../assets/icons/swap.svg';
import { ReactNode } from 'react';
import { useFeatureFlagsWithNetwork } from '../../../hooks/useFeatureFlags';

export type MenuProps = StyleExtendable;
type MenuItemProps = StyleExtendable & {
  active?: boolean;
  icon: ReactNode;
  alt?: string;
  to: string;
};

const MenuItem = (props: MenuItemProps) => {
  const navigate = useNavigate();
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: false });

  return (
    <div
      className={classnames(styles['menu-item'], {
        [styles['menu-item--active']]: match,
      })}
      onClick={() => {
        navigate(props.to);
      }}
    >
      <div className={styles['menu-icon']}>{props.icon}</div>
    </div>
  );
};

const Menu: React.FC<MenuProps> = (props: Extendable) => {
  const featureFlags = useFeatureFlagsWithNetwork();

  return (
    <div
      className={classnames(styles['menu'], props.className)}
      style={props.style}
    >
      <MenuItem to="/home" icon={<IconHome />} alt="home" />
      <MenuItem to="/nft" icon={<IconNFT />} alt="nft" />
      {featureFlags?.enable_swap && (
        <MenuItem to="/swap" icon={<IconSwap />} alt="swap" />
      )}
      <MenuItem to="/dapps" icon={<IconGrid />} alt="dapps" />
      <MenuItem
        to="/transaction/flow"
        icon={<IconHistory />}
        alt="transaction"
      />
    </div>
  );
};

export default Menu;
