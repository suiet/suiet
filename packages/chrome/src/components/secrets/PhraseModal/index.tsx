import { Extendable } from '../../../types';
import classnames from 'classnames';
import styles from './index.module.scss';
import copy from 'copy-to-clipboard';
import message from '../../message';
import SecretModal from '../SecretModal';

export type PhraseModalProps = Extendable & {
  phrases: string[];
  trigger: JSX.Element;
  title?: string;
  onOpenChange?: () => void;
};

const PhraseModal = (props: PhraseModalProps) => {
  const { phrases = [], title = 'Recovery Phrases' } = props;
  return (
    <SecretModal
      title={title}
      trigger={props.trigger}
      onOpenChange={props.onOpenChange}
      onCopy={() => {
        copy(phrases.join(' '));
        message.success('Copied');
      }}
    >
      <div className={styles['container']}>
        {phrases.slice(0, 12).map((text, index) => (
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
