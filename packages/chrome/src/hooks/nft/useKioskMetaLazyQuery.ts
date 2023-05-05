import { gql, useLazyQuery } from '@apollo/client';

export const GET_KIOSK_ID = gql`
  query GetKioskId($ownerAddress: Address!) {
    kiosk(ownerAddress: $ownerAddress) {
      objectID
    }
  }
`;

export type KioskGqlDto = {
  kiosk: {
    objectID: string;
  };
};

export type KioskGqlVars = {
  ownerAddress: string;
};

export default function useKioskMetaLazyQuery() {
  return useLazyQuery<KioskGqlDto, KioskGqlVars>(GET_KIOSK_ID);
}
