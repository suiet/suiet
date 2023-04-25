import { gql } from '@apollo/client';

export interface Coin {
  balance: string;
  isVerified: boolean;
  iconURL: string;
  description: string;
  symbol: string;
  type: string;
  metadata: {
    decimals: number;
  };
}

export type CoinsResult = Coin[];

export const GET_COINS = gql`
  query Coins($address: Address!, $coin: [String!]) {
    coins(address: $address, coin: $coin) {
      balance
      isVerified
      iconURL
      description
      symbol
      type
      metadata {
        decimals
      }
    }

    nfts(address: $address) {
      name
      description
      url
      thumbnailUrl
      expiresAt
      collection {
        description
        url
      }
    }
  }
`;

export interface TransactionsFilter {
  inputObjectID: string;
  mutatedObjectID: string;
  fromAddress: string;
  toAddress: string;
  startTime: number;
  endTime: number;
}

export interface Transaction {
  digest: string;
  category: string;
  kind: string;
  status: string;
  gasFee: number;
  epoch: number;
  signature: string;
  timestamp: number;
}

export interface TransactionsResult {
  transactions: Transaction[];
  nextCursor: string;
}

export const GET_TRANSACTIONS = gql`
  query Transactions($filter: TransactionsFilter, $cursor: TransactionDigest, $order: OrderDirection, $limit: Int) {
    transactions(filter: $filter, cursor: $cursor, order: $order, limit: $limit) {
      transactions {
        digest
        category
        status
        gas {
          computationCost
          storageRebate
          storageCost
        }
        gasFee
        epoch
        signature
        timestamp
      }
      nextCursor
    }
  }
`;
