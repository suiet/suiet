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
};
