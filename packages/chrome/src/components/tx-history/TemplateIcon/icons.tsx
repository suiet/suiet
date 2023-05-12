import { Icon, IconContainer } from '../../../components/icons';
import { TemplateIconProps } from './index';

export const Sui = (props: TemplateIconProps) => {
  return (
    <IconContainer shape={'circle'} color={'blue'} {...props.containerProps}>
      <Icon icon={'Sui'} {...props.iconProps} />
    </IconContainer>
  );
};

export const Coin = (props: TemplateIconProps) => {
  return (
    <IconContainer shape={'circle'} color={'purple'} {...props.containerProps}>
      <Icon icon={'Coin'} {...props.iconProps} />
    </IconContainer>
  );
};

export const Txn = (props: TemplateIconProps) => {
  return (
    <IconContainer color={'gray'} {...props.containerProps}>
      <Icon icon={'Txn'} {...props.iconProps} />
    </IconContainer>
  );
};

export const TxnError = (props: TemplateIconProps) => {
  return (
    <IconContainer
      color={'bg-error-100'}
      shape={'circle'}
      {...props.containerProps}
    >
      <Icon icon={'Close'} stroke={'#d92d20'} {...props.iconProps} />
    </IconContainer>
  );
};

export const TxnSuccess = (props: TemplateIconProps) => {
  return (
    <IconContainer
      color={'bg-blue-50'}
      shape={'circle'}
      {...props.containerProps}
    >
      <Icon icon={'Txn'} stroke={'#0096FF'} {...props.iconProps} />
    </IconContainer>
  );
};

export const Object = (props: TemplateIconProps) => {
  return (
    <IconContainer color={'gray'} shape={'square'} {...props.containerProps}>
      <Icon icon={'Object'} {...props.iconProps} />
    </IconContainer>
  );
};
