import styles from './index.module.scss';
import classNames from 'classnames';
import { Extendable } from '../../../types';

export type IconContainerProps = Extendable & {
  shape?: 'circle' | 'square';
  color?: 'gray' | 'blue' | 'purple';
};

const IconContainer = (props: IconContainerProps) => {
  const { shape = 'square', color = 'blue' } = props;
  return (
    <div
      className={classNames(
        styles['icon-container'],
        styles[`icon-container--${shape}`],
        styles[`icon-container--${color}`],
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export default IconContainer;
