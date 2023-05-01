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
      icon: 'object',
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
      icon: 'object',
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
      icon: 'object',
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
      icon: 'object',
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
      type: 'mutated',
      changeType: 'increase',
      objectType: `0x2::coin::Coin<${coinType}>`,
      coinType: coinType,
      amount: '1000000000',
      decimals: 9,
      objectId: '',
      digest: '',
      version: '',
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'SUI',
      desc: coinType,
      icon: 'sui',
      iconShape: 'circle',
      iconColor: 'blue',
      changeTitle: '+1 SUI',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });

  test('it should return +1 TOKEN when decimals is 3', () => {
    const coinType = '0x999::xxx::TOKEN';
    const objectType = `0x2::coin::Coin<${coinType}>`;
    const coinChange: ICoinChangeObject = {
      category: 'coin',
      type: 'mutated',
      changeType: 'increase',
      objectType: objectType,
      coinType: coinType,
      amount: '1000',
      decimals: 3,
      objectId: '',
      digest: '',
      version: '',
    };
    expect(AssetChangeFormatter.format(coinChange)).toEqual({
      title: 'TOKEN',
      desc: coinType,
      icon: 'coin',
      iconShape: 'circle',
      iconColor: 'purple',
      changeTitle: '+1 TOKEN',
      changeDesc: '',
      changeTitleColor: 'green',
    });
  });
});

describe('format nft change', () => {
  test('it should return +1 when changeType is increase', () => {
    const coinChange: INftChangeObject = {
      category: 'nft',
      type: 'created',
      changeType: 'increase',
      objectType: '0x2::coin::Coin<0x2::sui::SUI>',
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
      icon: 'object',
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
      type: 'mutated',
      changeType: 'modify',
      objectType: '0x2::coin::Coin<0x2::sui::SUI>',
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
      icon: 'object',
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
      type: 'created',
      changeType: 'increase',
      objectType: '0x2::coin::Coin<0x2::sui::SUI>',
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
      type: 'created',
      changeType: 'increase',
      objectType: '0x2::coin::Coin<0x2::sui::SUI>',
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
});
