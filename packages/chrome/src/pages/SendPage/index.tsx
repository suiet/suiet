import classnames from 'classnames';
import styles from './index.module.scss';
import Textarea from '../../components/Textarea';
import { InputGroup } from '../../components/Input';
import Typo from '../../components/Typo';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import WaterDropIcon from '../../components/WaterDropIcon';
import { isValidSuiAddress } from '@mysten/sui.js';
import { useForm } from 'react-hook-form';
import message from '../../components/message';
import Form from '../../components/form/Form';
import FormControl from '../../components/form/FormControl';
import { getInputStateByFormState } from '../../utils/form';
import { CoinSymbol, useCoinBalance } from '../../hooks/useCoinBalance';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { swrKeyWithNetwork, useNetwork } from '../../hooks/useNetwork';
import { useAccount } from '../../hooks/useAccount';
import { useCallback, useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import { TransferCoinParams } from '@suiet/core';
import { OmitToken } from '../../types';
import { formatCurrency } from '../../utils/format';
import AppLayout from '../../layouts/AppLayout';
import { mutate } from 'swr';
import { swrKey as swrKeyForUseCoins } from '../../hooks/useCoins';

interface SendFormValues {
  address: string;
  amount: number;
}

const GAS_BUDGET = 100;

const SendPage = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const { data: account } = useAccount(appContext.accountId);
  const [sendLoading, setSendLoading] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const { balance } = useCoinBalance(
    CoinSymbol.SUI,
    account?.address ?? '',
    appContext.networkId
  );
  const form = useForm<SendFormValues>({
    mode: 'onChange',
    defaultValues: {
      address: '',
      amount: undefined,
    },
  });

  const handleBalanceSubmit = useCallback(
    (val: any) => {
      const _val = Number(val);
      if (_val <= 0) return 'amount should be greater than 0';
      if (_val < 1e-9) return 'amount is too small';
      if (_val > (Number(balance) - GAS_BUDGET) * 1e-9)
        return `you don't have enough balance`;
      return true;
    },
    [balance]
  );

  async function submitTransaction(data: SendFormValues) {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    setSendLoading(true);
    try {
      await apiClient.callFunc<OmitToken<TransferCoinParams>, undefined>(
        'txn.transferCoin',
        {
          network,
          symbol: CoinSymbol.SUI,
          amount: Math.ceil(data.amount * 1e9),
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
    <AppLayout>
      <div className={styles['container']}>
        <Form form={form} onSubmit={submitTransaction}>
          <section className={styles['section']}>
            <Typo.Title>Address</Typo.Title>
            <FormControl
              name={'address'}
              registerOptions={{
                required: 'address should not be empty',
                validate: (val) => {
                  return (
                    isValidSuiAddress(val) || 'this is not a valid address'
                  );
                },
              }}
              className={'mt-[6px]'}
            >
              <Textarea
                placeholder="Enter SUI address"
                state={getInputStateByFormState(form.formState, 'address')}
              />
            </FormControl>
          </section>

          <section className={classnames(styles['section'], 'mt-[20px]')}>
            <Typo.Title>Amount</Typo.Title>
            <FormControl
              name={'amount'}
              registerOptions={{
                required: 'amount should not be empty',
                validate: handleBalanceSubmit,
              }}
              className={'mt-[6px]'}
            >
              <InputGroup
                type={'number'}
                state={getInputStateByFormState(form.formState, 'amount')}
                placeholder={'Please enter the amount'}
                value={inputAmount}
                onInput={(e) => {
                  const value = (e.target as any).value;
                  if (Number.isNaN(Number(value))) return;
                  setInputAmount(value);
                }}
                suffix={
                  <div className={styles['input-suffix']}>
                    <WaterDropIcon size={'small'} />
                    <Typo.Normal className={'ml-[8px]'}>SUI</Typo.Normal>
                  </div>
                }
              />
            </FormControl>
            <Typo.Small className={classnames('mt-[6px]', 'text-gray-400')}>
              current balance: {formatCurrency(balance)} SUI
            </Typo.Small>
          </section>

          <section className={styles['section']}>
            <Divider type={'horizontal'} />
            <Typo.Title>Gas fee budget</Typo.Title>
            <div className={'flex items-center'}>
              <WaterDropIcon size={'small'} />
              <Typo.Normal className={'ml-[6px]'}>
                {formatCurrency(GAS_BUDGET)} SUI
              </Typo.Normal>
            </div>

            <Button
              type={'submit'}
              state={'primary'}
              className={'mt-[20px]'}
              loading={sendLoading}
            >
              Send
            </Button>
            <Button
              className={'mt-[10px]'}
              onClick={() => {
                navigate('/');
              }}
            >
              Cancel
            </Button>
          </section>
        </Form>
      </div>
    </AppLayout>
  );
};

export default SendPage;
