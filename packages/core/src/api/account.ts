export interface Account {
  id: string;
  name: string;
  address: string;
  pubkey: string;
  hdPath: string;
}

export interface IAccountApi {
  createAccount: (walletId: string, token: string) => Promise<Account>;
  updateAccount: (walletId: string, accountId: string, meta: { name?: string; }, token: string) => Promise<void>;
  getAccounts: (walletId: string) => Promise<Array<Account>>;
  getAccount: (walletId: string, accountId: string) => Promise<Account | null>;
  removeAccount: (walletId: string, accountId: string, token: string) => Promise<void>;
}

export function toAccountIdString(walletId: string, id: number): string {
  return `${walletId}--${id}`
}

export function toAccountNameString(walletName: string, id: number): string {
  return `${walletName} Account #${id}`
}