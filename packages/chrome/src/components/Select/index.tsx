import * as RadixSelect from '@radix-ui/react-select';
import classnames from 'classnames';
import React, { useState } from 'react';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import { Extendable } from '../../types';
export type SelectProps = Extendable & {
  value?: any;
  onValueChange: (value: any) => void;
  defualtValue?: any;
};
export type SelectItemProps = Extendable & {
  className?: any;
  value: any;
};

export const SelectItem = (props: SelectItemProps) => (
  <RadixSelect.Item
    className={classnames(
      'px-[16px] cursor-pointer py-[10px] font-medium text-gray-600 transition bg-white hover:bg-gray-100 rounded-[12px]',
      props.className
    )}
    {...props}
  >
    <RadixSelect.ItemText>{props.children}</RadixSelect.ItemText>
  </RadixSelect.Item>
);

export const Select = (props: SelectProps) => (
  <RadixSelect.Root
    defaultValue={props.defualtValue}
    onValueChange={props.onValueChange}
  >
    <RadixSelect.Trigger className="flex gap-2 items-center text-gray-600 font-medium text-medium mb-4">
      <RadixSelect.Value className="" />
      <RadixSelect.Icon className="SelectIcon">
        <ChevronDownIcon />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
    <RadixSelect.Portal className="bg-white rounded-[14px] border border-gray-100 shadow-lg shadow-zinc-200">
      <RadixSelect.Content className="p-1" position="popper" sideOffset={12}>
        <RadixSelect.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="SelectViewport">
          <RadixSelect.Group>{props.children}</RadixSelect.Group>
        </RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="SelectScrollButton">
          {/* <ChevronDownIcon /> */}
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  </RadixSelect.Root>
);

export default Select;
