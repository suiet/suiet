import {
  ICoinChangeObject,
  INftChangeObject,
  IObjectChangeObject,
} from '../AssetChangeAnalyzer';
import AssetChangeFormatter from '../AssetChangeFormatter';

describe('format object change', () => {
  test('it should return +1 when changeType is increase', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'owned',
      type: 'created',
      changeType: 'increase',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: '+1 Object',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('it should return -1 when changeType is decrease', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'decrease',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: '-1 Object',
      changeDesc: '',
      changeTitleColor: 'red',
    });
  });

  test('its changeTitle should be "MODIFY" when changeType is modify', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'modify',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MODIFY',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });

  test('it should return changeTitle to the original type if changeType is unknown', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'unknown',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MUTATE',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });

  test('it should return title to Shared Object if ownership is shared', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'shared',
      type: 'mutated',
      changeType: 'unknown',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Shared Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MUTATE',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });

  test('it should return title to Dynamic Field if ownership is dynamicField', () => {
    const objectChange: IObjectChangeObject = {
      category: 'object',
      ownership: 'dynamicField',
      type: 'mutated',
      changeType: 'unknown',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Dynamic Field',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MUTATE',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });
});

describe('format coin change', () => {
  test('it should return +1 SUI when changeType is increase', () => {
    const coinType = '0x2::sui::SUI';
    const coinChange: ICoinChangeObject = {
      category: 'coin',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'increase',
      objectType: `0x2::coin::Coin<${coinType}>`,
      coinType: coinType,
      amount: '1000000000',
      symbol: '',
      decimals: 9,
      objectId: '',
      digest: '',
      version: '',
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'SUI',
      desc: coinType,
      icon: 'Sui',
      iconShape: 'circle',
      iconColor: 'blue',
      changeTitle: '+1',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('it should return +1 TOKEN when decimals is 3', () => {
    const coinType = '0x999::xxx::TOKEN';
    const objectType = `0x2::coin::Coin<${coinType}>`;
    const coinChange: ICoinChangeObject = {
      category: 'coin',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'increase',
      objectType: objectType,
      coinType: coinType,
      amount: '1000',
      symbol: 'TestToken',
      decimals: 3,
      objectId: '',
      digest: '',
      version: '',
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'TestToken',
      desc: coinType,
      icon: 'Coin',
      iconShape: 'circle',
      iconColor: 'purple',
      changeTitle: '+1',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });
});

describe('format nft change', () => {
  test('it should return +1 when changeType is increase', () => {
    const coinChange: INftChangeObject = {
      category: 'nft',
      ownership: 'owned',
      type: 'created',
      changeType: 'increase',
      objectType:
        '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
      display: {
        name: 'test name',
      },
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'test name',
      desc: 'objectId',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: '+1 NFT',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('its changeTitle should be "MODIFY" when changeType is modify', () => {
    const coinChange: INftChangeObject = {
      category: 'nft',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'modify',
      objectType:
        '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
      display: {
        name: 'test name',
      },
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'test name',
      desc: 'objectId',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MODIFY',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });

  test('it should show image_url as icon', () => {
    const coinChange: INftChangeObject = {
      category: 'nft',
      ownership: 'owned',
      type: 'created',
      changeType: 'increase',
      objectType:
        '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
      display: {
        name: 'test name',
        image_url: 'https://test.com/test.png',
      },
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'test name',
      desc: 'objectId',
      icon: 'https://test.com/test.png',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: '+1 NFT',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('it should show nft name as icon name', () => {
    const coinChange: INftChangeObject = {
      category: 'nft',
      ownership: 'owned',
      type: 'created',
      changeType: 'increase',
      objectType:
        '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
      display: {
        description: 'test name',
        image_url: 'https://test.com/test.png',
      },
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'test name',
      desc: 'objectId',
      icon: 'https://test.com/test.png',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: '+1 NFT',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('it should return changeTitle to the original type if changeType is unknown', () => {
    const objectChange: IObjectChangeObject = {
      category: 'nft',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'unknown',
      objectType: 'objectType',
      objectId: 'objectId',
      digest: 'digest',
      version: 'version',
    };
    expect(AssetChangeFormatter.format(objectChange)).toEqual({
      title: 'Object',
      desc: 'objectType',
      icon: 'Object',
      iconShape: 'square',
      iconColor: 'gray',
      changeTitle: 'MUTATE',
      changeDesc: '',
      changeTitleColor: 'orange',
    });
  });
});
