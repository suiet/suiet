import { gql, useQuery } from '@apollo/client';
import { DisplayItemDto } from '../../types';

const GET_TXN_DETAIL_GQL = gql`
  query getTxnDetail($digest: TransactionDigest!, $ownerAddress: String!) {
    transaction(digest: $digest, ownerAddress: $ownerAddress) {
      digest
      timestamp
      gasFee
      display {
        detail {
          title
          description
          icon
          assetChanges {
            title
            description {
              text
              type
              icon
              color
            }
            icon
            url
            assetChange {
              text
              type
              icon
              color
            }
            assetChangeDescription {
              text
              type
              icon
              color
            }
            subAssetChanges {
              icon
              text {
                text
                type
                icon
                color
              }
              assetChange {
                text
                type
                icon
                color
              }
            }
          }
          metadata {
            icon
            key
            value {
              text
              type
              icon
              color
            }
          }
        }
      }
    }
  }
`;

export type TxnDetailMetadataDto = {
  icon: string;
  key: string;
  value: DisplayItemDto;
};

export type TxnDetailSubAssetChangesDto = {
  icon: string;
  text: DisplayItemDto;
  assetChange: DisplayItemDto;
};

export type TxnDetailAssetChangeDto = {
  title: string;
  description: DisplayItemDto;
  icon: string;
  url: string;
  assetChange: DisplayItemDto;
  assetChangeDescription: DisplayItemDto | null;
  subAssetChanges: TxnDetailSubAssetChangesDto | null;
};

export type TxnDetailDisplayDto = {
  title: string;
  description: string;
  icon: string;
  assetChanges: TxnDetailAssetChangeDto[];
  metadata: TxnDetailMetadataDto[];
};

export type TxnDetailDto = {
  digest: string;
  timestamp: number;
  gasFee: string;
  display: {
    detail: TxnDetailDisplayDto;
  };
};

export interface TxnDetailQueryOption {
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
}

export default function useTxnDetail(
  digest: string | undefined,
  ownerAddress: string | undefined,
  opts?: TxnDetailQueryOption
) {
  const { data, ...rest } = useQuery(GET_TXN_DETAIL_GQL, {
    variables: {
      digest,
      ownerAddress,
    },
    skip: !digest || !ownerAddress,
    ...opts,
  });
  return {
    data: data?.transaction as TxnDetailDto | undefined,
    ...rest,
  };
}
