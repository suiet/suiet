import { SuiAddress, TransactionBlock } from '@mysten/sui.js';

export default function createTransactionNftTxb(params: {
  objectId: string;
  recipient: SuiAddress;
  kiosk?: {
    objectType: string;
    packageId: string;
    senderId: string;
    recipientId?: string;
  };
}) {
  const txb = new TransactionBlock();
  if (params.kiosk && params.kiosk.packageId) {
    const { objectType, packageId, senderId, recipientId } = params.kiosk;
    // kiosk transfer
    if (recipientId) {
      // both sender and recipient are kiosk
      txb.moveCall({
        target: `${packageId}::ob_kiosk::p2p_transfer`,
        typeArguments: [objectType],
        arguments: [
          txb.object(senderId),
          txb.object(recipientId),
          txb.pure(params.objectId),
        ],
      });
      return txb;
    }
    // only sender is kiosk
    txb.moveCall({
      target: `${packageId}::ob_kiosk::p2p_transfer_and_create_target_kiosk`,
      typeArguments: [objectType],
      arguments: [
        txb.object(senderId),
        txb.pure(params.recipient),
        txb.pure(params.objectId),
      ],
    });
    return txb;
  }
  // normal transfer
  txb.transferObjects(
    [txb.object(params.objectId)],
    txb.pure(params.recipient)
  );
  return txb;
}
