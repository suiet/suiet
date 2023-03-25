import { gql } from '@apollo/client';

export const coinsGql = gql`
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
  }
`;

export const transactionsGql = gql`
  query Transactions(
    $filter: TransactionsFilter
    $cursor: TransactionDigest
    $order: OrderDirection
    $limit: Int
  ) {
    transactions(
      filter: $filter
      cursor: $cursor
      order: $order
      limit: $limit
    ) {
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
