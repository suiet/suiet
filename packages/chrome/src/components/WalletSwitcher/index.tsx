import React, {useState} from 'react';
import Typo from '../Typo';
import styles from './index.module.scss';
import classnames from "classnames";
import Button from "../Button";
import Icon from "../Icon";
import {ReactComponent as IconEdit} from '../../assets/icons/edit.svg';
import {createPortal} from "react-dom";
import {sleep} from "../../utils/time";

const WalletItem = () => {
  return (
    <div className={styles['wallet-item']}>
      <div className={styles['wallet-item-avatar']}></div>
      <div className={'ml-[8px]'}>
        <Typo.Title className={styles['wallet-item-name']}>
          Wallet $1
        </Typo.Title>
        <Typo.Small className={styles['wallet-item-address']}>
          0x2152f....01f6
        </Typo.Small>
      </div>
      <Icon className={classnames(
        styles['icon'],
        'ml-auto'
      )} icon={<IconEdit />} />
    </div>
  )
}

export type WalletSwitcherProps = {
  onClickLayer?: () => void;
}

const WalletSwitcher = (props: WalletSwitcherProps) => {
  const [leaving, setLeaving] = useState(false);

  function renderSwitcher() {
    return (
      <div
        className={classnames(
          styles['switcher-layer'],
          leaving ? [styles['switcher-layer--move-out']] : [styles['switcher-layer--move-in']]
        )}
        onClick={async () => {
          setLeaving(true);
          await sleep(300);  // wait until the leaving animation played
          if (props.onClickLayer) {
            props.onClickLayer();
          }
        }}
      >
        <div className={classnames(
          styles['switcher'],
          leaving ? [styles['switcher--move-out']] : [styles['switcher--move-in']]
        )}>
          <header className={styles['header']}>
            <Typo.Title className={styles['header-title']}>Suiet</Typo.Title>
            <Typo.Small className={
              classnames(
                styles['header-desc'],
                'mt-[2px]',
              )
            }>4 Wallets</Typo.Small>
          </header>
          <section className={classnames(
            styles['wallet-item-container'],
            'mt-[20px]'
          )}>
            <WalletItem />
            <WalletItem />
            <WalletItem />
          </section>
          <section className={styles['actions']}>
            <Button className={styles['btn']} state={'primary'}>New</Button>
            <Button className={styles['btn']}>Import</Button>
          </section>
        </div>
      </div>
    )
  }
  return createPortal(
    renderSwitcher(),
    document.body,
  );
};

export default WalletSwitcher;