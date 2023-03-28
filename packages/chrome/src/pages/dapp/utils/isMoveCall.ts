export default function isMoveCall(tx: Record<string, any>): boolean {
  return tx?.kind === 'MoveCall';
}
