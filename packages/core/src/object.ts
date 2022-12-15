import { SuiMoveObject, Coin as CoinAPI } from '@mysten/sui.js';

const COIN_TYPE = '0x2::coin::Coin';
const COIN_TYPE_ARG_REGEX = /^0x2::coin::Coin<(.+)>$/;
const DEFAULT_GAS_BUDGET_FOR_PAY = 150;

export type CoinObject = {
  objectId: string;
  symbol: string;
  balance: bigint;
  object: SuiMoveObject;
};

export class Coin {
  public static isCoin(obj: SuiMoveObject) {
    return obj.type.startsWith(COIN_TYPE);
  }

  public static isSUI(obj: SuiMoveObject) {
    const arg = Coin.getCoinTypeArg(obj);
    return arg ? Coin.getCoinSymbol(arg) === 'SUI' : false;
  }

  public static getCoinObject(obj: SuiMoveObject): CoinObject {
    const arg = Coin.getCoinTypeArg(obj);
    return {
      objectId: obj.fields.id.id,
      symbol: arg ? Coin.getCoinSymbol(arg) : '',
      balance: BigInt(obj.fields.balance),
      object: obj,
    };
  }

  public static getBalance(obj: SuiMoveObject) {
    return BigInt(obj.fields.balance);
  }

  static getCoinTypeArg(obj: SuiMoveObject) {
    const res = obj.type.match(COIN_TYPE_ARG_REGEX);
    return res ? res[1] : null;
  }

  static getCoinSymbol(coinTypeArg: string) {
    return coinTypeArg.substring(coinTypeArg.lastIndexOf(':') + 1);
  }

  static getCoinTypeFromArg(coinTypeArg: string) {
    return `${COIN_TYPE}<${coinTypeArg}>`;
  }

  static estimatedGasCostForPay(
    numInputCoins: number,
    gasBudgetForPay?: number
  ): number {
    const gasBudgest = gasBudgetForPay ?? DEFAULT_GAS_BUDGET_FOR_PAY;
    return gasBudgest * Math.max(2, Math.min(100, numInputCoins / 2));
  }

  static async assertAndGetSufficientCoins(
    coins: SuiMoveObject[],
    amount: bigint,
    gasBudget?: number
  ) {
    const inputCoins =
      await CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        coins,
        amount + BigInt(gasBudget ?? 0)
      );
    if (inputCoins.length === 0) {
      const totalBalance = CoinAPI.totalBalance(coins);
      const maxTransferAmount = totalBalance - BigInt(gasBudget ?? 0);
      const gasText = gasBudget ? ` plus gas budget ${gasBudget}` : '';
      throw new Error(
        `Coin balance ${totalBalance.toString()} is not sufficient to cover the transfer amount ` +
          `${amount.toString()}${gasText}. ` +
          `Try reducing the transfer amount to ${maxTransferAmount.toString()}.`
      );
    }
    return inputCoins;
  }
}

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
    if (obj.fields.name && obj.fields.url) {
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
      name: obj.fields.name,
      description: obj.fields?.description,
      url: obj.fields.url,
      previousTransaction,
      objectType: obj.type,
      fields: obj.fields,
      hasPublicTransfer: obj.has_public_transfer
        ? obj.has_public_transfer
        : false,
    };
  }
}
