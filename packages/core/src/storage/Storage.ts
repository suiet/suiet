import { Account, Wallet, GlobalMeta } from "./types";

export interface Storage {
    getWallets(): Promise<Array<Wallet>>;
    getWallet(id: string): Promise<Wallet | null>;

    addWallet(id: string, wallet: Wallet): Promise<void>;
    updateWallet(id: string, wallet: Wallet): Promise<void>;
    deleteWallet(id: string): Promise<void>;

    getAccounts(walletId: string): Promise<Array<Account>>;
    getAccount(walletId: string, accountId: string): Promise<Account | null>;

    addAccount(walletId: string, accountId: string, account: Account): Promise<void>;
    updateAccount(walletId: string, accountId: string, account: Account): Promise<void>;
    deleteAccount(walletId: string, accountId: string): Promise<void>;

    loadMeta(): Promise<GlobalMeta | null>;
    saveMeta(meta: GlobalMeta): Promise<void>;
}
