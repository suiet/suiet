import { Extendable } from '../../types';
import styles from './index.module.scss';
import classnames from 'classnames';

export type SlideWindowProps = Extendable & {};

const SlideWindow = (props: SlideWindowProps) => {
  return (
    <div
      className={classnames(
        styles['slide-window'],
        'scrollbar',
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
export default SlideWindow;
