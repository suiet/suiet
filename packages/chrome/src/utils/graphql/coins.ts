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
