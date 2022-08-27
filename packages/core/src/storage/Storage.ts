import { Account, Wallet, GlobalMeta } from "./types";

export abstract class Storage {
    abstract getWallets(): Promise<Array<Wallet>>;
    abstract getWallet(id: string): Promise<Wallet | null>;

    abstract addWallet(id: string, wallet: Wallet): Promise<void>;
    abstract updateWallet(id: string, wallet: Wallet): Promise<void>;
    abstract deleteWallet(id: string): Promise<void>;

    abstract getAccounts(walletId: string): Promise<Array<Account>>;
    abstract getAccount(walletId: string, accountId: string): Promise<Account | null>;

    abstract addAccount(walletId: string, accountId: string, account: Account): Promise<void>;
    abstract updateAccount(walletId: string, accountId: string, account: Account): Promise<void>;
    abstract deleteAccount(walletId: string, accountId: string): Promise<void>;

    abstract loadMeta(): Promise<GlobalMeta | null>;
    abstract saveMeta(meta: GlobalMeta): Promise<void>;
}
