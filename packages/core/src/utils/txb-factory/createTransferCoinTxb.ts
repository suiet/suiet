import { CoinObject } from '../../object';
import { SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js';

function createTransferSuiCoinTxb(amount: bigint, recipient: string) {
  const txb = new TransactionBlock();
  // split the coin to be sent from the gas coins
  const coin = txb.splitCoins(txb.gas, [txb.pure(amount)]);
  txb.transferObjects([coin], txb.pure(recipient));
  return txb;
}

function createTransferCustomCoinTxb(
  coins: CoinObject[],
  coinType: string,
  amount: bigint,
  recipient: string
) {
  const txb = new TransactionBlock();
  // split the primary coin and merge the rest
  const [primaryCoin, ...mergeCoins] = coins.filter(
    (coin) => coin.type === coinType
  );
  // TODO: pass the object instead of the id
  const primaryCoinInput = txb.object(primaryCoin.objectId);
  if (mergeCoins.length) {
    // TODO: This could just merge a subset of coins that meet the balance requirements instead of all of them.
    txb.mergeCoins(
      primaryCoinInput,
      mergeCoins.map((coin) => txb.object(coin.objectId))
    );
  }
  // TODO: pass gas coin object instead of pure amount, which can avoid unnecessary network calls
  const coin = txb.splitCoins(primaryCoinInput, [txb.pure(amount)]);
  txb.transferObjects([coin], txb.pure(recipient));
  return txb;
}

/**
 * Create a transaction block for transferring a type of coin.
 * @param ownedCoins coins owned by the sender.
 * @param coinType The type of coin to transfer.
 * @param amount The amount of coins to transfer.
 * @param recipient The recipient of the coins.
 */
export default function createTransferCoinTxb(
  ownedCoins: CoinObject[],
  coinType: string, // such as 0x2::sui::SUI
  amount: bigint,
  recipient: string
) {
  if (coinType === SUI_TYPE_ARG) {
    return createTransferSuiCoinTxb(amount, recipient);
  } else {
    return createTransferCustomCoinTxb(ownedCoins, coinType, amount, recipient);
  }
}
