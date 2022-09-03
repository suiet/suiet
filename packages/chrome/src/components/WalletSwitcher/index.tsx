import React, { useState } from 'react';
import Typo from '../Typo';
import styles from './index.module.scss';
import classnames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import { ReactComponent as IconEdit } from '../../assets/icons/edit.svg';
import { createPortal } from 'react-dom';
import { sleep } from '../../utils/time';
import { addressEllipsis } from '../../utils/format';
import Address from '../Address';
import Avatar from '../Avatar';

export type WalletData = {
  id: string;
  name: string;
  accountId: string;
  accountAddress: string;
  avatar: string | undefined;
};

type WalletItemProps = {
  data: WalletData;
  onClick: (id: string, data: WalletData) => void;
};

const WalletItem = (props: WalletItemProps) => {
  const { data } = props;
  return (
    <div
      className={classnames(styles['wallet-item'])}
      onClick={() => {
        props.onClick(data.id, data);
      }}
    >
      <Avatar model={data.avatar} size={'sm'}></Avatar>
      <div className={'ml-[8px]'}>
        <Typo.Title className={styles['wallet-item-name']}>
          {data.name}
        </Typo.Title>
        <Address
          value={data.accountAddress}
          hideCopy={true}
          textClassName={styles['wallet-item-address']}
        />
      </div>

      <Icon
        className={classnames(styles['icon'], 'ml-auto')}
        icon={<IconEdit />}
      />
    </div>
  );
};

export type WalletSwitcherProps = {
  wallets: WalletData[];
  onSelect: (id: string, wallet: WalletData) => void;
  onClickLayer?: () => void;
  onClickNew?: () => void;
  onClickImport?: () => void;
};

const WalletSwitcher = (props: WalletSwitcherProps) => {
  const [leaving, setLeaving] = useState(false);

  const { wallets = [] } = props;

  function renderSwitcher() {
    return (
      <div
        className={classnames(
          styles['switcher-layer'],
          leaving
            ? [styles['switcher-layer--move-out']]
            : [styles['switcher-layer--move-in']]
        )}
        onClick={async () => {
          setLeaving(true);
          await sleep(300); // wait until the leaving animation played
          if (props.onClickLayer) {
            props.onClickLayer();
          }
        }}
      >
        <div
          className={classnames(
            styles['switcher'],
            leaving
              ? [styles['switcher--move-out']]
              : [styles['switcher--move-in']]
          )}
        >
          <header className={styles['header']}>
            <Typo.Title className={styles['header-title']}>Suiet</Typo.Title>
            <Typo.Small
              className={classnames(styles['header-desc'], 'mt-[2px]')}
            >
              {wallets.length} Wallets
            </Typo.Small>
          </header>
          <section
            className={classnames(styles['wallet-item-container'], 'mt-[20px]')}
          >
            {wallets.map((data) => (
              <WalletItem
                key={data.id}
                data={data}
                onClick={(id, data) => {
                  if (props.onSelect) props.onSelect(id, data);
                }}
              />
            ))}
          </section>
          <section className={styles['actions']}>
            <Button
              className={styles['btn']}
              state={'primary'}
              onClick={props.onClickNew}
            >
              New
            </Button>
            <Button className={styles['btn']} onClick={props.onClickImport}>
              Import
            </Button>
          </section>
        </div>
      </div>
    );
  }
  return createPortal(renderSwitcher(), document.body);
};

export default WalletSwitcher;
