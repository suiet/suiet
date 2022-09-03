import styles from './index.module.scss';
import classnames from 'classnames';
import { Extendable } from '../../types';

export type AvatarProps = Extendable & {
  size?: 'normal' | 'large';
  model?: 1 | 2 | 3 | 4;
};

const Avatar = (props: AvatarProps) => {
  const { size = 'normal', model = 1 } = props;
  return (
    <div
      className={classnames(styles['avatar'], [
        styles[`avatar-size--${size}`],
        styles[`avatar-model--${model}`],
        props.className,
      ])}
      style={props.style}
    ></div>
  );
};

export default Avatar;
