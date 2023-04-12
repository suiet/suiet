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
      url
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

export function ipfsToHttp(s: string) {
  return s.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
}

export function nftImgUrl(uri: string) {
  if (String(uri).startsWith('ipfs')) return ipfsToHttp(uri);
  return uri;
}
