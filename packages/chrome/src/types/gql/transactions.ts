export interface TransactionsFilter {
  inputObjectID: string;
  mutatedObjectID: string;
  fromAddress: string;
  toAddress: string;
  startTime: number;
  endTime: number;
}

export interface GetTransactionsParams {
  filter?: Partial<TransactionsFilter>;
  cursor?: string;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

export interface TransactionsData<T> {
  transactions: TransactionsResult<T>;
}

export interface TransactionsResult<T> {
  transactions: T[];
  nextCursor: string | null;
}

export interface CoinBalanceChangeItem {
  type: string;
  symbol: string;
  description: string;
  iconURL: string;
  balance: string;
  metadata: {
    objectID: string;
    decimals: number;
  };
  isVerified: boolean;
}

export interface GasResult {
  computationCost: number;
  storageCost: number;
  storageRebate: number;
}
