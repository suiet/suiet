import styles from './index.module.scss';
import { Extendable } from '../../types';
import classnames from 'classnames';

export type AlertProps = Extendable & {
  type?: 'default' | 'warning';
};

const Alert = (props: AlertProps) => {
  const { type = 'default' } = props;
  return (
    <div
      className={classnames(
        styles['alert'],
        styles[`alert--${type}`],
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export default Alert;
