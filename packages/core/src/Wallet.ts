import { encryptMnemonic, generateMnemonic } from './mnemoinc';
import { Storage } from './storage/Storage';
import { toWalletIdString, toWalletNameString, Wallet as StorageWallet, Account as StorageAccount, toAccountIdString, toAccountNameString } from './storage/types';


export class Wallet {
    storage: Storage;
    wallet: StorageWallet

    constructor(storage: Storage, wallet: StorageWallet) {
        this.storage = storage
        this.wallet = wallet
    }

    public static async createAndSave(password: string, storage: Storage): Promise<Wallet> {
        const mnemonic = generateMnemonic();
        const encryptedMnemonic = encryptMnemonic(password, mnemonic);
        let meta = await storage.loadMeta();
        const walletId = meta.nextWalletId;
        meta.nextWalletId += 1;
        await storage.saveMeta(meta);
        let wallet: StorageWallet = {
            id: toWalletIdString(walletId),
            name: toWalletNameString(walletId),
            nextAccountId: 0,
            encryptedMnemonic: encryptedMnemonic,
            accounts: []
        }
        const account = createAccountFotWallet(wallet)
        await storage.addAccount(wallet.id, account.id, account)
        await storage.addWallet(wallet.id, wallet)

        return new Wallet(storage, wallet)
    }
}

function createAccountFotWallet(wallet: StorageWallet): StorageAccount {
    const accountId = wallet.nextAccountId;
    const accountIdStr = toAccountIdString(wallet.id, accountId);
    wallet.nextAccountId += 1;
    wallet.accounts.push(accountIdStr);
    return {
        id: accountIdStr,
        name: toAccountNameString(wallet.name, accountId),
        // TODO: generate HD key
        pubkey: '',
        hdPath: ''
    };
}
