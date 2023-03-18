import { ApprovalType } from './bg-api/dapp';

export interface DappSourceContext {
  name: string;
  origin: string;
  favicon: string;
}
export interface DappTargetContext {
  address: string;
  walletId: string;
  accountId: string;
}

export type DappConnectionContext = {
  // from whom
  source: DappSourceContext;
  // to what
  target: DappTargetContext;
  // at where
  networkId: string;
};

export type DappBaseRequest = DappConnectionContext & {
  id: string;
  approved: boolean | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export interface Approval {
  id: string;
  type: ApprovalType;
  approved: boolean;
  reason: string;
  updatedAt: string;
}
export interface AccountInfo {
  address: string;
  publicKey: string;
}

export interface DappMessageContext {
  origin: string;
  name: string;
  favicon: string;
}
export interface DappMessage<T> {
  params: T;
  context: DappMessageContext;
}
