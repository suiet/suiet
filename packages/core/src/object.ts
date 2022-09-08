import { SuiMoveObject } from '@mysten/sui.js';

const COIN_TYPE = '0x2::coin::Coin';
const COIN_TYPE_ARG_REGEX = /^0x2::coin::Coin<(.+)>$/;

export type CoinObject = {
  objectId: string;
  symbol: string;
  balance: bigint;
};

export class Coin {
  public static isCoin(obj: SuiMoveObject) {
    return obj.type.startsWith(COIN_TYPE);
  }

  public static getCoinTypeArg(obj: SuiMoveObject) {
    const res = obj.type.match(COIN_TYPE_ARG_REGEX);
    return res ? res[1] : null;
  }

  public static isSUI(obj: SuiMoveObject) {
    const arg = Coin.getCoinTypeArg(obj);
    return arg ? Coin.getCoinSymbol(arg) === 'SUI' : false;
  }

  public static getCoinSymbol(coinTypeArg: string) {
    return coinTypeArg.substring(coinTypeArg.lastIndexOf(':') + 1);
  }

  public static getBalance(obj: SuiMoveObject): bigint {
    return BigInt(obj.fields.balance);
  }

  public static getID(obj: SuiMoveObject): string {
    return obj.fields.id;
  }

  public static getCoinTypeFromArg(coinTypeArg: string) {
    return `${COIN_TYPE}<${coinTypeArg}>`;
  }
}

export type NftObject = {
  objectId: string;
  name: string;
  description: string;
  url: string;
};

export class Nft {
  public static isNft(obj: SuiMoveObject) {
    if (obj.fields.name && obj.fields.description && obj.fields.url) {
      return true;
    }
    return false;
  }

  public static getObject(obj: SuiMoveObject): NftObject {
    return {
      objectId: obj.fields.id.id,
      name: obj.fields.name,
      description: obj.fields.description,
      url: obj.fields.url,
    };
  }
}
