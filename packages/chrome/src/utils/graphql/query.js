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
