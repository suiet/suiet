/* eslint-disable react/prop-types */
import * as Select from '@radix-ui/react-select';
import { ReactComponent as IconRightArrow } from '../../assets/icons/right-arrow.svg';

// import React from 'react';
// import classnames from 'classnames';

// const SelectItem = React.forwardRef(
//   ({ children, className, ...props }, forwardedRef) => {
//     return (
//       <Select.Item
//         className={classnames('SelectItem', className)}
//         {...props}
//         ref={forwardedRef}
//       >
//         <Select.ItemText>{children}</Select.ItemText>
//         <Select.ItemIndicator className="SelectItemIndicator">
//           {/* <CheckIcon /> */}
//         </Select.ItemIndicator>
//       </Select.Item>
//     );
//   }
// );

export default function ValidatorSelector() {
  return (
    <Select.Root>
      <Select.Trigger
        className="SelectTrigger w-full outline-none"
        aria-label="Food"
      >
        <div className="rounded-2xl validator-info p-4 flex items-center justify-between m-2 bg-sky-50 ">
          <div className="flex items-center gap-2">
            <img className="w-[24px] h-[24px] rounded-full"></img>
            <div className="text-sky-800 text-md font-medium">
              <Select.Value placeholder="Select a validator" />
            </div>
          </div>

          <Select.Icon className="SelectIcon">
            <IconRightArrow />
          </Select.Icon>
        </div>
      </Select.Trigger>
      <Select.Portal className="fixed bottom-0 left-0 right-0 bg-white w-full p-4 pb=0">
        <Select.Content className="border-t-zinc-100 bg-white w-[100wh] border rounded-2xl">
          <h1 className="text-lg font-medium text-zinc-600 mx-auto mb-4">
            Select a validator
          </h1>
          <div className="max-h-[60vh] overflow-auto">
            <Select.Viewport className="">
              <ValidatorItem
                name="validator1"
                address="0x03a3....9306"
                apy="11523.9673"
                identifier={'assdasd'}
              />
              <ValidatorItem
                name="validator2"
                address="0x03a3....9306"
                apy="11523.9673"
                identifier={'asdasd'}
              />
              <ValidatorItem
                name="validator3"
                address="0x03a3....9306"
                apy="11523.9673"
                identifier={'asdaasd'}
              />
              <ValidatorItem
                name="validator4"
                address="0x03a3....9306"
                apy="11523.9673"
                identifier={'asdasasd'}
              />
              <ValidatorItem
                name="validator5"
                address="0x03a3....9306"
                apy="11523.9673"
                identifier={'asdadsd'}
              />
            </Select.Viewport>
          </div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function ValidatorItem({
  name = 'validator',
  identifier,
  address,
  apy,
}) {
  return (
    <Select.Item
      value={identifier}
      className="selected-item outline-none rounded-2xl border border-zinc-200 mb-2"
    >
      <div className="w-full flex items-center justify-between pl-2 pr-4 py-3">
        <div className="flex items-center">
          <div className="">
            <IconRightArrow />
          </div>
          <div className="flex flex-col">
            <Select.ItemText className="font-bold">{name}</Select.ItemText>
            <div className="text-zinc-400">{address}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <p className="text-zinc-600">{apy}%</p>
          <p className="text-zinc-400">APY</p>
        </div>
      </div>
    </Select.Item>
  );
}
