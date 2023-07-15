import { Extendable } from '../../types';
import { CoinType } from '../../types/coin';
import { Img } from '../../components/Img';
import { formatCurrency } from '@suiet/core';

type TokenInfoProps = Extendable & {
  coin: CoinType | undefined;
};

export function TokenInfo(props: TokenInfoProps) {
  return (
    <>
      {props.coin && (
        <div className="flex gap-4 items-center">
          <Img className="w-[48px] h-[48px]" src={props.coin.iconURL}></Img>
          <div className="flex flex-col items-center">
            <div
              className="font-medium w-full text-left"
              style={{
                fontSize: 20,
              }}
            >
              {props.coin.symbol}
            </div>
            <div className="text-zinc-500 whitespace-nowrap">
              {formatCurrency(props.coin.balance, {
                decimals: props.coin.metadata.decimals,
              }) +
                ' ' +
                props.coin.symbol}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
