import { gql, useQuery } from '@apollo/client';

export const GET_NFT_LIST = gql`
  query GetNftList($address: Address!) {
    nfts(address: $address) {
      object {
        objectID
        type
        previousTransaction
        hasPublicTransfer
      }
      name
      description
      thumbnailUrl
      url
      expiresAt
    }
  }
`;

export type NftGqlDto = {
  object: {
    objectID: string;
    type: string;
    previousTransaction: string;
    hasPublicTransfer: boolean;
  };
  name: string;
  url: string;
  thumbnailUrl: string | null;
  expiresAt: number | null;
  description: string;
};

export function useNftList(
  address: string,
  options?: {
    pollInterval?: number;
  }
) {
  const { pollInterval } = options ?? {};
  const { data, error, loading, ...rest } = useQuery<
    { nfts: NftGqlDto[] },
    {
      address: string;
    }
  >(GET_NFT_LIST, {
    variables: {
      address,
    },
    pollInterval,
    skip: !address,
  });

  return {
    data: data?.nfts,
    error,
    loading,
    ...rest,
  };
}
