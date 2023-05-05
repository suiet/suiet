import { gql, useQuery } from '@apollo/client';

export const GET_NFT_LIST = gql`
  query GetNftList($address: Address!) {
    nfts(address: $address) {
      name
      description
      url
      thumbnailUrl
      expiresAt
      isTransferable
      kiosk {
        objectID
        originBytePackageID
      }
      object {
        objectID
        type
        previousTransaction
        hasPublicTransfer
      }
    }
  }
`;

export type NftGqlDto = {
  name: string;
  url: string;
  thumbnailUrl: string | null;
  expiresAt: number | null;
  description: string;
  isTransferable: boolean;
  object: {
    objectID: string;
    type: string;
    previousTransaction: string;
    hasPublicTransfer: boolean;
  };
  kiosk: {
    objectID: string;
    originBytePackageID: string;
  } | null;
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
