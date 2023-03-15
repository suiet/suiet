import { gql } from '@apollo/client';

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
      collection {
        description
        url
      }
    }
  }
`;
