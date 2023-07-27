import classNames from 'classnames';
import styles from './index.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Extendable } from '../../../types';

export type ObjectChangeSkeletonProps = Extendable & {};

export const ObjectChangeSkeleton = (props: ObjectChangeSkeletonProps) => {
  return (
    <div
      className={classNames(
        'flex',
        'items-center',
        styles['object-change-item'],
        props.className
      )}
    >
      <Skeleton className={'w-[36px] h-[36px] rounded-[8px]'} />
      <div className={'ml-[16px]'}>
        <Skeleton className={'w-[64px] h-[16px]'} />
        <Skeleton className={'w-[110px] h-[16px]'} />
      </div>
      <div className={'ml-auto'}>
        <Skeleton className={'w-[80px] h-[16px]'} />
      </div>
    </div>
  );
};
