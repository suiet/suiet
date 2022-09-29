import { Extendable } from '../../../types';
import Modal from '../../Modal';
import Button from '../../Button';
import styles from './index.module.scss';

export type SecretModalProps = Extendable & {
  trigger: JSX.Element;
  title?: string;
  onOpenChange?: () => void;
  onCopy?: () => void;
};

const SecretModal = (props: SecretModalProps) => {
  const { title = 'Title' } = props;
  return (
    <Modal
      title={title}
      trigger={props.trigger}
      onOpenChange={props.onOpenChange}
    >
      <div className={styles['container']}>{props.children}</div>
      <Button state={'primary'} className={'mt-[16px]'} onClick={props.onCopy}>
        Copy
      </Button>
    </Modal>
  );
};

export default SecretModal;
