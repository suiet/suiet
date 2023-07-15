import React from 'react';
import * as SelectCompoment from '@radix-ui/react-select';
import classnames from 'classnames';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import { Extendable } from '../../types';

type SelectProps = Extendable & {
  defaultValue: string;
};

export function Select(props: SelectProps) {
  return (
    <SelectCompoment.Root defaultValue={props.defaultValue}>
      <SelectCompoment.Trigger className="flex items-center" aria-label="Food">
        <SelectCompoment.Value placeholder="Select a coin" />
        <SelectCompoment.Icon className="SelectIcon">
          <ChevronDownIcon />
        </SelectCompoment.Icon>
      </SelectCompoment.Trigger>
      <SelectCompoment.Portal className="fixed bottom-0 left-0 right-0 bg-white w-full p-4 pb-8 shadow-lg">
        <SelectCompoment.Content className="SelectContent">
          <h2 className="font-xl font-medium mx-auto"> Select a Coin </h2>
          <SelectCompoment.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </SelectCompoment.ScrollUpButton>
          <SelectCompoment.Viewport className="SelectViewport">
            {props.children}
          </SelectCompoment.Viewport>
          <SelectCompoment.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </SelectCompoment.ScrollDownButton>
        </SelectCompoment.Content>
      </SelectCompoment.Portal>
    </SelectCompoment.Root>
  );
}

type SelectItemProps = Extendable & {
  value: string;
};
export function SelectItem(props: SelectItemProps) {
  return (
    <SelectCompoment.Item
      className={classnames('SelectItem', props.className)}
      {...props}
    >
      <SelectCompoment.ItemText>{props.children}</SelectCompoment.ItemText>
    </SelectCompoment.Item>
  );
}
