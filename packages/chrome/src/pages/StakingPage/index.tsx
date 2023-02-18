import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/Button';
import ValidatorSelector from '../../components/ValidatorSelector';
import { useApiClient } from '../../hooks/useApiClient';
import { StakeCoinParams } from '@suiet/core';
import { useNetwork } from '../../hooks/useNetwork';
import { useState, useEffect } from 'react';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { GET_VALIDATORS } from '../../utils/graphql/query';
// import { get } from '@suiet/core';
export default function StackingPage() {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const { walletId } = useSelector((state: RootState) => state.appContext);

  const [selectedValidator, setSelectedValidator] = useState(null);
  const { loading, error, data } = useQuery(GET_VALIDATORS);
  const validators = data?.validators || [];
  useEffect(() => {
    setSelectedValidator(validators[0]?.suiAddress);
  }, [validators]);

  const currentValidator = validators.find((validator) => {
    if (validator.suiAddress === selectedValidator) {
      return true;
    }
    return false;
  });

  async function StakeCoins() {
    try {
      // TODO:
      // 1. get coins object
      // 2. assign gasCoins?
      // 3. caculate amount
      async function fetchAccount(_: string, accountId: string) {
        if (!accountId) return;
        return await apiClient.callFunc<StakeCoinParams, undefined>(
          'txn.stakeCoin',
          {
            network,
            walletId,
            coins: [],
            gasCoins: [],
            validator: '',
            gasBudgetForStake: 0,
          }
        );
      }

      // await apiClient.callFunc<OmitToken<TransferCoinParams>, undefined>(
      //   'txn.transferCoin',
      //   {
      //     network,
      //     coinType: SUI_TYPE_ARG,
      //     amount: Math.ceil(data.amount * 1e9),
      //     recipient: data.address,
      //     walletId: appContext.walletId,
      //     accountId: appContext.accountId,
      //   },
      //   { withAuth: true }
      // );
      // message.success('Send transaction succeeded');
      // setTimeout(() => {
      //   mutate(swrKeyWithNetwork(swrKeyForUseCoins, network));
      // }, 1000);
      // navigate('/transaction/flow');
    } catch (e: any) {
      // console.error(e);
      // message.error(`Send transaction failed: ${e?.message}`);
    } finally {
      // setSendLoading(false);
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
  return (
    <AppLayout>
      <div className="px-2">
        <ValidatorSelector
          loading={loading}
          validators={validators}
          selectedValidator={selectedValidator}
          setSelectedValidator={setSelectedValidator}
        ></ValidatorSelector>
      </div>

      <div className="px-6 py-24 text-3xl flex items-center gap-2 w-full max-w-[362px]">
        <input
          className="flex-grow w-[200px] outline-none text-zinc-500"
          placeholder="0"
        />{' '}
        <div className="font-bold text-zinc-300">SUI</div>
        <button className="text-lg py-1 px-3 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition font-medium rounded-2xl">
          Max
        </button>
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
              <div className="text-zinc-700">Gas Fee</div>
              <div className="text-zinc-400">0.000015 SUI</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-t-zinc-100">
          <Button type={'submit'} state={'primary'}>
            Confirm
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
