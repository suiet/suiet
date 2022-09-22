import { Base64DataBuffer, Coin } from '@mysten/sui.js';

export type UnsignedTx = {
  data: Base64DataBuffer;
};

export type SignedTx = {
  signature: Buffer;
  pubKey: Buffer;
  data: Base64DataBuffer;
};

export type SignedMessage = {
  signature: Buffer;
  pubKey: Buffer;
};

export type CoinType = {
  object: Coin;
};
