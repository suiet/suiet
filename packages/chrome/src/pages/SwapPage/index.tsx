// import cetus from '@cetusprotocol/cetus-sui-clmm-sdk';
import SDK, {
  Percentage,
  SdkOptions,
  adjustForSlippage,
  TransactionUtil,
  d,
} from '@cetusprotocol/cetus-sui-clmm-sdk/dist';

import { TransactionBlock } from '@mysten/sui.js';
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Extendable } from '../../types';
import Img from '../../components/Img';
import Button from '../../components/Button';
type SwapItemProps = Extendable & {
  coinType: string;
};

function SwapItem(props: SwapItemProps) {
  return (
    <div className="px-6 py-4 hover:bg-slate-50 flex justify-between">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Img
          className="w-[32px] h-[32px] items-center"
          src="https://assets.suiet.app/img/coins/eth.png"
        ></Img>
        <div>
          <p>From</p>
          <p className="font-bold text-large">USDT</p>
        </div>
      </div>

      <input
        className="focus:outline-0 text-xl flex-shrink text-right"
        type="text"
        placeholder="0.00"
      />
    </div>
  );
}

export default function SwapPage() {
  const sdk = new SDK(clmmMainnet);
  const [price, setPrice] = useState<any>(null);

  useEffect(() => {
    getRouterPrice(
      '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdt::USDT',
      '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdc::USDC',
      '2000000'
    ).then((res) => {
      setPrice(res);
    });
  });

  async function getRouterPrice(base: string, quote: string, amount: string) {
    const byAmountIn = true;
    // const amount = new BN('2000000');

    const result = await sdk.Router.price(
      '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdt::USDT',
      '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdc::USDC',
      // base,
      // quote,
      new BN(amount),
      byAmountIn,
      0.05,
      ''
    );
    console.log(result);
    return result;
  }
  async function buildRouterSwapTransaction(
    base: string,
    quote: string,
    amount: string
  ): Promise<TransactionBlock> {
    // const sdk = new SDK(clmmMainnet);

    // get all pool info by `getPool`s.
    // const pools = await sdk.Pool.getPools([]);

    // // prepare the data for constructing a transaction path graph.
    // const coinMap = new Map();
    // const poolMap = new Map();

    // for (let i = 0; i < pools.length; i += 1) {
    //   const coinA = pools[i].coinTypeA;
    //   const coinB = pools[i].coinTypeB;

    //   coinMap.set(coinA, {
    //     address: coinA,
    //     decimals: 9,
    //   });
    //   coinMap.set(coinB, {
    //     address: coinB,
    //     decimals: 9,
    //   });

    //   const pair = `${coinA}-${coinB}`;
    //   const pathProvider = poolMap.get(pair);
    //   if (pathProvider) {
    //     pathProvider.addressMap.set(pools[i].fee_rate, pools[i].poolAddress);
    //   } else {
    //     poolMap.set(pair, {
    //       base: coinA,
    //       quote: coinB,
    //       addressMap: new Map([[pools[i].fee_rate, pools[i].poolAddress]]),
    //     });
    //   }
    // }

    // const coins = {
    //   coins: Array.from(coinMap.values()),
    // };
    // const paths = {
    //   paths: Array.from(poolMap.values()),
    // };

    // // Load the path graph.
    // sdk.Router.loadGraph(coins, paths);

    // The first two addresses requiring coin types.
    // const byAmountIn = false;
    // const amount = new BN('1000000000000');
    // const result = await sdk.Router.price(
    //   ETH,
    //   CETUS,
    //   amount,
    //   byAmountIn,
    //   0.05,
    //   ''
    // );
    const byAmountIn = true;
    // const amount = new BN('2000000');

    const result = await sdk.Router.price(
      // '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdt::USDT',
      // '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdc::USDC',
      base,
      quote,
      new BN(amount),
      byAmountIn,
      0.05,
      ''
    );

    const params = {
      paths: [result?.paths![0]!, result?.paths![1]!],
      partner: '',
      priceSplitPoint: 0,
    };

    const allCoinAsset = await sdk.getOwnerCoinAssets(sdk.senderAddress);
    const routerPayload = TransactionUtil.buildRouterSwapTransaction(
      sdk,
      params,
      true,
      allCoinAsset
    );
    return await routerPayload;
  }

  return (
    <AppLayout>
      <div className="w-full">
        <SwapItem coinType="0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdt::USDT"></SwapItem>
        <SwapItem coinType="0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdc::USDC"></SwapItem>
      </div>
      <div>Swap Page</div>
      <p>{JSON.stringify(price)}</p>

      <div className="mx-[24px]">
        <Button className="" state="primary">
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
  aggregatorUrl: 'https://aggregator.suiet.app',
};
