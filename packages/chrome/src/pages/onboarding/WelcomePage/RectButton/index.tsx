import classnames from 'classnames';
import styles from './index.module.scss';
import { Extendable } from '../../../../types';
import { ReactComponent as PlusPrimary } from '../../../../assets/icons/plus-primary.svg';
import { ReactComponent as PlusSecondary } from '../../../../assets/icons/plus-secondary.svg';
import Icon from '../../../../components/Icon';

export type RectButtonProps = Extendable & {
  theme?: 'primary' | 'default';
  to?: string;
  onClick?: () => void;
};

const RectButton = (props: RectButtonProps) => {
  const { theme = 'default' } = props;

  return (
    <button
      onClick={props.onClick}
      className={classnames(
        styles['rect-btn'],
        styles[`rect-btn--${theme}`],
        props.className
      )}
    >
      {theme === 'primary' ? (
        <Icon icon={<PlusPrimary />} />
      ) : (
        <Icon icon={<PlusSecondary />} />
      )}
      {props.children}
    </button>
  );
};

export default RectButton;
