export interface ExampleNftMetadata {
  name: string;
  desc: string;
  imageUrl: string;
}

export const createMintExampleNftMoveCall = (metadata: ExampleNftMetadata) => ({
  packageObjectId: '0x2',
  module: 'devnet_nft',
  function: 'mint',
  typeArguments: [],
  arguments: [metadata?.name, metadata?.desc, metadata?.imageUrl],
});
