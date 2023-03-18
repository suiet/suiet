import Avatar, { withFavicon } from '../../components/Avatar';
import HyperLink from '../../components/HyperLink';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import Button, { ButtonState } from '../../components/Button';
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
  showOk?: boolean;
  cancelText?: string;
  cancelState?: ButtonState;
  onOk?: () => void;
  onCancel?: () => void;
};

const DappPopupLayout = (props: DappPopupLayoutProps) => {
  const {
    originTitle = 'Origin Title',
    loading = false,
    okText = 'OK',
    cancelText = 'Cancel',
    cancelState = 'danger',
    showOk = true,
  } = props;
  return (
    <div className={styles['container']}>
      <div className={classnames(styles['content'], 'no-scrollbar')}>
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
        <main className={classnames(styles['main'], 'no-scrollbar')}>
          {props.children}
        </main>
      </div>

      <footer className={styles['footer']}>
        <Button state={cancelState} disabled={loading} onClick={props.onCancel}>
          {cancelText}
        </Button>
        {showOk && (
          <Button
            state={'primary'}
            className={'ml-[8px]'}
            disabled={loading}
            onClick={props.onOk}
          >
            {okText}
          </Button>
        )}
      </footer>
    </div>
  );
};

export default DappPopupLayout;
