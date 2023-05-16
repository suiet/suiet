import { Extendable } from '../../../types';
import { IconContainerProps } from '../../../components/icons/IconContainer';
import { IconProps, isExternalIcon } from '../../../components/icons/Icon';
import React, { ElementType, ReactNode } from 'react';
import * as icons from './icons';
import { Icon, IconContainer } from '../../../components/icons';

// An extension of AvailableIcon from the common icon module
// The difference is that all icons here are wrapped by its predefined background
// And is status-aware (e.g. TxnError, TxnSuccess)
export type TemplateIconType =
  | 'Txn'
  | 'TxnError'
  | 'TxnSuccess'
  | 'Coin'
  | 'Sui'
  | 'Object';

export type TemplateIconProps = Extendable & {
  containerProps?: IconContainerProps;
  iconProps?: Omit<IconProps, 'icon'>;
};

const iconMap = new Map<TemplateIconType, ElementType>(
  Object.entries(icons) as any
);

type IconType = TemplateIconType | 'ReactNode' | 'External' | 'Unknown';
function iconType(icon: string | ReactNode): IconType {
  if (!icon) return 'Unknown';
  if (typeof icon !== 'string') return 'ReactNode';
  if (isExternalIcon(icon)) return 'External';
  if (iconMap.has(icon as TemplateIconType)) return icon as TemplateIconType;
  return 'Unknown';
}

const TemplateIcon = (
  props: TemplateIconProps & {
    icon: TemplateIconType | string;
    onClick?: () => void;
  }
) => {
  const { icon } = props;

  const renderIcon = () => {
    switch (iconType(icon)) {
      case 'Unknown':
        return (
          <IconContainer
            shape={'square'}
            color={'gray'}
            {...props.containerProps}
          >
            <Icon icon={'Object'} {...props.iconProps} />
          </IconContainer>
        );
      case 'ReactNode':
      case 'External':
        return (
          <IconContainer
            shape={'square'}
            color={'transparent'}
            {...props.containerProps}
          >
            <Icon icon={icon} {...props.iconProps} />
          </IconContainer>
        );
      default:
        const IconReactNode: any = iconMap.get(
          icon as TemplateIconType
        ) as ReactNode;
        return (
          <IconReactNode
            containerProps={props.containerProps}
            iconProps={props.iconProps}
          />
        );
    }
  };

  return (
    <div
      onClick={props.onClick}
      className={props.className}
      style={props.style}
    >
      {renderIcon()}
    </div>
  );
};

export default TemplateIcon;
