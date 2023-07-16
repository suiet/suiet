import React, { ReactNode } from 'react';
import { Extendable, OmitToken } from '../../types';
import { Select, SelectItem } from './selectSwapToken';
import TokenItem from '../../components/TokenItem';
import { CoinType } from '../../types/coin';
import classNames from 'classnames';
type SwapItemProps = Extendable & {
  type: 'From' | 'To';
  data: CoinType[] | undefined;
  defaultValue?: any;
  onChange: (value: string) => void;
  amount: string | undefined;
  maxAmount?: string;
  onAmountChange?: (value: string) => void;
  trigger: ReactNode;
};

export default function SwapItem(props: SwapItemProps) {
  return (
    <div className="px-6 py-4 hover:bg-slate-100 transition-all flex justify-between items-center w-full">
      <Select
        className="flex-shrink-0"
        // onValueChange={console.log}
        // layoutClass="fixed left-0 right-0 bottom-0 w-[100wh] h-[400px]"
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        trigger={props.trigger}
      >
        <div className="">
          {props.data?.map((coin) => {
            return (
              <SelectItem
                key={coin.type}
                className="focus:outline-0"
                value={coin.type}
              >
                <TokenItem
                  coin={coin}
                  wrapperClass={'py-[20px] px-[20px] border-t border-gray-100'}
                ></TokenItem>
              </SelectItem>
            );
          })}
        </div>
      </Select>
      {props.type === 'From' ? (
        <input
          className={classNames(
            'focus:outline-0 text-xl flex-shrink text-right bg-transparent',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
          // type="text"
          type="number"
          min="0"
          max={props.maxAmount}
          placeholder="0.00"
          style={{
            WebkitAppearance: 'none',
          }}
          value={props.amount}
          onInput={(e) => {
            props.onAmountChange &&
              props.onAmountChange((e.target as any).value);
          }}
        />
      ) : (
        <div
          className="focus:outline-0 text-xl flex-shrink text-right bg-transparent w-[130px]"
          placeholder="0.00"
        >
          {Number(props.amount).toLocaleString() ? props.amount : '-'}
        </div>
      )}
    </div>
  );
}
