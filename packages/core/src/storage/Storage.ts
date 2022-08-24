import { Account, Wallet, GlobalMeta } from "./types";

export abstract class Storage {
    abstract getWallets(): Promise<Array<Wallet>>;
    abstract getWallet(id: string): Promise<Wallet>;
    abstract addWallet(id: string, wallet: Wallet): Promise<void>;

    abstract addAccount(walletId: string, accountId: string, account: Account): Promise<void>;
    abstract deleteAccount(walletId: string, accountId: string): Promise<void>;
    abstract loadMeta(): Promise<GlobalMeta>;
    abstract saveMeta(meta: GlobalMeta): Promise<void>;
}
