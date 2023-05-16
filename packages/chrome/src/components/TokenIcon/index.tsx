import { Extendable } from '../../types';
import { CSSProperties, ReactNode } from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';
import Img from '../Img';

type Size = 'normal' | 'small' | 'large';

export type TokenIconProps = Extendable & {
  icon: string | ReactNode;
  size?: Size;
  alt?: string;
  elClassName?: string;
  elStyle?: CSSProperties;
};

const TokenIcon = (props: TokenIconProps) => {
  const { size = 'normal', icon } = props;
  return (
    <div
      className={classnames(
        styles['icon-wrap'],
        { [styles[`icon-wrap--${size}`]]: size !== 'normal' },
        props.className
      )}
      style={props.style}
    >
      {typeof icon === 'string' ? (
        <Img
          src={icon}
          alt={props.alt ?? 'icon'}
          className={classnames(
            styles['icon'],
            { [styles[`icon--${size}`]]: size !== 'normal' },
            props.elClassName
          )}
          style={props.elStyle}
        />
      ) : (
        icon
      )}
    </div>
  );
};

export default TokenIcon;
