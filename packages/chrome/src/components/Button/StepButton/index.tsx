import Button, { ButtonProps } from '../index';
import { Icon } from '../../icons';
import { ReactComponent as IconStepArrow } from '../../../assets/icons/step-arrow.svg';
import classnames from 'classnames';
import styles from './index.module.scss';

const StepButton = (props: ButtonProps) => {
  const { children, className, ...restProps } = props;
  return (
    <Button
      {...restProps}
      className={classnames(styles['step-button'], className)}
    >
      {children}
      <Icon icon={<IconStepArrow />} />
    </Button>
  );
};

export default StepButton;
