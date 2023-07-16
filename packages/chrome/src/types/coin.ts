export type CoinType = {
  type: string;
  symbol: string;
  balance: string;
  iconURL: string | null;
  metadata: {
    decimals: number;
    wrappedChain: string | null;
    bridge: string | null;
  };
  isVerified: boolean;
  usd: string | null;
  pricePercentChange24h: string | null;
  // swapPool {
  //   cetus {
  //     poolAddress
  //     coinTypeA
  //     coinA {
  //       symbol
  //       type
  //     }
  //     coinTypeB
  //     coinB {
  //       type
  //       symbol
  //     }
  //   }
  // }
  swapPool?: {
    cetus?: Array<{
      poolAddress: string;
      coinTypeA: string;
      coinA: {
        symbol: string;
        type: string;
      };
      coinTypeB: string;
      coinB: {
        type: string;
        symbol: string;
      };
    }>;
  };
};
