import Typo from '../../Typo';
import { Extendable } from '../../../types';
import classNames from 'classnames';
import styles from './index.module.scss';

export type TxDateContainerProps = Extendable & {
  title: string;
};

const TxDateContainer = (props: TxDateContainerProps) => {
  const { title = 'Unknown Date' } = props;
  return (
    <section
      className={classNames(styles['tx-date-container'], props.className)}
    >
      <div
        className={classNames('px-[16px] py-[8px] sticky top-0 bg-white z-10')}
      >
        <Typo.Normal className={'text-gray-900 font-bold'}>{title}</Typo.Normal>
      </div>
      <div className={'pt-[8px] pb-[32px]'}>{props.children}</div>
    </section>
  );
};

export default TxDateContainer;
