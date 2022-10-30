import { Extendable, OmitToken } from '../../../types';
import styles from './index.module.scss';
import copy from 'copy-to-clipboard';
import message from '../../message';
import SecretModal from '../SecretModal';
import { useState } from 'react';
import PasswordConfirmModal from '../PasswordConfirmModal';
import { RevealMnemonicParams } from '@suiet/core';
import { useApiClient } from '../../../hooks/useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export type PhraseModalProps = Extendable & {
  trigger: JSX.Element;
  title?: string;
  onOpenChange?: () => void;
};

const PhraseModal = (props: PhraseModalProps) => {
  const { title = 'Private Key' } = props;
  const apiClient = useApiClient();
  const { walletId } = useSelector((state: RootState) => state.appContext);
  const [privateKey, setPrivate] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isConfirmed) {
    return (
      <PasswordConfirmModal
        trigger={props.trigger}
        actionDesc={
          'You are now confirming to show the private key of your account . Please enter password to confirm the action.'
        }
        onConfirm={async () => {
          setIsConfirmed(true);

          const privateKey = await apiClient.callFunc<
            OmitToken<RevealMnemonicParams>,
            string
          >(
            'wallet.revealPrivate',
            {
              walletId,
            },
            { withAuth: true }
          );
          setPrivate(privateKey);
        }}
      />
    );
  }
  return (
    <SecretModal
      title={title}
      defaultOpen={true}
      onOpenChange={() => {
        setIsConfirmed(false); // reset
      }}
      onCopy={() => {
        copy(privateKey);
        message.success('Copied');
      }}
    >
      <div className={styles['container']}>{privateKey}</div>
    </SecretModal>
  );
};

export default PhraseModal;
