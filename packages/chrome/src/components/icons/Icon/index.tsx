import React, {
  CSSProperties,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react';
import { Extendable } from '../../../types';

import * as imgs from './imgs';
import { nftImgUrl } from '../../../utils/nft';
import classNames from 'classnames';
import Image from '../../Img';

export type IconProps = Extendable & {
  icon: AvailableIcon | ReactNode;
  alt?: string;
  onClick?: () => void;
  elClassName?: string;
  elStyle?: CSSProperties;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
};

export type AvailableIcon =
  | 'Add'
  | 'Up'
  | 'Down'
  | 'Txn'
  | 'Mint'
  | 'Swap'
  | 'Coin'
  | 'Object'
  | 'Sui'
  | 'History'
  | 'Close'
  | 'HashTag'
  | 'Time'
  | 'Wallet'
  | 'Copy';

export type IconType = AvailableIcon | 'ReactNode' | 'External' | 'Unknown';
const iconMap = new Map<AvailableIcon, ElementType>(
  Object.entries(imgs) as any
);

export function isExternalIcon(icon: string): boolean {
  return icon.startsWith('http') || icon.startsWith('data:image');
}

export function iconType(icon: string | ReactNode): IconType {
  if (!icon) return 'Unknown';
  if (typeof icon !== 'string') return 'ReactNode';
  if (isExternalIcon(icon)) return 'External';
  if (iconMap.has(icon as AvailableIcon)) return icon as AvailableIcon;
  return 'Unknown';
}

/**
 * Support built-in icons, remote url and ReactNode
 * with the essential dom properties: onClick, className, style...
 * @constructor
 */
const Icon = (props: IconProps) => {
  const { icon, alt = 'icon' } = props;

  const renderIcon = () => {
    switch (iconType(icon)) {
      case 'Unknown':
        return null;
      case 'ReactNode':
        return React.cloneElement(icon as ReactElement, {
          className: props.elClassName,
          style: props.elStyle,
        });
      case 'External':
        return (
          <Image
            src={nftImgUrl(icon as string) as string}
            alt={alt}
            className={classNames('w-[36px] h-[36px]', props.elClassName)}
            style={props.elStyle}
          />
        );
      default:
        const IconReactNode: any = iconMap.get(icon as AvailableIcon) ?? <></>;
        return (
          <IconReactNode
            className={props.elClassName}
            style={Object.assign(
              {
                width: props.width,
                height: props.height,
                stroke: props.stroke,
                fill: props.fill,
                strokeWidth: props.strokeWidth,
              },
              props.elStyle
            )}
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

export default Icon;
