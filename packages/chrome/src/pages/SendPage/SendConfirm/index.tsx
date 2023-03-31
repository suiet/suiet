import Button from '../../../components/Button';
import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import Typo from '../../../components/Typo';
import { useMemo, useRef, useState } from 'react';
import { SendData } from '../types';
import {
  addressEllipsis,
  formatCurrency,
  formatSUI,
} from '../../../utils/format';
import message from '../../../components/message';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../../hooks/useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { OmitToken } from '../../../types';
import { TransferCoinParams } from '@suiet/core';
import { Coins } from '../../../hooks/useCoins';
import { useFeatureFlagsWithNetwork } from '../../../hooks/useFeatureFlags';
import InputAmount from '../../../components/InputAmount';

function SendConfirmItem({ name, value }: Record<string, string>) {
  return (
    <div className="flex justify-between my-[16px]">
      <Typo.Title className={styles['send-confirm-name']}>{name}</Typo.Title>
      <Typo.Title className={styles['send-confirm-value']}>{value}</Typo.Title>
    </div>
  );
}

function SendConfirm({
  onSubmit,
  state,
  balance,
  symbol,
  coin,
}: {
  onSubmit: (val: number) => void;
  state: SendData;
  balance: number;
  symbol: string;
  coin?: Coins;
}) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const navigate = useNavigate();
  const [sendLoading, setSendLoading] = useState(false);
  const decimals = coin?.metadata.decimals ?? 0;
  const featureFlags = useFeatureFlagsWithNetwork();
  const gasFee = featureFlags?.pay_coin_gas_budget ?? 0;
  const max = useMemo(() => {
    return Number(
      formatCurrency(balance * 10 ** decimals - gasFee, { decimals })
    );
  }, [balance]);
  // use math.js?
  // fixme: use BigInt
  const remaining =
    max * 10 ** decimals - state.amount * 10 ** decimals >= 0
      ? (max * 10 ** decimals - state.amount * 10 ** decimals) / 10 ** decimals
      : 0;

  async function submitTransaction(data: SendData) {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    setSendLoading(true);
    try {
      await apiClient.callFunc<OmitToken<TransferCoinParams>, undefined>(
        'txn.transferCoin',
        {
          network,
          coinType: SUI_TYPE_ARG,
          amount: Math.ceil(
            data.amount * Math.pow(10, coin?.metadata.decimals ?? 0)
          ),
          recipient: data.address,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
        { withAuth: true }
      );
      message.success('Send transaction succeeded');
      // TODO: refetch
      // setTimeout(() => {
      //   refetch(swrKeyWithNetwork(swrKeyForUseCoins, network));
      // }, 1000);
      navigate('/transaction/flow');
    } catch (e: any) {
      console.error(e);
      message.error(`Send transaction failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <>
      <div>
        <InputAmount
          className="ml-[36px] h-[304px]"
          onInput={onSubmit}
          max={max}
          initAmount={state.amount}
          symbol={symbol}
        />
        <div className={styles['send-confirm-list']}>
          <SendConfirmItem name="To" value={addressEllipsis(state.address)} />
          <SendConfirmItem name="Gas Budget" value={formatSUI(gasFee)} />
          <SendConfirmItem
            name="Balance"
            value={formatCurrency(remaining * 10 ** decimals, { decimals })}
          />
        </div>
        <div className={commonStyles['next-step']}>
          <Button
            type={'submit'}
            state={'primary'}
            disabled={state.amount <= 0 || state.amount > max}
            onClick={() => {
              submitTransaction(state);
            }}
            loading={sendLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
}

export default SendConfirm;
