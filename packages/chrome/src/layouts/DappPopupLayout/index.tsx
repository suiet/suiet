import Avatar, { withFavicon } from '../../components/Avatar';
import HyperLink from '../../components/HyperLink';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import Button from '../../components/Button';
import { Extendable } from '../../types';
import classnames from 'classnames';
import WalletSelector from '../../pages/dapp/WalletSelector';

export type DappPopupLayoutProps = Extendable & {
  originTitle: string;
  originUrl: string;
  desc?: string;
  avatarMode?: string;
  favicon?: string;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const DappPopupLayout = (props: DappPopupLayoutProps) => {
  const {
    originTitle = 'Origin Title',
    loading = false,
    okText = 'OK',
    cancelText = 'Cancel',
  } = props;
  return (
    <div className={styles['container']}>
      <div className={styles['content']}>
        <header className={styles['header']}>
          {withFavicon(<Avatar model={props.avatarMode} />, {
            src: props.favicon ?? '',
            alt: props.originTitle ?? 'origin',
          })}
          <HyperLink url={props.originUrl} className={'mt-[16px]'} />
          <Typo.Title
            ellipsis={true}
            className={classnames(styles['header__title'], 'mt-[4px]')}
          >
            {originTitle}
          </Typo.Title>
          {props.desc && (
            <Typo.Normal className={styles['header__desc']}>
              {props.desc}
            </Typo.Normal>
          )}
        </header>
        <WalletSelector className={'mx-[32px] mt-[10px]'} />
        <main className={styles['main']}>{props.children}</main>
      </div>

      <footer className={styles['footer']}>
        <Button state={'danger'} disabled={loading} onClick={props.onCancel}>
          {cancelText}
        </Button>
        <Button
          state={'primary'}
          className={'ml-[8px]'}
          loading={loading}
          onClick={props.onOk}
        >
          {okText}
        </Button>
      </footer>
    </div>
  );
};

export default DappPopupLayout;
