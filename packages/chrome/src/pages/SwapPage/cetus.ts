import SDK, {
  Percentage,
  SdkOptions,
  adjustForSlippage,
  d,
} from '@cetusprotocol/cetus-sui-clmm-sdk/dist';

import {
  JsonRpcProvider,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
  mainnetConnection,
} from '@mysten/sui.js';
import BN from 'bn.js';

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

export class CetusPool extends Pool<CetusParams> {
  private readonly sdk: SDK;
  private readonly provider: JsonRpcProvider;
  private readonly senderAddress: string;

  constructor(
    address: string,
    senderAddress: string,
    coinTypeA: string,
    coinTypeB: string
  ) {
    super(address, coinTypeA, coinTypeB);
    this.sdk = new SDK(clmmMainnet);
    this.sdk.senderAddress = senderAddress;

    this.provider = new JsonRpcProvider(mainnetConnection);
    this.senderAddress = senderAddress;
  }

  /**
   * Create swap transaction
   * @param transactionBlock Transaction block
   * @param params Cetus parameters
   * @returns Transaction block
   */
  async createSwapTransaction(
    transactionBlock: TransactionBlock,
    params: CetusParams
  ): Promise<TransactionBlock> {
    const totalBalance = await getTotalBalanceByCoinType(
      this.provider,
      this.senderAddress,
      params.a2b ? this.coinTypeA : this.coinTypeB
    );

    console.log(
      `TotalBalance for CoinType (${
        params.a2b ? this.coinTypeA : this.coinTypeB
      }), is: ${totalBalance} and amountIn is: ${params.amountIn}`
    );

    if (params.amountIn > 0 && Number(totalBalance) >= params.amountIn) {
      const txb = await this.createCetusTransactionBlockWithSDK(params);

      let target = '';
      let args: string[] = [];
      let typeArguments: string[] = [];
      let coins: string[] = [];

      let packageName: string = '';
      let moduleName: string = '';
      let functionName: string = '';

      const moveCall = txb.blockData.transactions.find((obj) => {
        if (obj.kind === 'MoveCall') return obj.target;
      });

      if (moveCall?.kind === 'MoveCall' && moveCall?.target) {
        target = moveCall.target;
        [packageName, moduleName, functionName] = target.split('::');
      }

      const inputs = txb.blockData.inputs;

      args = [];

      inputs.forEach((input) => {
        if (
          input.kind === 'Input' &&
          (input.type === 'object' || input.type === 'pure')
        )
          args.push(input.value);
      });

      if (moveCall?.kind === 'MoveCall' && moveCall?.typeArguments)
        typeArguments = moveCall.typeArguments;

      const makeMoveVec = txb.blockData.transactions.find((obj) => {
        if (obj.kind === 'MakeMoveVec') return obj;
      });
      if (makeMoveVec?.kind === 'MakeMoveVec' && makeMoveVec?.objects)
        coins = makeMoveVec.objects
          .filter((obj) => obj.kind === 'Input' && obj.value)
          .map((obj) =>
            obj.kind === 'Input' && obj?.value ? obj.value : null
          );

      args = args.filter((item) => !coins.includes(item));

      transactionBlock.moveCall({
        target: `${packageName}::${moduleName}::${functionName}`,
        arguments: [
          transactionBlock.object(args[0]),
          transactionBlock.object(args[1]),
          transactionBlock.makeMoveVec({
            objects: coins.map((id) => transactionBlock.object(id)),
          }),
          transactionBlock.pure(args[2]),
          transactionBlock.pure(args[3]),
          transactionBlock.pure(args[4]),
          transactionBlock.pure(args[5]),
          transactionBlock.object(SUI_CLOCK_OBJECT_ID),
        ],
        typeArguments,
      });

      return transactionBlock;
    }
    return transactionBlock;
  }

  async estimatePriceAndFee(): Promise<{
    price: number;
    fee: number;
  }> {
    const pool = await this.sdk.Pool.getPool(this.uri);

    const price = pool.current_sqrt_price ** 2 / 2 ** 128;
    const fee = pool.fee_rate * 10 ** -6;

    return {
      price,
      fee,
    };
  }

  async createCetusTransactionBlockWithSDK(
    params: CetusParams
  ): Promise<TransactionBlock> {
    console.log(
      `a2b: ${params.a2b}, amountIn: ${params.amountIn}, amountOut: ${params.amountOut}, byAmountIn: ${params.byAmountIn}, slippage: ${params.slippage}`
    );

    // fix input token amount
    const coinAmount = new BN(params.amountIn);
    // input token amount is token a
    const byAmountIn = true;
    // slippage value
    const slippage = Percentage.fromDecimal(d(5));
    // Fetch pool data
    const pool = await this.sdk.Pool.getPool(this.uri);
    // Estimated amountIn amountOut fee

    // Load coin info
    const coinA = getCoinInfo(this.coinTypeA);
    const coinB = getCoinInfo(this.coinTypeB);

    const res: any = await this.sdk.Swap.preswap({
      a2b: params.a2b,
      amount: coinAmount.toString(),
      by_amount_in: byAmountIn,
      coinTypeA: this.coinTypeA,
      coinTypeB: this.coinTypeB,
      current_sqrt_price: pool.current_sqrt_price,
      decimalsA: coinA.decimals,
      decimalsB: coinB.decimals,
      pool,
    });

    const toAmount = byAmountIn
      ? res.estimatedAmountOut
      : res.estimatedAmountIn;
    // const amountLimit = adjustForSlippage(toAmount, slippage, !byAmountIn);

    const amountLimit = adjustForSlippage(
      new BN(toAmount),
      slippage,
      !byAmountIn
    );

    // build swap Payload
    const transactionBlock: TransactionBlock =
      await this.sdk.Swap.createSwapTransactionPayload({
        pool_id: pool.poolAddress,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        a2b: params.a2b,
        by_amount_in: byAmountIn,
        amount: res.amount.toString(),
        amount_limit: amountLimit.toString(),
      });

    return transactionBlock;
  }
}

/**
 * Type representing parameters for the Cetus decentralized exchange.
 */
export type CetusParams = {
  /**
   * A boolean value indicating whether to swap from A to B or from B to A.
   */
  a2b: boolean;
  /**
   * The amount of cryptocurrency to swap.
   */
  amountIn: number;
  /**
   * The amount of cryptocurrency to receive in exchange.
   */
  amountOut: number;
  /**
   * A boolean value indicating whether the amount is specified as input or output.
   */
  byAmountIn: boolean;
  /**
   * The maximum allowable slippage for the swap transaction.
   */
  slippage: number;
};

/**
 * Abstract class representing a pool of liquidity for decentralized exchanges (DEXs) such as Cetus, Suiswap, and Turbos.
 */
export abstract class Pool<
  C extends CetusParams | SuiswapParams | TurbosParams
> extends DataSource {
  /**
   * The coin type A for the pool.
   */
  public coinTypeA: string;
  /**
   * The coin type B for the pool.
   */
  public coinTypeB: string;

  /**
   * Creates an instance of Pool.
   * @param address The address of the pool.
   * @param coinTypeA The coin type A for the pool.
   * @param coinTypeB The coin type B for the pool.
   */
  constructor(address: string, coinTypeA: string, coinTypeB: string) {
    super(address);
    this.coinTypeA = coinTypeA;
    this.coinTypeB = coinTypeB;
  }

  /**
   * Abstract method for creating a swap transaction.
   * @param transactionBlock The transaction block to create the transaction in.
   * @param params The parameters for the swap transaction.
   * @returns A Promise of type TransactionBlock.
   */
  abstract createSwapTransaction(
    transactionBlock: TransactionBlock,
    params: C
  ): Promise<TransactionBlock>;

  /**
   * Abstract method for estimating the price of a cryptocurrency swap and the fee.
   * @returns A Promise of type number representing the estimated price of the swap and the relative fee.
   */
  abstract estimatePriceAndFee(): Promise<{
    price: number;
    fee: number;
  }>;

  /**
   * Method for getting data about the pool.
   * @returns A Promise of type DataPoint representing data about the pool.
   */
  async getData(): Promise<DataPoint> {
    const priceAndFee = await this.estimatePriceAndFee();
    return {
      type: DataType.Price,
      source_uri: this.uri,
      coinTypeFrom: this.coinTypeA,
      coinTypeTo: this.coinTypeB,
      price: priceAndFee.price,
      fee: priceAndFee.fee,
    };
  }
}
