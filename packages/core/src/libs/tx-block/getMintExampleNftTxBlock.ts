import { TransactionBlock } from '@mysten/sui.js';

export default function getMintExampleNftTxBlock(
  objectPackageId: string
): TransactionBlock {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${objectPackageId}::nft::mint`,
    arguments: [
      tx.pure('Suiet NFT'),
      tx.pure('Suiet Sample NFT'),
      tx.pure(
        'https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4'
      ),
    ],
  });
  return tx;
}
