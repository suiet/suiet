import { gql } from '@apollo/client';

export const GET_VALIDATORS = gql`
  query {
    validators {
      name
      description
      imageURL
      projectURL
      suiAddress
      stakeAmount
      commissionRate
      gasPrice
      epoch
      apy
    }
  }
`;

export const GET_COIN_HISTORY = gql`
  query CoinHistory(
    $address: Address!
    $coinTypes: [String!]
    $interval: String!
    $length: Int
  ) {
    coins(address: $address, coinTypes: $coinTypes) {
      type
      symbol
      iconURL
      usdPrice
      pricePercentChange24h
      history(interval: $interval, length: $length) {
        timestamp
        price
      }
    }
  }
`;

export const GET_DELEGATED_STAKES = gql`
  query DelegatedStake($address: Address!) {
    delegatedStakes(ownerAddress: $address) {
      stakes {
        status
        principal
        stakeActiveEpoch
        stakedSuiID
        earned
        stakeRequestEpoch
      }
      validator {
        suiAddress
        name
        imageURL
        epoch
        description
        apy
      }
    }
  }
`;
