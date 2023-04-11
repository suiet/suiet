import { SUI_SYSTEM_STATE_OBJECT_ID, TransactionBlock } from '@mysten/sui.js';

export default function createUnstakeTransaction(stakedSuiId: string) {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: '0x3::sui_system::request_withdraw_stake',
    arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), tx.object(stakedSuiId)],
  });
  return tx;
}
