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
  onChange?: (value: string) => void;
  trigger?: React.ReactNode;
};

export function Select(props: SelectProps) {
  return (
    <SelectCompoment.Root
      defaultValue={props.defaultValue}
      onValueChange={props.onChange}
    >
      <SelectCompoment.Trigger className="flex items-center" aria-label="Food">
        {/* <SelectCompoment.Value placeholder="Select a coin" /> */}
        <SelectCompoment.Icon className="flex gap-2 items-center">
          {props.trigger}
          <ChevronDownIcon />
        </SelectCompoment.Icon>
      </SelectCompoment.Trigger>
      <SelectCompoment.Portal className="fixed bottom-0 left-0 right-0 h-[400px] bg-white w-full py-0  shadow-lg">
        <SelectCompoment.Content className="SelectContent">
          <SelectCompoment.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </SelectCompoment.ScrollUpButton>
          <SelectCompoment.Viewport className="rounded-t-lg shadow-xl shadow-black">
            <div className="w-full flex">
              <h2 className="text-xl font-medium mx-auto my-4 text-zinc-500 ">
                Choose a coin to swap{' '}
              </h2>
            </div>
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
