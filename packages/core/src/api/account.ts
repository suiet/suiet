export interface Account {
  address: string;
}

export interface IAccountApi {
  createAccount: (walletId: string, networkId?: string,) => Promise<Account>;
  getAccounts: (walletId: string, networkId?: string) => Promise<Array<Account>>;
  getAccount: (accountId: string, networkId?: string) => Promise<Account>;
  updateAccount: (accountId: string, params: { address?: string; }) => Promise<Account>;
  removeAccount: (accountId: string, password: string) => Promise<void>;
}