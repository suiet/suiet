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
      apy
    }
  }
`;
