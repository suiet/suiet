import Button from '../../../components/Button';
import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import Typo from '../../../components/Typo';
import { useMemo, useState } from 'react';
import { SendData } from '../types';
import { addressEllipsis, formatCurrency, formatSUI } from '@suiet/core';
import { useFeatureFlagsWithNetwork } from '../../../hooks/useFeatureFlags';
import InputAmount from '../../../components/InputAmount';
import classNames from 'classnames';
import { CoinDto } from '../../../hooks/coin/useCoins';
import {
  compareCoinAmount,
  isSafeConvertToNumber,
  isSuiToken,
} from '../../../utils/check';

function SendConfirmItem({ name, value }: Record<string, string>) {
  return (
    <div className="flex justify-between my-[16px]">
      <Typo.Title className={styles['send-confirm-name']}>{name}</Typo.Title>
      <Typo.Title className={styles['send-confirm-value']}>{value}</Typo.Title>
    </div>
  );
}

function SendConfirm({
  state,
  selectedCoin,
  suiBalance,
  gasBudget,
  onInputCoinAmountWithDecimals,
  onSubmit,
}: {
  state: SendData;
  selectedCoin: CoinDto;
  suiBalance: string;
  gasBudget: number;
  onInputCoinAmountWithDecimals: (coinAmountWithDecimals: string) => void;
  onSubmit: () => Promise<void>;
}) {
  const [sendLoading, setSendLoading] = useState(false);

  // the max amount of coin that can be sent = the total balance - remaining gas budget
  const maxCoinAmountWithDecimals = useMemo(() => {
    const ratio = 10 ** selectedCoin.decimals;
    const remainingForGasBudget = gasBudget * 2;

    if (isSafeConvertToNumber(selectedCoin.balance)) {
      let res = Number(selectedCoin.balance);

      if (isSuiToken(selectedCoin.type)) {
        res -= remainingForGasBudget;
      }
      res = res < 0 ? 0 : res;
      return String(res / ratio);
    } else {
      let res = BigInt(selectedCoin.balance);

      if (isSuiToken(selectedCoin.type)) {
        res -= BigInt(remainingForGasBudget);
      }
      return String(res / BigInt(ratio));
    }
  }, [selectedCoin]);
  const isCoinAmountValid = useMemo(() => {
    const { coinAmountWithDecimals } = state;
    try {
      if (
        compareCoinAmount(coinAmountWithDecimals, 0) > 0 &&
        compareCoinAmount(coinAmountWithDecimals, maxCoinAmountWithDecimals) <=
          0
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [state, maxCoinAmountWithDecimals]);

  return (
    <div className="h-[436px]">
      <div className={classNames('flex', 'flex-col', 'h-full')}>
        <InputAmount
          className={classNames('ml-[36px]', 'grow')}
          coinSymbol={selectedCoin.symbol}
          initCoinAmount={state.coinAmountWithDecimals}
          maxCoinAmount={maxCoinAmountWithDecimals}
          decimals={selectedCoin.decimals}
          isValid={
            Number(state.coinAmountWithDecimals) === 0 || isCoinAmountValid
          }
          onInput={onInputCoinAmountWithDecimals}
        />
        <div className={classNames('flex-none', styles['send-confirm-list'])}>
          <SendConfirmItem
            name="To"
            value={addressEllipsis(state.recipientAddress)}
          />
          <SendConfirmItem
            name="Balance"
            value={`${formatCurrency(selectedCoin.balance, {
              decimals: selectedCoin.decimals,
            })} ${selectedCoin.symbol}`}
          />
          {!isSuiToken(selectedCoin.type) && (
            <SendConfirmItem
              name="SUI Balance"
              value={`${formatSUI(suiBalance)} SUI`}
            />
          )}
          <SendConfirmItem
            name="Gas Budget"
            value={`${formatSUI(gasBudget)} SUI`}
          />
        </div>
        <div className={commonStyles['next-step']}>
          <Button
            type={'submit'}
            state={'primary'}
            disabled={!isCoinAmountValid}
            onClick={async () => {
              setSendLoading(true);
              try {
                await onSubmit();
              } finally {
                setSendLoading(false);
              }
            }}
            loading={sendLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SendConfirm;
