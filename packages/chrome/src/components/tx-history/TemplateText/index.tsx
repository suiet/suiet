import { Extendable } from '../../../types';
import Address from '../../Address';
import Typo from '../../Typo';
import { ellipsis } from '@suiet/core';
import { Icon } from '../../icons';
import classNames from 'classnames';
import CopyIcon from '../../CopyIcon';
import Message from '../../message';

export type TemplateTextType =
  | 'text'
  | 'address'
  | 'ellipsis'
  | 'timestamp'
  | 'history';

export type TemplateTextProps = Extendable & {
  type?: TemplateTextType;
  value: string;
};

const TemplateText = (props: TemplateTextProps) => {
  const { type = 'text' } = props;
  switch (type) {
    case 'address':
      return (
        <Address
          value={props.value}
          className={props.className}
          style={props.style}
        />
      );
    case 'ellipsis':
      return (
        <Typo.Normal
          className={classNames('flex items-center', props.className)}
          style={props.style}
        >
          {ellipsis(props.value)}
          <CopyIcon
            className={'ml-[8px]'}
            copyStr={props.value}
            onCopied={() => {
              Message.success('Copied');
            }}
          />
        </Typo.Normal>
      );
    case 'timestamp':
      return (
        <Typo.Normal className={props.className} style={props.style}>
          {new Date(Number(props.value)).toLocaleString()}
        </Typo.Normal>
      );
    case 'history':
      return (
        <Typo.Small
          className={classNames('flex items-center', props.className)}
        >
          <Icon icon={'History'} className={'mr-[4px]'} />
          {props.value}
        </Typo.Small>
      );
    default:
      return (
        <Typo.Normal className={props.className} style={props.style}>
          {props.value}
        </Typo.Normal>
      );
  }
};

export default TemplateText;
