import Button from '../../../components/Button';
import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import Typo from '../../../components/Typo';
import { useRef, useState } from 'react';
import { SendData } from '../types';
import { addressEllipsis, formatCurrency } from '../../../utils/format';
import classNames from 'classnames';
import message from '../../../components/message';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../../hooks/useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { swrKeyWithNetwork, useNetwork } from '../../../hooks/useNetwork';
import { mutate } from 'swr';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { OmitToken } from '../../../types';
import { TransferCoinParams } from '@suiet/core';
import { Coins, swrKey as swrKeyForUseCoins } from '../../../hooks/useCoins';

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
  const [val, setVal] = useState(state.amount || '0');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [sendLoading, setSendLoading] = useState(false);
  const decimals = coin?.metadata.decimals || 0;

  const setInputVal = (value: string) => {
    if (!inputRef.current) return;
    const val = Number(value);
    if (Number.isNaN(val) || val < 0) {
      return;
    }
    if (value === '') value = '0';
    if (val > 0 && value.startsWith('0')) {
      setVal(val.toString());
    } else {
      setVal(value.toString());
    }
  };

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
            data.amount * Math.pow(10, coin?.metadata.decimals || 0)
          ),
          recipient: data.address,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
        { withAuth: true }
      );
      message.success('Send transaction succeeded');
      setTimeout(() => {
        mutate(swrKeyWithNetwork(swrKeyForUseCoins, network));
      }, 1000);
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
      <div className={''}>
        <div className={styles['balance-container']}>
          <div
            className={classNames('flex', {
              [styles['fit']]: Number(val) > 0 && Number(val) <= balance,
              [styles['excess']]: Number(val) > balance,
            })}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            <input
              ref={inputRef}
              className={classNames(styles['balance-amount'])}
              style={{ width: `${val.toString().length * 22}px` }}
              value={val}
              maxLength={7}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
              onBlur={() => {
                onSubmit(Number(val));
              }}
            />
            <span className={styles['balance-name']}>{symbol}</span>
          </div>
          <div
            className={styles['balance-max-btn']}
            onClick={() => {
              setInputVal(balance.toString());
            }}
          >
            MAX
          </div>
        </div>
        <div className={styles['send-confirm-list']}>
          <SendConfirmItem name="To" value={addressEllipsis(state.address)} />
          <SendConfirmItem name="Gas Fee" value="12 SUI ≈ 12 USD" />
          <SendConfirmItem
            name="Balance"
            value={formatCurrency(balance * 10 ** decimals)}
          />
        </div>
        <div className={commonStyles['next-step']}>
          <Button
            type={'submit'}
            state={'primary'}
            disabled={Number(val) <= 0 || Number(val) > balance}
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
