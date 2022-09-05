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
import { coreApi } from '@suiet/core';
import { CoinSymbol, useCoinBalance } from '../../hooks/useCoinBalance';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../../hooks/useNetwork';
import { useWallet } from '../../hooks/useWallet';
import { useAccount } from '../../hooks/useAccount';
import { useState } from 'react';

interface SendFormValues {
  address: string;
  amount: number;
}

const SendPage = () => {
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const { data: wallet } = useWallet(appContext.walletId);
  const { account } = useAccount(appContext.accountId);
  const [sendLoading, setSendLoading] = useState(false);

  const context = useSelector((state: RootState) => state.appContext);
  const { balance, loading: balanceLoading } = useCoinBalance(
    account.address,
    CoinSymbol.SUI,
    {
      networkId: context.networkId,
    }
  );
  const form = useForm<SendFormValues>({
    mode: 'onChange',
    defaultValues: {
      address: '',
      amount: 0,
    },
  });

  async function submitTransaction(data: SendFormValues) {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    const params = {
      network,
      symbol: CoinSymbol.SUI,
      amount: data.amount,
      recipient: data.address,
      walletId: appContext.walletId,
      accountId: appContext.accountId,
      token: appContext.token,
    };

    console.log('current account', account);
    console.log('send input: ', params);
    setSendLoading(true);
    try {
      await coreApi.txn.transferCoin(params);
      message.success('Send transaction succeed');
      navigate('/transaction/flow');
    } catch (e) {
      console.error(e);
      message.error('Send transaction failed');
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <div className={styles['container']}>
      <Form form={form} onSubmit={submitTransaction}>
        <section className={styles['section']}>
          <Typo.Title>Address</Typo.Title>
          <FormControl
            name={'address'}
            registerOptions={{
              required: 'address should not be empty',
              validate: (val) => {
                return isValidSuiAddress(val) || 'this is not a valid address';
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
              valueAsNumber: true,
              validate: (val) => {
                return val > 0 || 'amount should be greater than 0';
              },
            }}
            className={'mt-[6px]'}
          >
            <InputGroup
              type={'number'}
              state={getInputStateByFormState(form.formState, 'amount')}
              placeholder={'Please enter the amount'}
              suffix={
                <div className={styles['input-suffix']}>
                  <WaterDropIcon size={'small'} />
                  <Typo.Normal className={'ml-[8px]'}>SUI</Typo.Normal>
                </div>
              }
            />
          </FormControl>
          <Typo.Small className={classnames('mt-[6px]', 'text-gray-400')}>
            current balance: {balance} SUI
          </Typo.Small>
        </section>

        <section className={styles['section']}>
          <Divider type={'horizontal'} />
          <Typo.Title>Gas fee budget</Typo.Title>
          <div className={'flex items-center'}>
            <WaterDropIcon size={'small'} />
            <Typo.Normal className={'ml-[6px]'}>100 SUI</Typo.Normal>
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
  );
};

export default SendPage;
