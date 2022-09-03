import React, { CSSProperties } from 'react';
import Typo from '../Typo';
import CopyIcon from '../CopyIcon';
import copy from 'copy-to-clipboard';
import toast from '../toast';
import { Extendable } from '../../types';
import classnames from 'classnames';
import { addressEllipsis } from '../../utils/format';

export type AddressProps = Extendable & {
  value: string;
  ellipsis?: boolean;
  hideCopy?: boolean;
  textClassName?: string;
  textStyle?: CSSProperties;
  copyClassName?: string;
  copyStyle?: CSSProperties;
};

const Address = (props: AddressProps) => {
  const { ellipsis = true, hideCopy = false } = props;
  return (
    <div
      className={classnames(
        'flex items-center',
        {
          'cursor-pointer': !hideCopy,
        },
        props.className
      )}
      style={props.style}
      onClick={() => {
        if (hideCopy) return;
        copy(props.value);
        toast.success('Copied Address');
      }}
    >
      <Typo.Small className={props.textClassName} style={props.textStyle}>
        {ellipsis ? addressEllipsis(props.value) : props.value}
      </Typo.Small>
      {!hideCopy && (
        <CopyIcon
          className={classnames('ml-[5px]', props.copyClassName)}
          style={props.copyStyle}
        />
      )}
    </div>
  );
};

export default Address;
