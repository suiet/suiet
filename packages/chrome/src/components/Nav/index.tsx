import React, { CSSProperties } from 'react';
import { ReactComponent as IconNavArrow } from '../../assets/icons/nav-arrow.svg';
import Icon from '../Icon';
import { Extendable } from '../../types';
import Typo from '../Typo';
import classnames from 'classnames';
import styles from './index.module.scss';

export type NavProps = Extendable & {
  title?: string | React.ReactNode;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  onNavBack?: () => void;
};

const Nav = (props: NavProps) => {
  function renderTitle() {
    if (typeof props.title === 'string') {
      return (
        <Typo.Title
          className={classnames(styles['nav-title'], props.titleClassName)}
          style={props.titleStyle}
        >
          {props.title}
        </Typo.Title>
      );
    }
    // custom title ReactNode
    return props.title;
  }
  return (
    <nav
      className={classnames(styles['nav'], props.className)}
      style={props.style}
    >
      <Icon
        className={styles['icon-back']}
        icon={<IconNavArrow />}
        onClick={props.onNavBack}
      />
      {renderTitle()}
    </nav>
  );
};

export default Nav;
