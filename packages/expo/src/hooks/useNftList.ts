import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

export const GET_NFT_LIST = gql`
  query GetNftList($address: Address!) {
    nfts(address: $address) {
      object {
        objectID
        type
        previousTransaction
        hasPublicTransfer
      }
      attributes {
        key
        value
      }
      name
      thumbnailUrl
      expiresAt
      description
      url
      verification {
        status
      }
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
  attributes?: {
    key: string;
    value: string;
  };
  name: string;
  url: string;
  description: string;
};

export function useNftList(address: string, options?: QueryHookOptions) {
  const { pollInterval = 5 * 1000, ...restOptions } = options || {};
  const { data, ...rest } = useQuery<{ nfts: NftGqlDto[] }>(GET_NFT_LIST, {
    variables: {
      address,
    },
    pollInterval,
    skip: !address,
    ...restOptions,
  });

  return {
    data: data?.nfts,
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
