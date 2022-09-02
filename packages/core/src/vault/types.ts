import {
  Base64DataBuffer,
  Coin,
  Provider,
  TxnDataSerializer,
} from '@mysten/sui.js';

export type UnsignedTx = {
  txid: string;
  data: Base64DataBuffer;
};

export type SignedTx = {
  txid: string;
  signature: Buffer;
  pubKey: Buffer;
  data: Base64DataBuffer;
};

export type CoinType = {
  object: Coin;
};
