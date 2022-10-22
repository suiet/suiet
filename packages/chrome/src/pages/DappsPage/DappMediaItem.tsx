import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import { Extendable } from '../../types';
import ReactSkeleton from 'react-loading-skeleton';

export type DappMediaItemProps = Extendable & {
  name: string;
  icon: string;
  desc: string;
  link: string;
};

const DappMediaItem = (props: DappMediaItemProps) => {
  return (
    <div
      className={classnames(styles['dapp-media-item'], props.className)}
      onClick={() => {
        if (!props.link) return;
        chrome.tabs.create({ url: props.link });
      }}
    >
      <div className={styles['dapp-media-item__img-wrap']}>
        <img
          src={props.icon}
          alt="icon"
          className={styles['dapp-media-item__img']}
        />
      </div>
      <div className={'ml-[24px] w-[220px]'}>
        <Typo.Title className={styles['dapp-media-item__name']}>
          {props.name}
        </Typo.Title>
        <Typo.Normal className={styles['dapp-media-item__desc']}>
          {props.desc}
        </Typo.Normal>
      </div>
    </div>
  );
};

export const Skeleton = (props: Extendable) => {
  return (
    <div className={classnames(styles['dapp-media-item'], props.className)}>
      <ReactSkeleton className={styles['dapp-media-item__img-wrap']} />
      <div className={'ml-[24px] w-[220px]'}>
        <ReactSkeleton height={'12px'} />
        <ReactSkeleton height={'12px'} />
      </div>
    </div>
  );
};

export default DappMediaItem;
