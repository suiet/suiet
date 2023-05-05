export default function isNftTransferable(params: {
  hasPublicTransfer: boolean;
  kioskObjectId?: string;
}) {
  if (params.hasPublicTransfer) {
    return true;
  }
  if (params.kioskObjectId) {
    return true;
  }
  return false;
}
