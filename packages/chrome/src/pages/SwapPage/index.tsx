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
import { Key, useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { Extendable } from '../../types';
import Img from '../../components/Img';
import Button from '../../components/Button';
import { Select, SelectItem } from './selectSwapToken';
import { useQuery } from '@apollo/client';
import { GET_SUPPORT_SWAP_COINS } from '../../utils/graphql/query';
import TokenItem from '../../components/TokenItem';
import { Token } from 'graphql';
import { CoinType } from '../../types/coin';
type SwapItemProps = Extendable & {
  type: 'From' | 'To';
  data: any;
  defaultValue?: any;
  onChange: (value: string) => void;
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
        // trigger={<TokenInfo />}
      >
        <div className="">
          {props.data?.map((coin: CoinType) => {
            return (
              <SelectItem
                key={coin.type}
                className="focus:outline-0"
                value={coin.type}
              >
                <TokenItem
                  coin={coin}
                  wrapperClass={'py-[20px] px-[20px] border-t border-gray-100'}
                  //     amount = 0,
                  //     symbol,
                  //     iconURL,
                  //     decimals = 0,
                  //     onClick,
                  //     selected,
                  //     isVerified,
                  //     usd,
                  //     pricePercentChange24h,
                  //     wrappedChain,
                  // bridge,
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
      />
    </div>
  );
}

export default function SwapPage() {
  const { accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { address } = useAccount(accountId);
  const sdk = new SDK(clmmMainnet);

  const [fromCoinType, setFromCoinType] = useState<string | null>(null);
  const [toCoinType, setToCoinType] = useState<string | null>(null);
  initPool();

  const [price, setPrice] = useState<any>(null);
  const { loading, error, data } = useQuery(GET_SUPPORT_SWAP_COINS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ownerAddress: address,
    },
    skip: !address,
  });

  useEffect(() => {
    if (address) {
      getRouterPrice(
        '0x2::sui::SUI',
        '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
        '2000000'
      ).then((res) => {
        setPrice(res);
      });
    }
  }, [address]);

  async function initPool() {
    // get all pool info by `getPool`s.
    // const pools = await sdk.Pool.getPools([
    //   '0x4eed0ec3402f2e728eec4d7f6c6649084f2aa243e13d585ac67e3bf81c34039b',
    //   '0x9e9e2344ed891121f5c9c1aac1c1248a643ee0ca44915b948f381c6e14abf9d1',
    //   '0x23eb9bf78ae1f2dce7db9ffb2a42fca933f95b7376d6a057762952026e48b3a1',
    //   '0x79dda36b6853ae25959ec39673d45c2842649d43d5308e7e48c1d2bb280df212',
    //   '0xce9bb831bc323f1c1fee41eae9681f10a81676ae47d297427743c4bbfdd2648b',
    //   '0x014abe87a6669bec41edcaa95aab35763466acb26a46d551325b07808f0c59c1',
    //   '0x6143f5e5122e3c590e3e0d968c0020905b134b0f19e8a9c9ba80a62238715717',
    //   '0x8049d009116269ac04ee14206b7afd8b64b5801279f85401ee4b39779f809134',
    //   '0xa96b0178e9d66635ce3576561429acfa925eb388683992288207dbfffde94b65',
    //   '0xf560ae647391023a4611dc6f975f9b79757b20471da67007c3acb7d5a326c230',
    //   '0xb8a6b18fa8a9d773125b89e6def125a48c28e6d85d7e4f2e1424a62ffcef0bb5',
    //   '0xe63cedb411544f435221df201157db8666c910b7c7dd58c385cbc6a7a26f218b',
    //   '0xbf6e8d5e563a76906cd69035360f886ed56642f764b5f77a96b85b118584abdd',
    //   '0x9252032cf458f62b96dc75239176d447d978a3e52670afa90e6b243cce70a404',
    //   '0x46b44725cae3e9b31b722f79adbc00acc25faa6f41881c635b55a0ee65d9d4f4',
    //   '0x222130182a9513211023f0433ce5083167c8357edad587548741fbd8dc4f211c',
    //   '0xbcf18ddb425dfc3207d57b83e8d105ef11b502a1b6072a8026e3716ac535b035',
    //   '0x20739112ab4d916d05639f13765d952795d53b965d206dfaed92fff7729e29af',
    //   '0x06d8af9e6afd27262db436f0d37b304a041f710c3ea1fa4c3a9bab36b3569ad3',
    //   '0x58fa2616cbaf4051d60d96cc31cd9a546a831676d3f1a9a6c160d6c783c08dc6',
    //   '0x1537fa369c20f39a1a5f1a9c78368af64a3c32e4c770c8561d5b3d9f57024ca9',
    //   '0x2944d4508c6972f858e8919d6e03d3609dfa4a427007c1d637413066b8e93fa7',
    //   '0xaa57c66ba6ee8f2219376659f727f2b13d49ead66435aa99f57bb008a64a8042',
    //   '0xccf8fe1a4ae49e60757e807e4750b595062631ae2d19d33458d30e9e467631d4',
    //   '0x31970253068fc315682301b128b17e6c84a60b1cf0397641395d2b65268ed924',
    //   '0x9ddb0d269d1049caf7c872846cc6d9152618d1d3ce994fae84c1c051ee23b179',
    //   '0xc93fb2ccd960bd8e369bd95a7b2acd884abf45943e459e95835941322e644ef1',
    //   '0x5b0b24c27ccf6d0e98f3a8704d2e577de83fa574d3a9060eb8945eeb82b3e2df',
    //   '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
    //   '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
    // ]);
    // // prepare the data for constructing a transaction path graph.
    // const coinMap = new Map();
    // const poolMap = new Map();
    // for (let i = 0; i < pools.length; i += 1) {
    //   const coin_a = pools[i].coinTypeA;
    //   const coin_b = pools[i].coinTypeB;
    //   coinMap.set(coin_a, {
    //     address: coin_a,
    //     decimals: 9,
    //   });
    //   coinMap.set(coin_b, {
    //     address: coin_b,
    //     decimals: 9,
    //   });
    //   const pair = `${coin_a}-${coin_b}`;
    //   const pathProvider = poolMap.get(pair);
    //   if (pathProvider) {
    //     pathProvider.addressMap.set(pools[i].fee_rate, pools[i].poolAddress);
    //   } else {
    //     poolMap.set(pair, {
    //       base: coin_a,
    //       quote: coin_b,
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
  }

  async function getRouterPrice(base: string, quote: string, amount: string) {
    // // sdk.senderAddress =
    // const byAmountIn = false;
    // // const amount = new BN('2000000');

    // const result = await sdk.Router.price(
    //   base,
    //   quote,
    //   // base,
    //   // quote,
    //   new BN(amount),
    //   byAmountIn,
    //   0.05,
    //   ''
    // );
    // console.log(result);
    // return result;
    sdk.senderAddress = address;

    // Whether the swap direction is token a to token b
    const a2b = true;
    // fix input token amount
    const coinAmount = new BN(1200);
    // input token amount is token a
    const by_amount_in = true;
    // slippage value
    const slippage = Percentage.fromDecimal(d(5));
    // Fetch pool data
    const pool = await sdk.Pool.getPool(
      '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630'
    );

    // Estimated amountIn amountOut fee
    const res: any = await sdk.Swap.preswap({
      pool,
      current_sqrt_price: pool.current_sqrt_price,
      coinTypeA: pool.coinTypeA,
      coinTypeB: pool.coinTypeB,
      decimalsA: 6, // coin a 's decimals
      decimalsB: 8, // coin b 's decimals
      a2b,
      by_amount_in,
      amount,
    });
    console.log(res);

    return res;
    // const toAmount = by_amount_in
    //   ? res.estimatedAmountOut
    //   : res.estimatedAmountIn;
    // const amountLimit = adjustForSlippage(
    //   new BN(toAmount),
    //   slippage,
    //   !by_amount_in
    // );

    // console.log(res, amountLimit.toString(), toAmount);
    // // build swap Payload
    // const swapPayload = sdk.Swap.createSwapTransactionPayload({
    //   pool_id: pool.poolAddress,
    //   coinTypeA: pool.coinTypeA,
    //   coinTypeB: pool.coinTypeB,
    //   a2b,
    //   by_amount_in,
    //   amount: res.amount.toString(),
    //   amount_limit: amountLimit.toString(),
    // });
    // return await swapPayload;
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
    return routerPayload;
  }

  return (
    <AppLayout>
      <div className="w-full">
        <SwapItem
          type="From"
          data={data?.supportedSwapCoins}
          defaultValue="0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"
          onChange={setFromCoinType}
        >
          {JSON.stringify(fromCoinType)}
        </SwapItem>

        <SwapItem
          type="To"
          data={data?.supportedSwapCoins}
          defaultValue="0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
          onChange={setToCoinType}
        >
          {JSON.stringify(toCoinType)}
        </SwapItem>
      </div>

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
