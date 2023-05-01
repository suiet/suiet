import {
  SuiMoveObject,
  Coin as CoinAPI,
  SuiAddress,
  CoinStruct,
} from '@mysten/sui.js';

const DEFAULT_GAS_BUDGET_FOR_PAY = 150;

export type CoinObject = {
  objectId: string;
  type: string;
  symbol: string;
  balance: bigint;
  lockedUntilEpoch: number | null | undefined;
  previousTransaction: string;
  object: CoinStruct; // raw data
};

export type NftObject = {
  objectId: string;
  name: string;
  description: string;
  url: string;
  previousTransaction?: string;
  objectType: string;
  fields: Record<string, any>;
  hasPublicTransfer: boolean;
};

export class Nft {
  public static isNft(obj: SuiMoveObject) {
    if (obj.fields.url) {
      return true;
    } else if (obj.fields.metadata) {
      return true;
    }
    return false;
  }

  public static getNftObject(
    obj: SuiMoveObject,
    previousTransaction?: string
  ): NftObject {
    return {
      objectId: obj.fields.id.id,
      name: obj.fields?.name ?? 'No Title',
      description: obj.fields?.description ?? 'No Description',
      url: obj.fields.url,
      previousTransaction,
      objectType: obj.type,
      fields: obj.fields,
      hasPublicTransfer: obj.hasPublicTransfer ? obj.hasPublicTransfer : false,
    };
  }
}
