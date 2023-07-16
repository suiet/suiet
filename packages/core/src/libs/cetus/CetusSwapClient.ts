import SDK, {
  SdkOptions,
  TransactionUtil,
} from '@cetusprotocol/cetus-sui-clmm-sdk/dist';
import {
  PreSwapWithMultiPoolParams,
  SuiAddressType,
  SuiObjectIdType,
} from '@cetusprotocol/cetus-sui-clmm-sdk';
import BN from 'bn.js';
import { isNonEmptyArray } from '../../utils';

type OnePath = {
  amountIn: BN;
  amountOut: BN;
  poolAddress: string[];
  a2b: boolean[];
  rawAmountLimit: BN[];
  isExceed: boolean;
  coinType: string[];
};
type SwapWithRouterParams = {
  paths: OnePath[];
  partner: string;
  priceSplitPoint: number;
};
type PriceResult = {
  amountIn: BN;
  amountOut: BN;
  paths: OnePath[];
  a2b: boolean;
  b2c: boolean | undefined;
  byAmountIn: boolean;
  isExceed: boolean;
  targetSqrtPrice: BN[];
  currentSqrtPrice: BN[];
  coinTypeA: SuiAddressType;
  coinTypeB: SuiAddressType;
  coinTypeC: SuiAddressType | undefined;
  createTxParams: SwapWithRouterParams | undefined;
};
type CoinAsset = {
  coinAddress: SuiAddressType;
  coinObjectId: SuiObjectIdType;
  balance: bigint;
};

export class SwapCoin {
  private _type: string;
  private _decimals: number;
  private _amount: bigint;

  constructor(type: string, decimals = 0) {
    this._type = type;
    this._decimals = decimals;
    this._amount = BigInt(0);
  }

  setAmount(amount: bigint) {
    this._amount = amount;
  }

  setAmountWithDecimals(amount: number | string) {
    this._amount = BigInt(amount) * BigInt(Math.pow(10, this._decimals));
  }

  get type() {
    return this._type;
  }
  get amount() {
    return this._amount;
  }
  get decimals() {
    return this._decimals;
  }
}

/**
 * Direction would always be from coinA to coinB
 */
export class SwapCoinPair {
  coinA: SwapCoin;
  coinB: SwapCoin;

  constructor(coinA: SwapCoin, coinB: SwapCoin) {
    this.coinA = coinA;
    this.coinB = coinB;
  }

  swapPosition() {
    const tmpCoin = this.coinA;
    this.coinA = this.coinB;
    this.coinB = tmpCoin;
  }
}

export class CetusSwapClient {
  private readonly _clmmConfig: Record<string, any>;
  private readonly _sdk: any;
  private _pools: any[];
  private _coinPair: SwapCoinPair | null;
  private _priceResult: PriceResult | null;
  private _ownedCoins: CoinAsset[];
  private _userAddress: string;

  constructor(userAddress: string, clmmConfig: SdkOptions) {
    this._clmmConfig = clmmConfig;
    this._userAddress = userAddress;
    this._sdk = new SDK(clmmConfig);
    this._sdk.senderAddress = userAddress;

    this._pools = [];
    this._coinPair = null;
    this._ownedCoins = [];
  }

  public createCoinPair(coinA: SwapCoin, coinB: SwapCoin) {
    this._coinPair = new SwapCoinPair(coinA, coinB);
  }

  public buildRouterSwapTransaction(swapRouterParams: SwapWithRouterParams) {
    if (!swapRouterParams) {
      throw new Error('swapRouterParams is required');
    }
    if (!isNonEmptyArray(this._ownedCoins)) {
      throw new Error('Owned coins are not loaded');
    }
    const byAmountIn = true;

    const txb = TransactionUtil.buildRouterSwapTransaction(
      this._sdk,
      swapRouterParams,
      byAmountIn,
      this._ownedCoins
    );
    return txb;
  }

  async getRouterPrice(opts?: {
    priceSplitPoint?: number;
    partner?: string;
    swapWithMultiPoolParams?: PreSwapWithMultiPoolParams;
  }) {
    if (!this._coinPair) {
      throw new Error('Coin pair is not created');
    }
    const { priceSplitPoint = 0, partner = '' } = opts || {};
    const { coinA, coinB } = this._coinPair;
    const byAmountIn = true;
    return this._sdk.Router.price(
      coinA.type,
      coinB.type,
      new BN(String(coinA.amount)),
      byAmountIn,
      priceSplitPoint,
      partner,
      opts?.swapWithMultiPoolParams
    );
  }

  async loadPools(assignPools?: string[], offset?: number, limit?: number) {
    const pools = await this._sdk.Pool.getPools(assignPools, offset, limit);
    if (!Array.isArray(pools)) {
      throw new Error('Pools should be an array');
    }
    this._pools = pools;
    this.loadGraphByPools(pools);
  }

  private loadGraphByPools(pools: any[]) {
    const coinMap = new Map();
    const poolMap = new Map();

    for (let i = 0; i < pools.length; i += 1) {
      const coinA = pools[i].coinTypeA;
      const coinB = pools[i].coinTypeB;

      coinMap.set(coinA, {
        address: coinA,
        decimals: 9,
      });
      coinMap.set(coinB, {
        address: coinB,
        decimals: 9,
      });

      const pair = `${coinA}-${coinB}`;
      const pathProvider = poolMap.get(pair);
      if (pathProvider) {
        pathProvider.addressMap.set(pools[i].fee_rate, pools[i].poolAddress);
      } else {
        poolMap.set(pair, {
          base: coinA,
          quote: coinB,
          addressMap: new Map([[pools[i].fee_rate, pools[i].poolAddress]]),
        });
      }
    }

    const coins = {
      coins: Array.from(coinMap.values()),
    };
    const paths = {
      paths: Array.from(poolMap.values()),
    };
    this._sdk.Router.loadGraph(coins, paths);
  }

  async loadOwnedCoins() {
    this._ownedCoins = await this._sdk.getOwnerCoinAssets(this._userAddress);
  }

  get coinPair() {
    return this._coinPair;
  }
}
