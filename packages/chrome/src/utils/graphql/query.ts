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
  query CoinHistory($address: Address!, $coinTypes: [String!]) {
    coins(address: $address, coinTypes: $coinTypes) {
      type
      symbol
      iconURL
      usdPrice
      pricePercentChange24h
      day: history(interval: "day", length: 60) {
        timestamp
        price
      }
      hour: history(interval: "hour", length: 24) {
        timestamp
        price
      }
      minute: history(interval: "minute", length: 60) {
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
