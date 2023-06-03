import { Extendable } from '../../../types';
import classNames from 'classnames';
import styles from './index.module.scss';
import { ObjectChangeItem } from '../../AssetChange';
import { ObjectChangeItemProps } from '../../AssetChange/ObjectChangeItem';

export type TxSummaryItemProps = ObjectChangeItemProps & {};

const TxSummaryItem = (props: TxSummaryItemProps & Extendable) => {
  return (
    <div
      className={classNames(
        styles['tx-summary-item'],
        'px-[16px] py-[8px]',
        props.className
      )}
    >
      <ObjectChangeItem
        title={props.title}
        desc={props.desc}
        descType={props.descType}
        changeTitle={props.changeTitle}
        changeTitleColor={props.changeTitleColor}
        changeDesc={props.changeDesc}
        changeDescType={props.changeDescType}
        changeDescIcon={props.changeDescIcon}
        changeDescColor={props.changeDescColor}
        icon={props.icon}
        iconShape={props.iconShape}
        iconContainerColor={props.iconContainerColor}
        iconContainerClassName={'z-[1]'}
      />
    </div>
  );
};

export default TxSummaryItem;
