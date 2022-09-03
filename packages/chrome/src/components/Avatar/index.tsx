import styles from './index.module.scss';
import classnames from 'classnames';
import { Extendable } from '../../types';

export type AvatarProps = Extendable & {
  size?: 'md' | 'lg' | 'sm';
  model?: number | string;
};

const Avatar = (props: AvatarProps) => {
  const { size = 'md' } = props;
  let _model = Number(props.model);
  _model = _model >= 1 && _model <= 4 ? _model : 1;

  return (
    <div
      className={classnames(styles['avatar'], [
        styles[`avatar-size--${size}`],
        styles[`avatar-model--${_model}`],
        props.className,
      ])}
      style={props.style}
    ></div>
  );
};

export default Avatar;
