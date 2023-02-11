import {
  SuiMoveObject,
  Coin as CoinAPI,
  SuiAddress,
  UnserializedSignableTransaction,
  SUI_TYPE_ARG,
} from '@mysten/sui.js';

const COIN_TYPE = '0x2::coin::Coin';
export const COIN_TYPE_ARG_REGEX = /^0x2::coin::Coin<(.+)>$/;
const DEFAULT_GAS_BUDGET_FOR_PAY = 150;

export type CoinObject = {
  type: string;
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
      type: arg ? Coin.getCoinTypeFromArg(arg) : '',
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

  public static computeGasBudgetForPay(
    coins: SuiMoveObject[],
    amountToSend: bigint
  ): number {
    // TODO: improve the gas budget estimation
    const numInputCoins =
      CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        coins,
        amountToSend
      ).length;
    return (
      DEFAULT_GAS_BUDGET_FOR_PAY * Math.max(2, Math.min(100, numInputCoins / 2))
    );
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

  /**
   * Create a new transaction for sending coins ready to be signed and executed.
   * @param allCoins All the coins that are owned by the sender. Can be only the relevant type of coins for the transfer, Sui for gas and the coins with the same type as the type to send.
   * @param coinTypeArg The coin type argument (Coin<T> the T) of the coin to send
   * @param amountToSend Total amount to send to recipient
   * @param recipient Recipient's address
   * @param gasBudget Gas budget for the tx
   * @throws in case of insufficient funds
   */
  static async newPayTransaction(
    allCoins: SuiMoveObject[],
    coinTypeArg: string,
    amountToSend: bigint,
    recipient: SuiAddress,
    gasBudget: number
  ): Promise<UnserializedSignableTransaction> {
    const isSuiTransfer = coinTypeArg === SUI_TYPE_ARG;
    const coinsOfTransferType = allCoins.filter(
      (aCoin) => Coin.getCoinTypeArg(aCoin) === coinTypeArg
    );
    const coinsOfGas = isSuiTransfer
      ? coinsOfTransferType
      : allCoins.filter((aCoin) => Coin.isSUI(aCoin));
    const gasCoin = CoinAPI.selectCoinWithBalanceGreaterThanOrEqual(
      coinsOfGas,
      BigInt(gasBudget)
    );
    if (!gasCoin) {
      // TODO: denomination for gasBudget?
      throw new Error(
        `Unable to find a coin to cover the gas budget ${gasBudget}`
      );
    }
    const totalAmountIncludingGas =
      amountToSend +
      BigInt(
        isSuiTransfer
          ? // subtract from the total the balance of the gasCoin as it's going be the first element of the inputCoins
            BigInt(gasBudget) - BigInt(CoinAPI.getBalance(gasCoin) ?? 0)
          : 0
      );
    const inputCoinObjs =
      totalAmountIncludingGas > 0
        ? CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
            coinsOfTransferType,
            totalAmountIncludingGas,
            isSuiTransfer ? [CoinAPI.getID(gasCoin)] : []
          )
        : [];
    if (totalAmountIncludingGas > 0 && !inputCoinObjs.length) {
      const totalBalanceOfTransferType =
        CoinAPI.totalBalance(coinsOfTransferType);
      const suggestedAmountToSend =
        totalBalanceOfTransferType - BigInt(isSuiTransfer ? gasBudget : 0);
      // TODO: denomination for values?
      throw new Error(
        `Coin balance ${totalBalanceOfTransferType} is not sufficient to cover the transfer amount ` +
          `${amountToSend}. Try reducing the transfer amount to ${suggestedAmountToSend}.`
      );
    }
    if (isSuiTransfer) {
      inputCoinObjs.unshift(gasCoin);
    }
    return {
      kind: isSuiTransfer ? 'paySui' : 'pay',
      data: {
        inputCoins: inputCoinObjs.map(CoinAPI.getID),
        recipients: [recipient],
        // TODO: change this to string to avoid losing precision
        amounts: [Number(amountToSend)],
        gasBudget: Number(gasBudget),
      },
    };
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
      hasPublicTransfer: obj.has_public_transfer
        ? obj.has_public_transfer
        : false,
    };
  }
}
