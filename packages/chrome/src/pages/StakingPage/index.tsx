import Button from '../../components/Button';
import ValidatorSelector from '../../components/ValidatorSelector';
import { useApiClient } from '../../hooks/useApiClient';
import {
  SendAndExecuteTxParams,
  TxEssentials,
  formatSUI,
  calculateCoinAmount,
  maxCoinAmountWithDecimal,
  isCoinAmountValid,
} from '@suiet/core';
import { useNetwork } from '../../hooks/useNetwork';
import { useState, useEffect, useMemo } from 'react';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_VALIDATORS } from '../../utils/graphql/query';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import InputAmount from '../../components/InputAmount';
import { useAccount } from '../../hooks/useAccount';
import message from '../../components/message';
import { OmitToken } from '../../types';
import Skeleton from 'react-loading-skeleton';
import { createStakeTransaction } from './utils';
import useSuiBalance from '../../hooks/coin/useSuiBalance';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import styles from './index.module.scss';
import useGasBudgetForStaking from './hooks/useGasBudgetForStaking';

export default function StackingPage() {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const [selectedValidator, setSelectedValidator] = useState<string>('');
  const { data: gasBudget } = useGasBudgetForStaking({
    selectedValidator,
  });
  const { loading, error, data } = useQuery(GET_VALIDATORS, {
    fetchPolicy: 'cache-and-network',
  });
  const validators = data?.validators || [];
  useEffect(() => {
    setSelectedValidator(validators[0]?.suiAddress);
  }, [validators]);
  const currentValidator = validators.find((validator: any) => {
    if (validator.suiAddress === selectedValidator) {
      return true;
    }
    return false;
  });
  const [amount, setAmount] = useState('0');
  const [buttonLoading, setButtonLoading] = useState(false);

  const { address } = useAccount(appContext.accountId);
  const { data: suiBalance, loading: balanceLoading } = useSuiBalance(
    address ?? ''
  );

  const maxAmount = useMemo(() => {
    return maxCoinAmountWithDecimal(SUI_TYPE_ARG, suiBalance.balance, 9, {
      gasBudget: String(gasBudget),
    });
  }, [suiBalance, gasBudget]);

  const isInputValid = useMemo(() => {
    return isCoinAmountValid(amount, maxAmount);
  }, [amount, maxAmount]);

  async function StakeCoins() {
    try {
      // TODO:
      // 1. get coins object
      // 2. assign gasCoins?
      // 3. caculate amount
      setButtonLoading(true);
      if (!network) throw new Error('require network selected');
      if (!selectedValidator) throw new Error('require validator selected');

      const stakeSUIAmount = calculateCoinAmount(amount, 9);
      const tx = createStakeTransaction(
        BigInt(stakeSUIAmount),
        selectedValidator
      );
      tx.setGasBudget(BigInt(gasBudget));
      await apiClient.callFunc<
        SendAndExecuteTxParams<string, OmitToken<TxEssentials>>,
        undefined
      >(
        'txn.signAndExecuteTransactionBlock',
        {
          transactionBlock: tx.serialize(),
          context: {
            network,
            walletId: appContext.walletId,
            accountId: appContext.accountId,
          },
        },
        { withAuth: true }
      );
      message.success('Stake SUI succeeded');
      navigate('/transaction/flow');
    } catch (e: any) {
      // console.error(e);
      message.error(`Send transaction failed: ${e?.message}`);
    } finally {
      setButtonLoading(false);
    }

    // const coinObjList = await this.txApi.getOwnedCoins({
    //   network,
    //   address: context.target.address,
    // });
    // const suiToPayList = coinObjList.filter(
    //   (obj) =>
    //     obj.symbol === CoinSymbol.SUI && tx.data.inputCoins.includes(obj.id)
    // );
    // console.log('stake');
  }
  const navigate = useNavigate();
  return (
    <div className={styles['page']}>
      <Nav
        position={'relative'}
        onNavBack={() => {
          navigate(-1);
          //   switch (mode) {
          //     case Mode.symbol:
          //       navigate(-1);
          //       break;
          //     case Mode.address:
          //       setMode(Mode.symbol);
          //       break;
          //     case Mode.confirm:
          //       setMode(Mode.address);
          //       break;
          //     default:
          //   }
        }}
        title="Stake SUI"
      />
      <div className="px-2">
        {loading ? (
          <Skeleton className="w-full rounded-2xl h-12" />
        ) : (
          <ValidatorSelector
            loading={loading}
            validators={validators}
            selectedValidator={selectedValidator}
            setSelectedValidator={setSelectedValidator}
          ></ValidatorSelector>
        )}
      </div>

      <div className="px-6 text-3xl flex items-center gap-2 w-full max-w-[362px]">
        <InputAmount
          className="h-48"
          onInput={(value) => {
            setAmount(value);
          }}
          maxCoinAmount={maxAmount}
          decimals={suiBalance.decimals}
          coinSymbol={'SUI'}
          isValid={amount === '0' || isInputValid}
        ></InputAmount>
        {/* <div className="font-bold text-zinc-300">SUI</div>
        <button className="text-lg py-1 px-3 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition font-medium rounded-2xl">
          Max
        </button> */}
      </div>
      <div className="fixed b-0 w-full bottom-0 bg-white">
        <div className="border-t border-t-zinc-100 p-4 mx-4">
          <div className="flex flex-col ">
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Staking APY</div>
              <div className="text-zinc-400">{currentValidator?.apy}%</div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Staking Rewards Start</div>
              <div className="text-zinc-400">
                Epoch #{currentValidator?.epoch}
              </div>
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">SUI Balance</div>
              <div className="text-zinc-400">
                {formatSUI(suiBalance.balance)} SUI
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Gas Budget</div>
              <div className="text-zinc-400">{formatSUI(gasBudget)} SUI</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-t-zinc-100">
          <Button
            type={'submit'}
            state={'primary'}
            loading={buttonLoading}
            onClick={StakeCoins}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
