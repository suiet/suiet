import {
  BalanceChange,
  SuiObjectData,
  SuiObjectChangePublished,
  SuiObjectChangeTransferred,
  SuiObjectChangeMutated,
  SuiObjectChangeDeleted,
  SuiObjectChangeWrapped,
  SuiObjectChangeCreated,
  Coin,
} from '@mysten/sui.js';
import { Infer } from 'superstruct';
import { has } from '../index';

export type TokenBalanceChange = Infer<typeof BalanceChange>;
export type ObjectChange =
  | SuiObjectChangeCreated
  | SuiObjectChangeMutated
  | SuiObjectChangeDeleted
  | SuiObjectChangeWrapped
  | SuiObjectChangeTransferred
  | SuiObjectChangePublished;

export type ObjectChangeType =
  | 'send'
  | 'receive'
  | 'update'
  | 'delete'
  | 'publish'
  | 'wrap'
  | 'unknown';

export interface IAssetChangeInput {
  accountAddress: string;
  objectChanges: ObjectChange[];
  balanceChanges: TokenBalanceChange[];
  objectDataMap: Record<string, any>;
}

export interface IAssetChangeOutput {
  getCoinChangeList(): ICoinChangeObject[];
  getNftChangeList(): INftChangeObject[];
  getObjectChangeList(): IObjectChangeObject[];
}

export type IObjectChangeObject = {
  category: string;
  changeType: ObjectChangeType;
  objectType: string;
  objectId: string;
  digest: string;
  version: string;
};

export type ICoinChangeObject = IObjectChangeObject & {
  amount: string;
  coinType: string;
  decimals: number;
};

export type INftChangeObject = IObjectChangeObject & {
  display: Record<string, any>;
};

export default class AssetChangeAnalyzer {
  private accountAddress: string;
  private objectChanges: ObjectChange[];
  private balanceChanges: TokenBalanceChange[];
  private objectDataMap: Record<string, SuiObjectData>;

  constructor(accountAddress: string) {
    this.accountAddress = accountAddress;
    this.objectChanges = [];
    this.balanceChanges = [];
    this.objectDataMap = {};
  }

  setBalanceChanges(balanceChanges: TokenBalanceChange[]) {
    this.balanceChanges = balanceChanges;
  }

  setObjectChanges(objectChanges: ObjectChange[]) {
    this.objectChanges = objectChanges;
  }

  setObjectDataMap(objectDataMap: Record<string, SuiObjectData>) {
    this.objectDataMap = objectDataMap;
  }

  updateObjectDataMap(key: string, value: SuiObjectData) {
    this.objectDataMap[key] = value;
  }

  getAnalyzedResult(): IAssetChangeOutput {
    return AssetChangeAnalyzer.analyze({
      accountAddress: this.accountAddress,
      objectChanges: this.objectChanges,
      balanceChanges: this.balanceChanges,
      objectDataMap: this.objectDataMap,
    });
  }

  static filterOwnedObjectChanges(
    accountAddress: string,
    objectChanges: ObjectChange[],
    options?: {
      excludeCoin?: boolean;
    }
  ) {
    const { excludeCoin = false } = options ?? {};

    return objectChanges.filter((o) => {
      // TODO: now we ignore object changes of published
      if (!has(o, 'objectType')) return false;
      // TODO: we ignore object changes of transferred, destroyed, wrapped
      if (!has(o, 'owner')) return false;

      const objectChange = o as SuiObjectChangeCreated | SuiObjectChangeMutated;
      // filter out object changes that are not related to the account
      if (!has(objectChange.owner, 'AddressOwner')) return false;

      if (excludeCoin) {
        if (objectChange.objectType?.startsWith('0x2::coin::Coin<'))
          return false;
      }

      return true;
    }) as (SuiObjectChangeCreated | SuiObjectChangeMutated)[];
  }

  static analyze(input: IAssetChangeInput): IAssetChangeOutput {
    const {
      accountAddress,
      objectChanges = [],
      balanceChanges = [],
      objectDataMap = {},
    } = input;

    const objectTypeMap = AssetChangeAnalyzer.buildObjectTypeMap({
      balanceChanges,
      objectDataMap,
    });

    const ownedObjectChanges = AssetChangeAnalyzer.filterOwnedObjectChanges(
      accountAddress,
      objectChanges
    );

    const coinChangeMap: Map<string, ICoinChangeObject> = new Map();
    const resultNftChanges: INftChangeObject[] = [];
    const resultObjectChanges: IObjectChangeObject[] = [];

    for (const objChange of ownedObjectChanges) {
      // filter out object changes that are not related to the account
      if (!has(objChange.owner, 'AddressOwner')) continue;

      if (AssetChangeAnalyzer.isCoin(objectTypeMap, objChange.objectType)) {
        if (coinChangeMap.has(objChange.objectType)) continue;

        const objectDesc = objectTypeMap.get(objChange.objectType);
        coinChangeMap.set(objChange.objectType, {
          category: 'coin',
          changeType: AssetChangeAnalyzer.coinChangeType(objectDesc.amount),
          objectType: objChange.objectType,
          objectId: '',
          digest: '',
          version: '',
          amount: objectDesc.amount,
          coinType: objectDesc.coinType,
          decimals: objectDesc.decimals ?? 9,
        });
        continue;
      }
      if (AssetChangeAnalyzer.isNft(objectTypeMap, objChange.objectId)) {
        const objectDesc = objectTypeMap.get(objChange.objectId);
        resultNftChanges.push({
          category: 'nft',
          changeType: AssetChangeAnalyzer.objectChangeType(
            accountAddress,
            objChange
          ),
          objectType: objChange.objectType,
          objectId: objChange.objectId,
          digest: objChange.digest,
          version: objChange.version,
          display: objectDesc.display,
        });
        continue;
      }
      // fallback to object changes
      resultObjectChanges.push({
        category: 'object',
        changeType: AssetChangeAnalyzer.objectChangeType(
          accountAddress,
          objChange
        ),
        objectType: objChange.objectType,
        objectId: objChange.objectId,
        digest: objChange.digest,
        version: objChange.version,
      });
    }

    return {
      getCoinChangeList(): ICoinChangeObject[] {
        return Array.from(coinChangeMap.values());
      },
      getNftChangeList(): INftChangeObject[] {
        return resultNftChanges as any;
      },
      getObjectChangeList(): IObjectChangeObject[] {
        return resultObjectChanges as any;
      },
    };
  }

  /**
   * Only support object and nft
   * @param accountAddress
   * @param objectChange
   */
  static objectChangeType(
    accountAddress: string,
    objectChange: ObjectChange
  ): ObjectChangeType {
    if (objectChange.type === 'published') return 'publish';
    if (objectChange.type === 'deleted') return 'delete';
    if (objectChange.type === 'wrapped') return 'wrap';
    if (objectChange.type === 'transferred') return 'send';
    if (!has(objectChange.owner, 'AddressOwner')) return 'unknown';

    const sender = objectChange.sender;
    const addressOwner = (objectChange.owner as any).AddressOwner;
    const type = objectChange.type;
    if (type === 'created') {
      if (sender === accountAddress && addressOwner === accountAddress) {
        return 'receive';
      }
    }
    if (type === 'mutated') {
      if (sender === accountAddress && addressOwner !== accountAddress) {
        return 'send';
      }
      if (sender === accountAddress && addressOwner === accountAddress) {
        return 'update';
      }
    }

    return 'unknown';
  }

  static coinChangeType(amount: string): ObjectChangeType {
    return BigInt(amount) < 0 ? 'send' : 'receive';
  }

  static buildObjectTypeMap(input: {
    balanceChanges: TokenBalanceChange[];
    objectDataMap: Record<string, SuiObjectData>;
  }) {
    const { balanceChanges = [], objectDataMap = {} } = input;

    const objectTypeMap = new Map<string, any>();
    for (const item of balanceChanges) {
      // for coins, we use the coin type as the key
      objectTypeMap.set(`0x2::coin::Coin<${item.coinType}>`, item);
    }

    for (const [objIdOrType, objData] of Object.entries(objectDataMap)) {
      if (objIdOrType.startsWith('0x2::coin::Coin<')) {
        // for coins, we use the coin type as the key
        const objType = objIdOrType;
        const objDesc = objectTypeMap.get(objType) || {};
        // update metadata, such as decimal
        objectTypeMap.set(objType, Object.assign(objDesc, objData));
      } else {
        // for nfts and objects, we use the object id as the key
        const objId = objIdOrType;
        objectTypeMap.set(objId, objData);
      }
    }
    return objectTypeMap;
  }

  static isCoin(objectTypeMap: Record<string, any>, objectType: string) {
    const objectDesc = objectTypeMap.get(objectType);
    return has(objectDesc, 'amount');
  }

  static isNft(objectTypeMap: Record<string, any>, objectId: string) {
    const objectDesc = objectTypeMap.get(objectId);
    return has(objectDesc, 'display');
  }

  static isObject(objectTypeMap: Record<string, any>, objectType: string) {
    return (
      !AssetChangeAnalyzer.isCoin(objectTypeMap, objectType) &&
      !AssetChangeAnalyzer.isNft(objectTypeMap, objectType)
    );
  }
}
