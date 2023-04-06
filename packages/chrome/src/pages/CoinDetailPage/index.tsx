import AppLayout from '../../layouts/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useWallet } from '../../hooks/useWallet';
import Avatar from '../../components/Avatar';
import IconWaterDrop from '../../assets/icons/waterdrop.svg';
import IconToken from '../../assets/icons/token.svg';
import styles from './index.module.scss';
import TokenIcon from '../../components/TokenIcon';
import { SendAndExecuteTxParams, TxEssentials } from '@suiet/core';
import classNames from 'classnames';
import { useCoins } from '../../hooks/useCoins';
import message from '../../components/message';
import { OmitToken } from '../../types';
import { useNetwork } from '../../hooks/useNetwork';
import { formatSUI, formatCurrency } from '../../utils/format';
import { ReactComponent as IconStakeFilled } from '../../assets/icons/stake-filled.svg';
import { ReactComponent as IconStake } from '../../assets/icons/stake.svg';
import { useQuery } from '@apollo/client';
import { GET_DELEGATED_STAKES } from '../../utils/graphql/query';
import Button from '../../components/Button';
import Nav from '../../components/Nav';
import Skeleton from 'react-loading-skeleton';
import { TransactionBlock, SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui.js';
import { useApiClient } from '../../hooks/useApiClient';
import { LoadingSpokes } from '../../components/Loading';
import { useState } from 'react';
import { object } from 'superstruct';
export default function CoinDetailPage() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const apiClient = useApiClient();
  const { data: network } = useNetwork(appContext.networkId);
  const params = useParams();
  const symbol = params['symbol'];
  const { context } = useSelector((state: RootState) => ({
    context: state.appContext,
  }));
  const navigate = useNavigate();
  const { address } = useAccount(appContext.accountId);
  const dispatch = useDispatch<AppDispatch>();
  const { data: wallet } = useWallet(context.walletId);
  const [buttonLoading, setButtonLoading] = useState<KeyValueObject>({});
  const {
    data: coinsBalance,
    getBalance,
    error,
  } = useCoins(address, appContext.networkId);

  const { data: delegatedStakesResult, loading: stakesLoading } = useQuery(
    GET_DELEGATED_STAKES,
    {
      variables: {
        address,
      },
      skip: !address,
    }
  );

  type KeyValueObject = {
    [key: string]: boolean;
  };

  async function UnstakeCoins(stakeObjectID: string) {
    try {
      setButtonLoading((prevButtonLoading) => {
        return { ...prevButtonLoading, [stakeObjectID]: true };
      });

      // TODO:
      // 1. get coins object
      // 2. assign gasCoins?
      // 3. caculate amount
      // setButtonLoading(true);
      if (!network) throw new Error('require network selected');

      const tx = new TransactionBlock();
      tx.moveCall({
        target: '0x3::sui_system::request_withdraw_stake',
        arguments: [
          tx.object(SUI_SYSTEM_STATE_OBJECT_ID),
          tx.object(stakeObjectID),
        ],
      });
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
      setButtonLoading((prevButtonLoading) => {
        return { ...prevButtonLoading, [stakeObjectID]: false };
      });
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
  // [{"__typename":"DelegatedStake","stakes":[{"__typename":"Stake","status":"Pending","principal":0,"stakeActiveEpoch":1,"stakedSuiID":null,"stakeRequestEpoch":407}],"validator":{"__typename":"Validator","suiAddress":"0xba39e145d3d85fa14b80523d7eef49bf22d0031e","name":"validator-3","imageURL":"","epoch":407,"description":""}},{"__typename":"DelegatedStake","stakes":[{"__typename":"Stake","status":"Pending","principal":0,"stakeActiveEpoch":1,"stakedSuiID":null,"stakeRequestEpoch":407}],"validator":{"__typename":"Validator","suiAddress":"0x92c6ca2c92f32e781ab9831474fd83cd4e63c195","name":"validator-1","imageURL":"","epoch":407,"description":""}}]0x762a64b9eb541bbcee9db68334c5881cb1629bf5

  const delegatedStakes = delegatedStakesResult?.delegatedStakes;
  const stakedBalance =
    delegatedStakes?.reduce((accumulator, current) => {
      const sum = current.stakes.reduce(
        (stakesAccumulator, stake) => stakesAccumulator + stake.principal,
        0
      );
      return accumulator + sum;
    }, 0) ?? 0;
  const earnedBalance =
    delegatedStakes?.reduce((accumulator, current) => {
      const sum = current.stakes.reduce(
        (stakesAccumulator, stake) => stakesAccumulator + stake.earned,
        0
      );
      return accumulator + sum;
    }, 0) ?? 0;
  const balance = symbol ? getBalance(symbol) : 0;

  return (
    <div>
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
        title="SUI"
      />
      <div className="flex justify-center pt-8">
        <div className="flex">
          <Avatar
            className={classNames('border-2 border-white', 'mr-[-18px]')}
            size={'lg'}
            model={wallet?.avatar}
          />
          <TokenIcon
            icon={symbol === 'SUI' ? IconWaterDrop : IconToken}
            alt="water-drop"
            size="large"
            className={classNames(
              'border-2 border-white',
              'w-[64px] h-[64px]',
              symbol === 'SUI' ? '' : styles['icon-wrap-default']
            )}
          />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center">
        <div className="mt-4 flex items-center gap-2">
          {stakesLoading ? (
            <Skeleton className="w-12 h-6"></Skeleton>
          ) : (
            <p className="inline text-3xl font-bold">
              {formatSUI(Number(balance) + Number(stakedBalance))}
            </p>
          )}
          <p className="inline text-3xl font-bold text-zinc-400">SUI</p>
        </div>

        <div className="">
          {stakesLoading ? (
            <Skeleton className="w-10 h-6 mr-2"></Skeleton>
          ) : (
            <p className="inline text-2 text-zinc-400">
              Earned {formatSUI(earnedBalance)} SUI{' '}
            </p>
          )}
        </div>
      </div>

      <div className="balance details flex mt-2 mx-6 justify-between">
        <div className="free-balance">
          <p className="text-zinc-400 font-normal">Avaliable</p>

          <div className="font-bold">{formatSUI(balance)} SUI</div>
        </div>
        <div className="staked-balance text-right">
          <p className="text-zinc-400 font-normal">Stake</p>
          {stakesLoading ? (
            <Skeleton className="w-10 h-4 mb-2"></Skeleton>
          ) : (
            <div className="font-bold">{formatSUI(stakedBalance)} SUI</div>
          )}
        </div>
      </div>

      <div className="w-full px-6 rounded-full overflow-hidden">
        <div className="w-full rounded-full mx-auto h-2 bg-gray-200 overflow-hidden">
          {stakesLoading ? (
            <Skeleton className="w-full h-full"></Skeleton>
          ) : (
            <div
              className="h-full rounded-full bg-sky-300 transition-all duration-500 ease-in-out"
              style={{
                width: `${
                  (Number(balance) * 100) / (stakedBalance + Number(balance))
                }%`,
              }}
            ></div>
          )}
        </div>
      </div>

      <div className="mx-6 mt-6 mb-24">
        {stakesLoading ? (
          <Skeleton className="w-24 h-4 inline-block"></Skeleton>
        ) : (
          <div className="text-zinc-400">
            Staking on {delegatedStakes?.length ?? 0} validators
          </div>
        )}

        <div className="flex flex-col mt-2">
          {stakesLoading ? (
            <>
              <Skeleton className="flex justify-between items-center w-full rounded-2xl p-6"></Skeleton>
              <Skeleton className="flex justify-between items-center w-full rounded-2xl p-6"></Skeleton>
            </>
          ) : (
            delegatedStakes?.map((delegatedStake) =>
              delegatedStake.stakes?.map((stake) => (
                <div
                  className="flex flex-col justify-between border-2 border-zinc-100 w-full rounded-2xl p-4 mb-2"
                  key={delegatedStake?.validator?.suiAddress}
                >
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconStakeFilled />
                      <div className="font-bold">
                        {delegatedStake?.validator?.name}
                      </div>
                    </div>
                    <button
                      className="bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 px-3 py-1 rounded-xl transition-all"
                      onClick={async () =>
                        await UnstakeCoins(stake?.stakedSuiID)
                      }
                      style={
                        {
                          // fixme: unhide when unstake is ready
                          // display: 'none',
                        }
                      }
                    >
                      {buttonLoading?.[stake?.stakedSuiID] ? (
                        <div className="px-5 py-1">
                          <LoadingSpokes
                            width="12px"
                            height="12px"
                          ></LoadingSpokes>
                        </div>
                      ) : (
                        'Unstake'
                      )}
                    </button>
                  </div>
                  <div className="flex mt-4 gap-2 justify-around">
                    <div className="flex flex-col">
                      <p className="text-zinc-400">Staked</p>
                      <div className="font-medium text-sm">
                        {formatSUI(stake.principal)}
                        <div className="inline text-zinc-400 pl-1">SUI</div>
                      </div>
                    </div>

                    <div className="flex w-[1px] bg-zinc-200"></div>

                    <div className="flex flex-col">
                      <p className="text-zinc-400">APY</p>
                      <div className="text-sm font-medium">
                        {delegatedStake?.validator?.description.lenth === 0
                          ? delegatedStake?.validator?.description
                          : formatCurrency(delegatedStake?.validator?.apy, {
                              decimals: 0,
                            }) + '%'}
                      </div>
                    </div>

                    <div className="flex w-[1px] bg-zinc-200"></div>

                    <div className="flex flex-col">
                      <p className="text-zinc-400">Epoch</p>
                      <div className="text-sm font-medium">
                        {stake?.stakeActiveEpoch
                          ? stake.stakeActiveEpoch
                          : stake.stakeRequestEpoch}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {network?.enableStaking && (
        <div className="fixed w-full bottom-0 left-0 right-0 p-4 border-t border-t-zinc-100 bg-white">
          <Button
            type={'submit'}
            state={'primary'}
            onClick={() => navigate('/staking')}
          >
            Stake
          </Button>
        </div>
      )}
    </div>
  );
}
