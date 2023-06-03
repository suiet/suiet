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
  const { title = 'Recovery Phrases' } = props;
  const apiClient = useApiClient();
  const { walletId } = useSelector((state: RootState) => state.appContext);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isConfirmed) {
    return (
      <PasswordConfirmModal
        title={'Show Recovery Phrases'}
        trigger={props.trigger}
        actionDesc={
          'You are now confirming to show the recovery phrases of your account. Please enter password to confirm the action.'
        }
        onConfirm={async () => {
          setIsConfirmed(true);

          const rawPhrases = await apiClient.callFunc<
            OmitToken<RevealMnemonicParams>,
            string
          >(
            'wallet.revealMnemonic',
            {
              walletId,
            },
            { withAuth: true }
          );
          setPhrases(rawPhrases.split(' '));
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
        setPhrases([]);
      }}
      onCopy={() => {
        copy(phrases.join(' '));
        message.success('Copied');
      }}
    >
      <div className={styles['container']}>
        {phrases.map((text, index) => (
          <div key={text}>
            <span className="inline-block text-gray-300 text-right select-none">
              {index + 1}
            </span>
            <span className="ml-2">{text}</span>
          </div>
        ))}
      </div>
    </SecretModal>
  );
};

export default PhraseModal;
