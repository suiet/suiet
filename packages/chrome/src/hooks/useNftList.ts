import { gql, useLazyQuery, useQuery } from '@apollo/client';

export const GET_NFT_LIST = gql`
  query GetNftList($address: Address!) {
    nfts(address: $address) {
      name
      description
      url
      thumbnailUrl
      expiresAt
      isTransferable
      attributes {
        key
        value
      }
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
      verification {
        status
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
  verification: {
    status: string;
  };
  attributes:
    | [
        {
          key: string;
          value: string;
        }
      ]
    | undefined;
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

export function useNftListLazyQuery() {
  return useLazyQuery<
    { nfts: NftGqlDto[] },
    {
      address: string;
    }
  >(GET_NFT_LIST);
}
