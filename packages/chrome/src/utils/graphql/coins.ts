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
      usd
      usdPrice
      pricePercentChange24h
      metadata {
        decimals
        wrappedChain
        bridge
      }
    }
  }
`;
