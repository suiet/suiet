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
import { TransactionBlock } from '@mysten/sui.js';
import BN from 'bn.js';
import React, {
  Key,
  useEffect,
  useState,
  CSSProperties,
  ReactNode,
  useRef,
} from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Extendable, OmitToken } from '../../types';
import Img from '../../components/Img';
import Button from '../../components/Button';
import { Select, SelectItem } from './selectSwapToken';
import { useQuery } from '@apollo/client';
import { GET_SUPPORT_SWAP_COINS } from '../../utils/graphql/query';
import TokenItem from '../../components/TokenItem';
import { Token } from 'graphql';
import { CoinType } from '../../types/coin';
import { TokenInfo } from './token';
import {
  CetusSwapClient,
  formatCurrency,
  SendAndExecuteTxParams,
  SwapCoin,
  SwapCoinPair,
  TxEssentials,
} from '@suiet/core';
import { debounce } from 'lodash-es';
import Message from '../../components/message';
import { useAsyncEffect } from 'ahooks';
import { dryRunTransactionBlock } from '../../hooks/transaction/useDryRunTransactionBlock';
import { useApiClient } from '../../hooks/useApiClient';
import { useNetwork } from '../../hooks/useNetwork';
type SwapItemProps = Extendable & {
  type: 'From' | 'To';
  data: CoinType[] | undefined;
  defaultValue?: any;
  onChange: (value: string) => void;
  amount: string;
  onAmountChange?: (value: string) => void;
  trigger: ReactNode;
};

function SwapItem(props: SwapItemProps) {
  return (
    <div className="px-6 py-4 hover:bg-slate-100 transition-all flex justify-between w-full">
      <Select
        className="flex-shrink-0"
        // onValueChange={console.log}
        // layoutClass="fixed left-0 right-0 bottom-0 w-[100wh] h-[400px]"
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        trigger={props.trigger}
      >
        <div className="">
          {props.data?.map((coin) => {
            return (
              <SelectItem
                key={coin.type}
                className="focus:outline-0"
                value={coin.type}
              >
                <TokenItem
                  coin={coin}
                  wrapperClass={'py-[20px] px-[20px] border-t border-gray-100'}
                ></TokenItem>
              </SelectItem>
            );
          })}
        </div>
      </Select>

      <input
        className="focus:outline-0 text-xl flex-shrink text-right bg-transparent w-[160px]"
        // type="text"
        type="number"
        min="0"
        placeholder="0.00"
        value={props.amount}
        onInput={(e) => {
          props.onAmountChange && props.onAmountChange((e.target as any).value);
        }}
      />
    </div>
  );
}

export default function SwapPage() {
  const { accountId, walletId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: network } = useNetwork(networkId);
  const apiClient = useApiClient();
  const { address } = useAccount(accountId);
  const cetusSwapClient = useRef<CetusSwapClient | null>(null);
  const transactionBlock = useRef<TransactionBlock | null>(null);

  const [fromCoinType, setFromCoinType] = useState<string>('0x2::sui::SUI');
  const [toCoinType, setToCoinType] = useState<string>(
    '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN'
  );

  const [fromCoinAmount, setFromCoinAmount] = useState<string>('0');
  const [toCoinAmount, setToCoinAmount] = useState<string>('0');
  const [swapLoading, setSwapLoading] = useState<boolean>(false);

  const [price, setPrice] = useState<any>(null);
  const { loading, error, data } = useQuery(GET_SUPPORT_SWAP_COINS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ownerAddress: address,
    },
    skip: !address,
  });

  const fetchRouterPrice = async () => {
    console.log('execute getRouterPrice');
    if (!cetusSwapClient.current) {
      throw new Error('cetusSwapClient is not ready');
    }
    const priceResult = await cetusSwapClient.current.getRouterPrice({
      priceSplitPoint: 0.05,
    });
    console.log('priceResult', priceResult);
    return priceResult;
  };

  const buildRouterSwapTransaction = (priceResult: any) => {
    if (!cetusSwapClient.current) {
      throw new Error('cetusSwapClient is not ready');
    }
    if (!priceResult) {
      throw new Error('price result is not ready');
    }
    const transactionBlock = cetusSwapClient.current.buildRouterSwapTransaction(
      priceResult.createTxParams
    );

    console.log('transactionBlock', transactionBlock);
    return transactionBlock;
  };

  useEffect(() => {
    if (!address) return;
    const client = new CetusSwapClient(address, clmmMainnet);
    client.loadPools();
    client.loadOwnedCoins();
    cetusSwapClient.current = client;
  }, [address]);

  const updateInfoForSwap = debounce(async (fromAmount: string) => {
    if (!cetusSwapClient.current) return;
    if (!network) return;

    const swapCoinA = new SwapCoin(fromCoinType, 9);
    swapCoinA.setAmountWithDecimals(fromAmount);
    const swapCoinB = new SwapCoin(toCoinType, 6);
    cetusSwapClient.current.createCoinPair(swapCoinA, swapCoinB);
    console.log('set coinPair', cetusSwapClient.current.coinPair);

    if (fromAmount === '0') return;
    const priceResult = await fetchRouterPrice();
    if (!priceResult) {
      Message.error('Cannot find any available route for this coin pair');
      return;
    }
    setPrice(priceResult);

    const txb = buildRouterSwapTransaction(priceResult);
    transactionBlock.current = txb;
    const dryRunRes = await dryRunTransactionBlock({
      transactionBlock: txb,
      apiClient,
      context: {
        walletId,
        accountId,
        network,
      },
    });
    console.log('dryRunRes', dryRunRes);
    if (!dryRunRes) {
      Message.error('Cannot get dryRun result');
      return;
    }
    const toCoinEstimatedChange = dryRunRes.balanceChanges.find(
      (item) => item.coinType === toCoinType
    );
    if (toCoinEstimatedChange) {
      setToCoinAmount(
        formatCurrency(toCoinEstimatedChange.amount, {
          decimals: 6,
        })
      );
    }
  });

  const fromCoinInfo =
    data?.supportedSwapCoins.find(
      (coin: CoinType) => coin.type === fromCoinType
    ) &&
    data?.supportedSwapCoins.find(
      (coin: CoinType) => coin.type === fromCoinType
    );

  const toCoinInfo =
    data?.supportedSwapCoins.find(
      (coin: CoinType) => coin.type === toCoinType
    ) &&
    data?.supportedSwapCoins.find((coin: CoinType) => coin.type === toCoinType);

  const executeSwap = async () => {
    if (!transactionBlock.current) {
      Message.error('Transaction block is not ready');
      return;
    }

    setSwapLoading(true);
    try {
      await apiClient.callFunc<
        SendAndExecuteTxParams<string, OmitToken<TxEssentials>>,
        undefined
      >(
        'txn.signAndExecuteTransactionBlock',
        {
          transactionBlock: transactionBlock.current.serialize(),
          context: {
            network,
            walletId: walletId,
            accountId: accountId,
          },
        },
        { withAuth: true }
      );
      Message.success('Swap successfully');
    } catch (e) {
      Message.error(`Swap failed: ${e.message}`);
      console.error(e);
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full">
        <SwapItem
          type="From"
          data={data?.supportedSwapCoins}
          defaultValue={fromCoinType}
          onChange={(coinType) => {
            setFromCoinType(coinType);
            setFromCoinAmount('0');
            setToCoinAmount('0');
          }}
          amount={fromCoinAmount}
          onAmountChange={(value) => {
            setFromCoinAmount(value);
            if (value === '0') {
              setToCoinAmount('0');
            }
            updateInfoForSwap(value);
          }}
          trigger={<TokenInfo coin={fromCoinInfo}></TokenInfo>}
        ></SwapItem>

        <SwapItem
          type="To"
          data={data?.supportedSwapCoins}
          defaultValue={toCoinType}
          onChange={(coinType) => {
            setToCoinType(coinType);
            setToCoinAmount('0');
          }}
          amount={toCoinAmount}
          trigger={<TokenInfo coin={toCoinInfo}></TokenInfo>}
        >
          {JSON.stringify(toCoinType)}
        </SwapItem>
      </div>

      <div className="mx-[24px]">
        <Button
          className=""
          state="primary"
          onClick={executeSwap}
          loading={swapLoading}
        >
          Swap
        </Button>
      </div>

      <div className="mx-[24px] my-[8px]">
        <div className="w-full flex justify-between">
          <p> Network Fee</p>
          <p> 0.00012 SUI</p>
        </div>
        <div className="w-full flex justify-between">
          <p> Transaction Fee</p>
          <p> 0.00012 SUI</p>
        </div>
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
  // aggregatorUrl: 'https://aggregator.suiet.app',
};
