// import cetus from '@cetusprotocol/cetus-sui-clmm-sdk';
import SDK, {
  Percentage,
  SdkOptions,
  adjustForSlippage,
  TransactionUtil,
  d,
} from '@cetusprotocol/cetus-sui-clmm-sdk/dist';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { TransactionBlock, getTotalGasUsed } from '@mysten/sui.js';
import { SuiSignAndExecuteTransactionBlockOutput } from '@mysten/wallet-standard';
import BN from 'bn.js';
import React, {
  Key,
  useEffect,
  useState,
  CSSProperties,
  ReactNode,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Extendable, OmitToken } from '../../types';
import Img from '../../components/Img';
import Button from '../../components/Button';
import { useQuery } from '@apollo/client';
import { GET_SUPPORT_SWAP_COINS } from '../../utils/graphql/query';
import { TokenInfo } from '../../components/TokenItem';
import { Token } from 'graphql';
import { CoinType } from '../../types/coin';
import useCoins from '../../hooks/coin/useCoins';
import {
  CetusSwapClient,
  formatCurrency,
  formatSUI,
  SendAndExecuteTxParams,
  SwapCoin,
  SwapCoinPair,
  TxEssentials,
  calculateCoinAmount,
} from '@suiet/core';
import { debounce } from 'lodash-es';
import Message from '../../components/message';
import { useAsyncEffect } from 'ahooks';
import { dryRunTransactionBlock } from '../../hooks/transaction/useDryRunTransactionBlock';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetwork } from '../../hooks/useNetwork';
import SwapItem from './swapItem';
import Alert from '../../components/Alert';
// import { ExchageIcon}
import { ReactComponent as IconExchange } from '../../assets/icons/exchange.svg';
import formatInputCoinAmount from '../../components/InputAmount/formatInputCoinAmount';

import { useFeatureFlagsWithNetwork } from '../../hooks/useFeatureFlags';
import { useNavigate } from 'react-router-dom';
import Slider from './slider';
import Big from 'big.js';
import classNames from 'classnames';
import { isSuiToken } from '../../utils/check';

export default function SwapPage() {
  const { accountId, walletId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const featureFlags = useFeatureFlagsWithNetwork();
  const { data: network } = useNetwork(networkId);
  const apiClient = useApiClient();
  const { address } = useAccount(accountId);
  const cetusSwapClient = useRef<CetusSwapClient | null>(null);
  const transactionBlock = useRef<TransactionBlock | null>(null);
  const {
    data: coins,
    loading: isLoading,
    error: coinsError,
    client,
  } = useCoins(address);
  const [fromCoinType, setFromCoinType] = useState<string>('0x2::sui::SUI');
  const [toCoinType, setToCoinType] = useState<string>(
    '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN'
  );

  const [estimatedGasFee, setEstimatedGasFee] = useState<number>(200000000);
  const [estimatedTxFee, setEstimatedTxFee] = useState<number | null>(null);

  const [fromCoinAmount, setFromCoinAmount] = useState<string>('');
  const [toCoinAmount, setToCoinAmount] = useState<string>('');
  const [swapLoading, setSwapLoading] = useState<boolean>(false);
  const [swapSubmitting, setSwapSubmitting] = useState<boolean>(false);
  const [isSwapAvailable, setIsSwapAvailable] = useState<boolean>(false);
  const [price, setPrice] = useState<any>(null);
  const { loading, error, data } = useQuery(GET_SUPPORT_SWAP_COINS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ownerAddress: address,
    },
    skip: !address,
  });
  const filteredData = data?.supportedSwapCoins?.filter((coin: CoinType) => {
    if (!coin.swapPool?.cetus) {
      return false;
    }

    return coin.swapPool?.cetus?.length > 0;
  });
  const [slippageValue, setSlippageValue] = useState<number>(5);
  const slippagePercentage = useMemo(
    () => Percentage.fromDecimal(d(slippageValue)),
    [slippageValue]
  );
  const navigate = useNavigate();

  const getCoinInfo = useCallback(
    (coinType: string): CoinType | undefined => {
      return filteredData?.find((coin: CoinType) => coin.type === coinType);
    },
    [data]
  );

  const fromCoinInfo = getCoinInfo(fromCoinType);
  const toCoinInfo = getCoinInfo(toCoinType);
  const fromCoinPools = fromCoinInfo ? fromCoinInfo?.swapPool?.cetus : [];
  const fromCoinSupportedCoinTypes = fromCoinPools
    ? [
        ...new Set(
          fromCoinPools
            ?.map((pool) => {
              if (pool.coinTypeA === fromCoinType) {
                return pool.coinTypeB;
              }
              if (pool.coinTypeB === fromCoinType) {
                return pool.coinTypeA;
              }
              return null;
            })
            .filter((item) => item)
        ),
      ]
    : [];
  const supportedToCoins = fromCoinInfo
    ? filteredData.filter((coin: CoinType) =>
        fromCoinSupportedCoinTypes.includes(coin.type)
      )
    : filteredData;

  const buildSwapTransaction = (payload: any) => {
    if (!cetusSwapClient.current) {
      throw new Error('cetusSwapClient is not ready');
    }
    if (!payload) {
      throw new Error('price result is not ready');
    }
    const transactionBlock =
      cetusSwapClient.current.buildSwapTransaction(payload);

    console.log('transactionBlock', transactionBlock);
    return transactionBlock;
  };
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputErrorMessage, setInputErrorMessage] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (!address) return;
    cetusSwapClient.current = null;
    const client = new CetusSwapClient(address, clmmMainnet);
    // client.loadPools([], undefined, 1000);
    client.loadOwnedCoins();
    cetusSwapClient.current = client;
  }, [address]);

  useEffect(() => {
    if (!(Number(fromCoinAmount) > 0)) {
      setIsSwapAvailable(false);
    }
  }, [fromCoinAmount]);

  const updateInfoForSwap = useCallback(
    debounce(
      async (
        fromAmount: string | undefined,
        fromCoinType: string,
        toCoinType: string,
        slippage: Percentage
      ) => {
        setInputErrorMessage(null);
        setErrorMessage(null);
        setWarningMessage(null);
        if (!fromAmount || fromAmount === '0') {
          setToCoinAmount('');
          return;
        }
        if (!cetusSwapClient.current) return;
        if (!network) return;

        const fromCoinInfo = getCoinInfo(fromCoinType);
        const toCoinInfo = getCoinInfo(toCoinType);
        if (!fromCoinInfo || !toCoinInfo) return;
        setSwapLoading(true);
        const swapPool = fromCoinInfo.swapPool?.cetus?.find(
          (pool) =>
            (pool.coinTypeA === fromCoinType &&
              pool.coinTypeB === toCoinType) ||
            (pool.coinTypeB === fromCoinType && pool.coinTypeA === toCoinType)
        );
        // console.log('swapPool', swapPool);
        if (!swapPool) {
          console.log('no avaliable pool');
          setErrorMessage('Token pair not avaliable');
          setIsSwapAvailable(false);
          setSwapLoading(false);
          return;
        }
        // Whether the swap direction is token a to token b
        const a2b = swapPool.coinTypeA === fromCoinType;

        let coinInfoA, coinInfoB;
        if (a2b) {
          coinInfoA = fromCoinInfo;
          coinInfoB = toCoinInfo;
        } else {
          coinInfoA = fromCoinInfo;
          coinInfoB = toCoinInfo;
        }

        // fix input token amount
        const amount = new BN(
          calculateCoinAmount(fromAmount, fromCoinInfo.metadata.decimals)
        );
        // input token amount is token a
        const byAmountIn = true;
        // slippage value
        // Fetch pool data
        const pool = await cetusSwapClient.current?.sdk.Pool.getPool(
          swapPool.poolAddress
        );

        // Estimated amountIn amountOut fee
        const res: any = await cetusSwapClient.current?.sdk.Swap.preswap({
          pool,
          current_sqrt_price: pool.current_sqrt_price,
          coinTypeA: swapPool.coinTypeA,
          coinTypeB: swapPool.coinTypeB,
          decimalsA: coinInfoA.metadata.decimals, // coin a 's decimals
          decimalsB: coinInfoB.metadata.decimals, // coin b 's decimals
          a2b,
          by_amount_in: byAmountIn,
          amount,
        });

        setToCoinAmount(
          // (res.estimatedAmountOut, {
          //   decimals: toCoinInfo.metadata.decimals,
          // })
          Big(res.estimatedAmountOut)
            .div(Big(10).pow(toCoinInfo.metadata.decimals))
            .toString()
        );
        setEstimatedTxFee(res.estimatedFeeAmount);

        console.log('res', res);

        if (Number(res.estimatedAmountOut) === 0) {
          setSwapLoading(false);
          setIsSwapAvailable(false);
          setWarningMessage('Swap pool not avaliable');
          return;
        }

        const currentCoinBalance = coins?.find(
          (coin) => coin.type === fromCoinType
        )?.balance;

        if (!currentCoinBalance || currentCoinBalance === '0') {
          setSwapLoading(false);
          setIsSwapAvailable(false);
          setInputErrorMessage('Amount exceeds');
          return;
        }

        // if trying larger amount, skip dry run
        if (
          BigInt(
            calculateCoinAmount(fromAmount, fromCoinInfo.metadata.decimals)
          ) > BigInt(currentCoinBalance)
        ) {
          setSwapLoading(false);
          setIsSwapAvailable(false);
          setInputErrorMessage('Amount exceeds');
          return;
        }

        if (!fromAmount || fromAmount === '0') {
          setIsSwapAvailable(false);
          setSwapLoading(false);
          return;
        }

        const toAmount = byAmountIn
          ? res.estimatedAmountOut
          : res.estimatedAmountIn;

        const amountLimit = adjustForSlippage(
          new BN(toAmount),
          slippage,
          !byAmountIn
        );

        const swapPartnerId = featureFlags?.cetus_partner_id
          ? featureFlags?.cetus_partner_id
          : undefined;
        const txb = buildSwapTransaction({
          pool_id: pool.poolAddress,
          coinTypeA: pool.coinTypeA,
          coinTypeB: pool.coinTypeB,
          a2b,
          by_amount_in: byAmountIn,
          amount: res.amount.toString(),
          amount_limit: amountLimit.toString(),
          swap_partner: swapPartnerId,
        });
        transactionBlock.current = txb;
        try {
          const dryRunRes = await dryRunTransactionBlock({
            transactionBlock: txb,
            apiClient,
            context: {
              walletId,
              accountId,
              network,
            },
          });

          if (!dryRunRes) {
            setIsSwapAvailable(false);
            setSwapLoading(false);

            const e = (
              dryRunRes as unknown as SuiSignAndExecuteTransactionBlockOutput
            ).effects?.status.error;
            setErrorMessage(e ?? 'Cannot get dryRun result');

            return;
          }
          setEstimatedGasFee(Number(getTotalGasUsed(dryRunRes.effects)));

          setSwapLoading(false);
          setIsSwapAvailable(true);
        } catch (e) {
          console.error(e);
          setIsSwapAvailable(false);
          setSwapLoading(false);
          setErrorMessage(e.message);
        }
      },
      300,
      {
        leading: false,
        trailing: true,
      }
    ),
    [network, getCoinInfo, coins, featureFlags]
  );

  function switchFromAndTo() {
    const tempFromCoinType = fromCoinType;
    const tempToCoinAmount = toCoinAmount;
    const tempToCoinType = toCoinType;
    setFromCoinType(tempToCoinType);
    setToCoinType(tempFromCoinType);
    setFromCoinAmount(tempToCoinAmount);
    setToCoinAmount('');
    setSwapLoading(true);

    // setTimeout(() => {
    //   setSwapLoading(true);
    updateInfoForSwap(
      tempToCoinAmount,
      tempToCoinType,
      tempFromCoinType,
      slippagePercentage
    );
    // }, 500);/
  }

  const executeSwap = async () => {
    if (!transactionBlock.current) {
      Message.error('Transaction block is not ready');
      return;
    }

    setSwapSubmitting(true);
    try {
      const resp = await apiClient.callFunc<
        SendAndExecuteTxParams<string, OmitToken<TxEssentials>>,
        undefined
      >(
        'txn.signAndExecuteTransactionBlock',
        {
          transactionBlock: transactionBlock.current.serialize(),
          context: {
            network,
            walletId,
            accountId,
          },
        },
        { withAuth: true }
      );
      if (
        (resp as unknown as SuiSignAndExecuteTransactionBlockOutput).effects
          ?.status.status === 'success'
      ) {
        Message.success('Swap successfully');
        client.resetStore();
        setTimeout(() => {
          client.resetStore();
        }, 1000);
        navigate('/transaction/flow');
      } else {
        Message.error(
          `Swap failed: ${
            (resp as unknown as SuiSignAndExecuteTransactionBlockOutput).effects
              ?.status.error
          }`
        );
      }
    } catch (e) {
      Message.error(`Swap failed: ${e.message}`);

      console.error(e);
    } finally {
      setSwapSubmitting(false);
    }
  };

  function formatSlippage(slippageValue: number) {
    return `${(slippageValue / 100).toFixed(2)}%`;
  }

  function getMaxAmount(): number {
    // estimatedGasFee
    if (isSuiToken(fromCoinInfo?.type)) {
      return fromCoinInfo?.balance
        ? Big(fromCoinInfo?.balance)
            .minus(Big(estimatedGasFee).times(2))
            .div(Big(10).pow(fromCoinInfo?.metadata.decimals))
            .toString()
        : '0';
    }
    return fromCoinInfo?.balance
      ? Big(fromCoinInfo?.balance)
          .div(Big(10).pow(fromCoinInfo?.metadata.decimals))
          .toString()
      : '0';
  }

  return (
    <AppLayout className="relative">
      <div className="w-full relative mt-[24px]">
        <SwapItem
          type="From"
          data={filteredData}
          defaultValue={fromCoinType}
          value={fromCoinType}
          onChange={(coinType) => {
            setFromCoinType(coinType);
            setFromCoinAmount('');
            setToCoinAmount('');

            // when to token pair is not exists
            const coinInfo = getCoinInfo(coinType);
            const supportedCoins = [
              ...new Set(
                coinInfo?.swapPool?.cetus
                  ?.map((pool) => {
                    if (pool.coinTypeA === coinType) {
                      return pool.coinTypeB;
                    }
                    if (pool.coinTypeB === coinType) {
                      return pool.coinTypeA;
                    }
                    return null;
                  })
                  .filter((item) => item)
              ),
            ];
            // debugger;
            if (
              !supportedCoins.includes(toCoinType) &&
              supportedCoins.length > 0
            ) {
              if (supportedCoins[0]) {
                setToCoinType(supportedCoins[0]);
              } else {
                setErrorMessage('No token pair is avaliable');
              }
            }
          }}
          coinInfo={fromCoinInfo}
          amount={fromCoinAmount}
          inputErrorMessage={inputErrorMessage}
          onAmountChange={(value) => {
            setFromCoinAmount(value);
            setToCoinAmount('');
            updateInfoForSwap(
              value,
              fromCoinType,
              toCoinType,
              slippagePercentage
            );
          }}
          maxAmount={getMaxAmount().toString()}
          trigger={<TokenInfo coin={fromCoinInfo}></TokenInfo>}
        ></SwapItem>
        <div className="h-[32px] relative">
          <div className="absolute border h-0 w-full border-gray-100 top-0 bottom-0 my-auto"></div>
          <button
            className="absolute top-0 bottom-0 left-[28px] my-auto"
            onClick={switchFromAndTo}
          >
            <IconExchange className="w-[32px] h-[32px]" />
          </button>
          <div className="pl-[100px] pr-[24px] w-full h-8">
            {getMaxAmount() > 0 && (
              <Slider
                className={classNames('w-full', 'h-8')}
                value={Number(fromCoinAmount)}
                onChange={(value) => {
                  setFromCoinAmount(value.toString());
                  setToCoinAmount('');
                  updateInfoForSwap(
                    value.toString(),
                    fromCoinType,
                    toCoinType,
                    slippagePercentage
                  );
                }}
                max={getMaxAmount()}
              ></Slider>
            )}
          </div>
        </div>
        <SwapItem
          type="To"
          data={supportedToCoins}
          defaultValue={toCoinType}
          value={toCoinType}
          coinInfo={toCoinInfo}
          onChange={(coinType) => {
            setToCoinType(coinType);
            setToCoinAmount('');
            updateInfoForSwap(
              fromCoinAmount,
              fromCoinType,
              coinType,
              slippagePercentage
            );
          }}
          amount={toCoinAmount}
          trigger={<TokenInfo coin={toCoinInfo}></TokenInfo>}
        >
          {JSON.stringify(toCoinType)}
        </SwapItem>
      </div>

      <div className="min-h-[48px] mx-[24px] flex flex-col gap-2 mb-[8px]">
        {warningMessage && (
          <Alert type="warn" className="break-words">
            {' '}
            {warningMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert type="error" className="break-words">
            {' '}
            {errorMessage}
          </Alert>
        )}
      </div>

      <div className="mx-[24px] mt-[8px] mb-8 flex flex-col gap-2">
        <div className="w-full flex text-zinc-800 justify-between font-medium">
          <p> Estmate Gas Fee</p>
          <p className="text-zinc-400"> {formatSUI(estimatedGasFee)} SUI</p>
        </div>
        <div className="w-full flex text-zinc-800 justify-between font-medium">
          <p>Router</p>
          <p className="text-zinc-400">Cetus</p>
        </div>
        <div className="w-full flex text-zinc-800 justify-between font-medium">
          <p>Slippage</p>
          <p className="text-zinc-400">{formatSlippage(slippageValue)}</p>
        </div>
      </div>
      <div className="h-[48px]"></div>

      <div className="fixed bottom-[72px] w-full px-[24px] bg-white py-[12px]">
        <Button
          className=""
          state="primary"
          onClick={executeSwap}
          loading={swapLoading || swapSubmitting}
          disabled={!isSwapAvailable || !cetusSwapClient.current}
        >
          {swapLoading ? 'Loading' : swapSubmitting ? 'Submitting' : 'Swap'}
        </Button>
      </div>
    </AppLayout>
  );
}

const SDKConfig = {
  clmmConfig: {
    pools_id:
      '0xf699e7f2276f5c9a75944b37a0c5b5d9ddfd2471bf6242483b03ab2887d198d0',
    global_config_id:
      '0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f',
    global_vault_id:
      '0xce7bceef26d3ad1f6d9b6f13a953f053e6ed3ca77907516481ce99ae8e588f2b',
    admin_cap_id:
      '0x89c1a321291d15ddae5a086c9abc533dff697fde3d89e0ca836c41af73e36a75',
  },
  cetusConfig: {
    coin_list_id:
      '0x8cbc11d9e10140db3d230f50b4d30e9b721201c0083615441707ffec1ef77b23',
    launchpad_pools_id:
      '0x1098fac992eab3a0ab7acf15bb654fc1cf29b5a6142c4ef1058e6c408dd15115',
    clmm_pools_id:
      '0x15b6a27dd9ae03eb455aba03b39e29aad74abd3757b8e18c0755651b2ae5b71e',
    admin_cap_id:
      '0x39d78781750e193ce35c45ff32c6c0c3f2941fa3ddaf8595c90c555589ddb113',
    global_config_id:
      '0x0408fa4e4a4c03cc0de8f23d0c2bbfe8913d178713c9a271ed4080973fe42d8f',
    coin_list_handle:
      '0x49136005e90e28c4695419ed4194cc240603f1ea8eb84e62275eaff088a71063',
    launchpad_pools_handle:
      '0x5e194a8efcf653830daf85a85b52e3ae8f65dc39481d54b2382acda25068375c',
    clmm_pools_handle:
      '0x37f60eb2d9d227949b95da8fea810db3c32d1e1fa8ed87434fc51664f87d83cb',
  },
};

export const clmmMainnet = {
  fullRpcUrl: 'https://mainnet.suiet.app',
  faucetURL: '',
  faucet: {
    faucet_display:
      '0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96',
    faucet_router:
      '0x0588cff9a50e0eaf4cd50d337c1a36570bc1517793fd3303e1513e8ad4d2aa96',
  },
  simulationAccount: {
    address:
      '0x326ce9894f08dcaa337fa232641cc34db957aec9ff6614c1186bc9a7508df0bb',
  },
  cetus_config: {
    config_display:
      '0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f',
    config_router:
      '0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f',
    config: SDKConfig.cetusConfig,
  },
  token: {
    token_display: '',
    config: SDKConfig.tokenConfig,
  },
  clmm: {
    clmm_display:
      '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb',
    clmm_router:
      '0x886b3ff4623c7a9d101e0470012e0612621fbc67fa4cedddd3b17b273e35a50e',
    config: SDKConfig.clmmConfig,
  },
  deepbook: {
    deepbook_display:
      '0x000000000000000000000000000000000000000000000000000000000000dee9',
    deepbook_endpoint_v2:
      '0xeab65f3cec37f1936ea4751b87c37b8d3d1dc0f2d3242cd532d787d63774ebfa',
  },
};
