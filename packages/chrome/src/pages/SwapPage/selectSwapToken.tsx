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

export const Select = () => (
  <SelectCompoment.Root>
    <SelectCompoment.Trigger className="SelectTrigger" aria-label="Food">
      <SelectCompoment.Value placeholder="Select a fruit…" />
      <SelectCompoment.Icon className="SelectIcon">
        <ChevronDownIcon />
      </SelectCompoment.Icon>
    </SelectCompoment.Trigger>
    <SelectCompoment.Portal>
      <SelectCompoment.Content className="SelectContent">
        <SelectCompoment.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </SelectCompoment.ScrollUpButton>
        <SelectCompoment.Viewport className="SelectViewport">
          <SelectCompoment.Group>
            <SelectCompoment.Label className="SelectLabel">
              Fruits
            </SelectCompoment.Label>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectCompoment.Group>

          <SelectCompoment.Separator className="SelectSeparator" />

          <SelectCompoment.Group>
            <SelectCompoment.Label className="SelectLabel">
              Vegetables
            </SelectCompoment.Label>
            <SelectItem value="aubergine">Aubergine</SelectItem>
            <SelectItem value="broccoli">Broccoli</SelectItem>
            <SelectItem value="carrot" disabled>
              Carrot
            </SelectItem>
            <SelectItem value="courgette">Courgette</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </SelectCompoment.Group>

          <SelectCompoment.Separator className="SelectSeparator" />

          <SelectCompoment.Group>
            <SelectCompoment.Label className="SelectLabel">
              Meat
            </SelectCompoment.Label>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
          </SelectCompoment.Group>
        </SelectCompoment.Viewport>
        <SelectCompoment.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </SelectCompoment.ScrollDownButton>
      </SelectCompoment.Content>
    </SelectCompoment.Portal>
  </SelectCompoment.Root>
);

export const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectCompoment.Item
        className={classnames('SelectItem', className)}
        {...props}
        ref={forwardedRef}
      >
        <SelectCompoment.ItemText>{children}</SelectCompoment.ItemText>
        <SelectCompoment.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </SelectCompoment.ItemIndicator>
      </SelectCompoment.Item>
    );
  }
);
