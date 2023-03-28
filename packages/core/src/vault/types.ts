import { Coin } from '@mysten/sui.js';

export type UnsignedTx = {
  data: Uint8Array;
};

export type SignedTx = {
  signature: Buffer;
  pubKey: Buffer;
  data: Uint8Array;
};

export type CoinType = {
  object: Coin;
};
