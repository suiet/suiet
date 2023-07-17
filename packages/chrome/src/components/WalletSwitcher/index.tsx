import { useState } from 'react';
import Typo from '../Typo';
import styles from './index.module.scss';
import classnames from 'classnames';
import Button from '../Button';
import { Icon, IconContainer } from '../icons';
import { ReactComponent as IconEdit } from '../../assets/icons/edit.svg';
import { createPortal } from 'react-dom';
import { sleep } from '../../utils/time';
import Address from '../Address';
import Avatar from '../Avatar';
import { AvatarPfp } from '@suiet/core';
import { ReactComponent as IconSettings } from '../../assets/icons/settings.svg';

export type WalletData = {
  id: string;
  name: string;
  accountId: string;
  accountAddress: string;
  avatar: string | undefined;
  isImportedWallet: boolean;
  avatarPfp: AvatarPfp | undefined;
};

type WalletItemProps = {
  data: WalletData;
  onClick: (id: string, data: WalletData) => void;
  onEdit: (id: string, data: WalletData) => void;
  onDelete: (id: string, data: WalletData) => void;
};

const WalletItem = (props: WalletItemProps) => {
  const { data } = props;
  return (
    <div
      className={classnames(styles['wallet-item'], 'flex items-center w-full')}
    >
      <div
        className={classnames('flex items-center w-full ml-[12px]')}
        onClick={() => props?.onClick && props.onClick(data.id, data)}
      >
        <Avatar
          className="shrink-0"
          model={data.avatar}
          size={'sm'}
          pfp={data?.avatarPfp}
        ></Avatar>
        <div className={'ml-[8px] max-w-[176px]'}>
          <div className="flex items-center gap-2">
            <Typo.Title
              className={classnames(
                styles['wallet-item-name'],
                'text-ellipsis whitespace-nowrap shrink grow overflow-hidden'
              )}
            >
              {data.name}
            </Typo.Title>
            {data.isImportedWallet && (
              <div className="-my-[1px] px-[6px] py-[1px] shrink-0 text-small grow-0 text-gray-400 border border-gray-200 rounded-xl">
                imported
              </div>
            )}
          </div>

          <Address
            value={data.accountAddress}
            hideCopy={true}
            disableCopy={true}
            textClassName={styles['wallet-item-address']}
          />
        </div>
      </div>

      <Icon
        className={classnames(
          styles['icon'],
          'absolute cursor-pointer transition backdrop-blur-sm bg-white/[0.3] right-[48px] hover:bg-white/[0.6] rounded-lg'
        )}
        icon={<IconEdit />}
        onClick={(e) => {
          e.stopPropagation();
          props?.onEdit && props.onEdit(data.id, data);
        }}
      />

      <Icon
        icon={'Trash'}
        // stroke={'#f04438'}
        elClassName="transition-all w-[16px] h-[16px] stroke-gray-500 hover:stroke-[#f04438]"
        className={classnames(
          styles['icon'],
          'absolute cursor-pointer transition backdrop-blur-sm bg-white/[0.3] hover:bg-white/[0.6] rounded-lg right-[22px] stroke-zinc-100 hover:stroke-[#f04438]'
        )}
        onClick={(e) => {
          e.stopPropagation();
          props?.onDelete && props.onDelete(data.id, data);
        }}
      />
    </div>
  );
};

export type WalletSwitcherProps = {
  wallets: WalletData[];
  onSelect: (id: string, wallet: WalletData) => void;
  onEdit: (id: string, wallet: WalletData) => void;
  onDelete: (id: string, wallet: WalletData) => void;
  onClickLayer?: () => void;
  onClickNew?: () => void;
  onClickImport?: () => void;
  onClickSettings?: () => void;
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
            <div>
              <Typo.Title className={styles['header-title']}>Suiet</Typo.Title>
              <Typo.Small
                className={classnames(styles['header-desc'], 'mt-[2px]')}
              >
                {wallets.length} Wallets
              </Typo.Small>
            </div>

            <IconContainer
              className={'cursor-pointer hover:bg-gray-200 transition-colors'}
              color={'transparent'}
              onClick={props.onClickSettings}
            >
              <IconSettings width={20} height={20} stroke={'#7D89B0'} />
            </IconContainer>
          </header>
          <section
            className={classnames(styles['wallet-item-container'], 'mt-[20px]')}
          >
            {wallets.map((data) => (
              <WalletItem
                key={data.id}
                data={data}
                onClick={props.onSelect}
                onEdit={props.onEdit}
                onDelete={props.onDelete}
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
