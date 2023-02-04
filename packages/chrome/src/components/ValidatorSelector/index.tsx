/* eslint-disable react/prop-types */
import * as Select from '@radix-ui/react-select';
import { ReactComponent as IconRightArrow } from '../../assets/icons/right-arrow.svg';
import { useQuery } from '@apollo/client';
import { GET_VALIDATORS } from '../../utils/graphql/query';
import classNames from 'classnames';
import Address from '../Address';
export default function ValidatorSelector() {
  const { loading, error, data } = useQuery(GET_VALIDATORS);
  const validators = data?.validators || [];
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
              {validators.map((validator) => (
                <ValidatorItem
                  key={validator?.suiAddress}
                  name={validator?.name}
                  address={validator?.suiAddress}
                  imageURL={validator?.imageURL}
                  apy={validator?.apy}
                  identifier={validator?.suiAddress}
                />
              ))}
            </Select.Viewport>
          </div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function ValidatorItem({
  name = 'validator',
  imageURL,
  identifier,
  address,
  apy,
}) {
  return (
    <Select.Item
      value={identifier}
      className={classNames(
        'selected-item',
        'outline-none',
        'rounded-2xl',
        'border',
        'border-zinc-200',
        'transition',
        'cursor-pointer',
        'duration-300',
        'mb-2',
        ['hover:bg-sky-100', 'hover:border-sky-200'],
        ['active:bg-sky-200', 'hover:border-sky-300']
      )}
    >
      <div className="w-full flex items-center justify-between pl-2 pr-4 py-3">
        <div className="flex items-center">
          <div className="">
            <img
              src={imageURL}
              className={classNames('w-8', 'h-8', 'rounded-xl', 'm-2')}
            ></img>
          </div>
          <div className="flex flex-col">
            <Select.ItemText className="font-bold">{name}</Select.ItemText>
            <Address
              hideCopy={true}
              className="text-zinc-400"
              value={address}
            ></Address>
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
