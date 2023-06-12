import {
  BalanceChange,
  Coin,
  SuiObjectChangeCreated,
  SuiObjectChangeDeleted,
  SuiObjectChangeMutated,
  SuiObjectChangePublished,
  SuiObjectChangeTransferred,
  SuiObjectChangeWrapped,
  SuiObjectData,
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

export type OriginalObjectChangeType =
  | 'created'
  | 'mutated'
  | 'deleted'
  | 'wrapped'
  | 'transferred'
  | 'published';

export type ObjectChangeType =
  | 'increase'
  | 'decrease'
  | 'modify'
  | 'publish'
  | 'unknown';

export interface IAssetChangeInput {
  accountAddress: string;
  objectChanges: ObjectChange[];
  balanceChanges: TokenBalanceChange[];
  objectDataMap: Record<string, any>;
}

export interface IAssetChangeOutput {
  getCoinChangeList: () => ICoinChangeObject[];
  getNftChangeList: () => INftChangeObject[];
  getObjectChangeList: () => IObjectChangeObject[];
}

export type ObjectOwnership = 'owned' | 'shared' | 'dynamicField' | 'unknown';

export type IObjectChangeObject = {
  category: string;
  type: OriginalObjectChangeType;
  changeType: ObjectChangeType;
  objectType: string;
  objectId: string;
  digest: string;
  version: string;
  ownership: ObjectOwnership;
};

export type ICoinChangeObject = IObjectChangeObject & {
  amount: string;
  coinType: string;
  symbol: string;
  decimals: number;
};

export type INftChangeObject = IObjectChangeObject & {
  display: Record<string, any>;
};

export default class AssetChangeAnalyzer {
  private readonly accountAddress: string;
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
    }) as Array<SuiObjectChangeCreated | SuiObjectChangeMutated>;
  }

  /**
   * Filter out dynamic field object changes
   * @param objectChanges
   */
  static filterDynamicFieldObjectChanges(objectChanges: ObjectChange[]) {
    return objectChanges.filter((o) => {
      if (
        'objectType' in o &&
        (o as any).objectType?.startsWith('0x2::dynamic_field::Field')
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Categorize object changes into coin, nft, and object changes
   * @param input
   */
  static analyze(input: IAssetChangeInput): IAssetChangeOutput {
    const {
      accountAddress,
      objectChanges = [],
      balanceChanges = [],
      objectDataMap = {},
    } = input;

    const objectTypeMap = AssetChangeAnalyzer.buildObjectTypeMap({
      accountAddress,
      balanceChanges,
      objectDataMap,
    });

    const filteredObjChanges =
      AssetChangeAnalyzer.filterDynamicFieldObjectChanges(objectChanges);

    const resultCoinChangeMap: Map<string, ICoinChangeObject> = new Map();
    let resultNftChanges: INftChangeObject[] = [];
    let resultObjectChanges: IObjectChangeObject[] = [];

    for (const objChange of filteredObjChanges) {
      if (objChange.type !== 'published') {
        if (AssetChangeAnalyzer.isCoin(objectTypeMap, objChange.objectType)) {
          // ignore duplicated coin changes for one coin type
          if (resultCoinChangeMap.has(objChange.objectType)) continue;

          const objectDesc = objectTypeMap.get(objChange.objectType);
          resultCoinChangeMap.set(
            objChange.objectType,
            AssetChangeAnalyzer.coinChangeObject(
              accountAddress,
              objChange,
              objectDesc
            )
          );
          continue;
        }

        if (AssetChangeAnalyzer.isNft(objectTypeMap, objChange.objectId)) {
          const objectDesc = objectTypeMap.get(objChange.objectId);
          resultNftChanges.push(
            AssetChangeAnalyzer.nftChangeObject(
              accountAddress,
              objChange,
              objectDesc
            )
          );
          continue;
        }
      }

      // fallback to object changes
      resultObjectChanges.push(
        AssetChangeAnalyzer.objectChangeObject(accountAddress, objChange)
      );
    }

    let resultCoinChanges: ICoinChangeObject[] = Array.from(
      resultCoinChangeMap.values()
    );

    resultCoinChanges = AssetChangeAnalyzer.orderObjectChangeList(
      resultCoinChanges
    ) as ICoinChangeObject[];
    resultNftChanges = AssetChangeAnalyzer.orderObjectChangeList(
      resultNftChanges
    ) as INftChangeObject[];
    resultObjectChanges =
      AssetChangeAnalyzer.orderObjectChangeList(resultObjectChanges);

    return {
      getCoinChangeList(): ICoinChangeObject[] {
        return resultCoinChanges;
      },
      getNftChangeList(): INftChangeObject[] {
        return resultNftChanges;
      },
      getObjectChangeList(): IObjectChangeObject[] {
        return resultObjectChanges;
      },
    };
  }

  static objectChangeObject(
    accountAddress: string,
    objChange:
      | SuiObjectChangeCreated
      | SuiObjectChangeMutated
      | SuiObjectChangeDeleted
      | SuiObjectChangeWrapped
      | SuiObjectChangeTransferred
      | SuiObjectChangePublished
  ) {
    let objectType = '';
    let objectId = '';
    let digest = '';
    if (objChange.type === 'published') {
      objectType = '';
      objectId = objChange.packageId;
      digest = objChange.digest;
    } else {
      objectType = objChange.objectType;
      objectId = objChange.objectId;
      if ('digest' in objChange) {
        digest = objChange.digest;
      }
    }
    return {
      category: 'object',
      ownership: AssetChangeAnalyzer.objectOwnership(objChange, accountAddress),
      type: objChange.type,
      changeType: AssetChangeAnalyzer.objectChangeType(
        accountAddress,
        objChange
      ),
      objectType,
      objectId,
      digest,
      version: objChange.version,
    };
  }

  static nftChangeObject(
    accountAddress: string,
    objChange:
      | SuiObjectChangeCreated
      | SuiObjectChangeMutated
      | SuiObjectChangeDeleted
      | SuiObjectChangeWrapped
      | SuiObjectChangeTransferred,
    objectDesc: Record<string, any>
  ): INftChangeObject {
    return {
      category: 'nft',
      ownership: AssetChangeAnalyzer.objectOwnership(objChange, accountAddress),
      type: objChange.type,
      changeType: AssetChangeAnalyzer.objectChangeType(
        accountAddress,
        objChange
      ),
      objectType: objChange.objectType,
      objectId: objChange.objectId,
      digest: (objChange as any).digest,
      version: objChange.version,
      display: objectDesc.display,
    };
  }

  static coinChangeObject(
    accountAddress: string,
    objChange:
      | SuiObjectChangeCreated
      | SuiObjectChangeMutated
      | SuiObjectChangeDeleted
      | SuiObjectChangeWrapped
      | SuiObjectChangeTransferred,
    objectDesc: Record<string, any>
  ): ICoinChangeObject {
    return {
      category: 'coin',
      ownership: AssetChangeAnalyzer.objectOwnership(objChange, accountAddress),
      type: objChange.type,
      changeType: AssetChangeAnalyzer.coinChangeType(objectDesc.amount),
      objectType: objChange.objectType,
      objectId: '',
      digest: '',
      version: '',
      amount: objectDesc.amount ?? '0',
      symbol:
        objectDesc.symbol ?? Coin.getCoinSymbol(objectDesc.coinType) ?? '',
      coinType: objectDesc.coinType ?? '',
      decimals: objectDesc.decimals ?? 9,
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
    if (objectChange.type === 'deleted') return 'decrease';
    if (objectChange.type === 'wrapped') return 'modify';

    const sender = objectChange.sender;
    if (objectChange.type === 'transferred') {
      if (
        sender !== accountAddress &&
        objectChange.recipient === accountAddress
      )
        return 'increase';
      if (
        sender === accountAddress &&
        objectChange.recipient !== accountAddress
      )
        return 'decrease';
      return 'unknown';
    }

    if (
      typeof objectChange?.owner !== 'string' &&
      'Shared' in objectChange.owner
    ) {
      // handle changes with Shared Object
      if (objectChange.type === 'created') return 'increase';
      if (objectChange.type === 'mutated') return 'modify';
      return 'unknown';
    }

    if (
      typeof objectChange?.owner !== 'string' &&
      'ObjectOwner' in objectChange.owner
    ) {
      // handle changes with ObjectOwner
      if (objectChange.type === 'created') return 'increase';
      if (objectChange.type === 'mutated') return 'modify';
      return 'unknown';
    }

    // handle changes with AddressOwner
    const addressOwner =
      typeof objectChange?.owner !== 'string' &&
      objectChange.owner.AddressOwner;
    const type = objectChange.type;
    if (type === 'created') {
      return 'increase';
    }

    if (type === 'mutated') {
      if (sender === accountAddress && addressOwner !== accountAddress) {
        return 'decrease';
      }
      return 'modify';
    }
    return 'unknown';
  }

  static coinChangeType(amount: string): ObjectChangeType {
    return BigInt(amount) < 0 ? 'decrease' : 'increase';
  }

  static objectOwnership(
    objectChange: ObjectChange,
    accountAddress: string
  ): ObjectOwnership {
    if (objectChange.type === 'transferred') {
      if (objectChange.sender === accountAddress) return 'owned';
      if (objectChange.recipient === accountAddress) return 'owned';
      return 'unknown';
    }
    if (!('owner' in objectChange)) return 'unknown';
    if (
      'objectType' in objectChange &&
      objectChange.objectType.startsWith('0x2::dynamic_field::Field')
    ) {
      return 'dynamicField';
    }
    if (
      typeof objectChange?.owner !== 'string' &&
      ('Shared' in objectChange?.owner || 'ObjectOwner' in objectChange?.owner)
    ) {
      return 'shared';
    }
    return 'owned';
  }

  static buildObjectTypeMap(input: {
    accountAddress: string;
    balanceChanges: TokenBalanceChange[];
    objectDataMap: Record<string, SuiObjectData>;
  }) {
    const { accountAddress, balanceChanges = [], objectDataMap = {} } = input;

    const objectTypeMap = new Map<string, any>();
    for (const item of balanceChanges) {
      // ignore coin changes that are not related to the account
      if (
        typeof item?.owner !== 'string' &&
        'AddressOwner' in item.owner &&
        item.owner.AddressOwner !== accountAddress
      )
        continue;

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

  /**
   * Sort the object change list by change type
   * @param input
   */
  static orderObjectChangeList(
    input: IObjectChangeObject[]
  ): IObjectChangeObject[] {
    const orderMap = {
      decrease: 1,
      increase: 2,
      modify: 3,
      publish: 4,
      unknown: 5,
    };
    return input.sort(
      (a, b) => (orderMap[a.changeType] || 5) - (orderMap[b.changeType] || 5)
    );
  }
}
