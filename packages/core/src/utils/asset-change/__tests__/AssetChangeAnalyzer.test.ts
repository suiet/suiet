import AssetChangeAnalyzer from '../AssetChangeAnalyzer';

describe('analyze the result of changes to changes of needed different category', function () {
  test('it should return list of coin, nft and object changes', function () {
    const result = AssetChangeAnalyzer.analyze({} as any);
    expect(Array.isArray(result.getCoinChangeList())).toBeTruthy();
    expect(Array.isArray(result.getNftChangeList())).toBeTruthy();
    expect(Array.isArray(result.getObjectChangeList())).toBeTruthy();
  });

  test(
    'without balanceChanges and objectDataMap, ' +
      'it should return every change as object change',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507274447',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHn6WP',
        },
      ];

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList().length).toEqual(1);
      expect(result.getCoinChangeList().length).toEqual(0);
      expect(result.getNftChangeList().length).toEqual(0);
    }
  );

  test('it should return coin change with balanceChanges', function () {
    const accountAddress =
      '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
    // even if here is change of SUI, but without balanceChanges,
    // it would fall back to object change
    const objectChanges: any[] = [
      {
        type: 'mutated',
        sender:
          '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
        owner: {
          AddressOwner:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
        },
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507274447',
        version: '9223372036854775807',
        previousVersion: '8623409',
        digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHn6WP',
      },
    ];
    const balanceChanges = [
      {
        owner: {
          AddressOwner:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
        },
        coinType: '0x2::sui::SUI',
        amount: '-121392016',
      },
    ];

    const result = AssetChangeAnalyzer.analyze({
      accountAddress: accountAddress,
      objectChanges: objectChanges,
      balanceChanges: balanceChanges,
      objectDataMap: {},
    });
    expect(result.getCoinChangeList().length).toEqual(1);
    expect(result.getObjectChangeList().length).toEqual(0);
  });

  test('it should return nft change with objectDataMap', function () {
    const accountAddress =
      '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
    const objectChanges = [
      {
        type: 'mutated',
        sender:
          '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
        owner: {
          AddressOwner:
            '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce',
        },
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        version: '9223372036854775807',
        previousVersion: '16897',
        digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
      },
    ];
    const objectDataMap = {
      '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306': {
        display: {
          name: 'test nft',
        },
      },
    };
    const result = AssetChangeAnalyzer.analyze({
      accountAddress: accountAddress,
      objectChanges: objectChanges as any,
      balanceChanges: [],
      objectDataMap: objectDataMap as any,
    });
    expect(result.getNftChangeList().length).toEqual(1);
    expect(result.getObjectChangeList().length).toEqual(0);
    expect(result.getCoinChangeList().length).toEqual(0);
  });
});

describe('Detect Coin Change', function () {
  test(
    'it should return coin change structure with balanceChanges, ' +
      'changeType=send, when object change is mutated and amount is negative',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507274447',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHn6WP',
        },
      ];
      const balanceChanges = [
        {
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          coinType: '0x2::sui::SUI',
          amount: '-999',
        },
      ];

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: {},
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        type: 'mutated',
        changeType: 'decrease',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '-999',
        decimals: 9,
        coinType: '0x2::sui::SUI',
        // leave it empty because there could be multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test(
    'it should return coin change structure with balanceChanges, ' +
      'changeType=receive, when when object change is mutated and amount is positive',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507274447',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHn6WP',
        },
      ];
      const balanceChanges = [
        {
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          coinType: '0x2::sui::SUI',
          amount: '999',
        },
      ];

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: {},
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        type: 'mutated',
        changeType: 'increase',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        decimals: 9,
        coinType: '0x2::sui::SUI',
        // leave it empty because there could be multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test(
    'it should aggregate specific coin object for each type of coins' +
      'when there are multiple coin object changes',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507271111',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHnABC',
        },
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507279999', // different objectId
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHnEFG',
        },
      ];
      const balanceChanges = [
        {
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          coinType: '0x2::sui::SUI',
          amount: '999',
        },
      ];

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: {},
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        type: 'mutated',
        changeType: 'increase',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        decimals: 9,
        coinType: '0x2::sui::SUI',
        // leave it empty because there are multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test(
    'it should return coin change structure with balanceChanges, ' +
      'changeType=receive, when when object change is mutated and amount is positive',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender:
            '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          objectType: '0x2::coin::Coin<0x2::sui::SUI>',
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507274447',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHn6WP',
        },
      ];
      const balanceChanges = [
        {
          owner: {
            AddressOwner:
              '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7',
          },
          coinType: '0x2::sui::SUI',
          amount: '999',
        },
      ];

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: {},
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        changeType: 'receive',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        decimals: 9,
        coinType: '0x2::sui::SUI',
        // leave it empty because there could be multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test(
    'it should return coinChange with decimals' +
      'when decimals is provided in objectDataMap (by default is 9)',
    function () {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';

      const coinType = '0x999::xxx::TOKEN';
      const objectType = `0x2::coin::Coin<${coinType}>`;

      // even if here is change of SUI, but without balanceChanges,
      // it would fall back to object change
      const objectChanges: any[] = [
        {
          type: 'mutated',
          sender: accountAddress,
          owner: {
            AddressOwner: accountAddress,
          },
          objectType: objectType,
          objectId:
            '0x00af0fb93d0b7d248a33beb2cfd1c64e1930772bf2681a79b35f0ad507271111',
          version: '9223372036854775807',
          previousVersion: '8623409',
          digest: '2sMmnbiH5We9UBMn88psTTCMWYrLYMBQwfY7jwuHnABC',
        },
      ];
      const balanceChanges = [
        {
          owner: {
            AddressOwner: accountAddress,
          },
          coinType: coinType,
          amount: '1000000000',
        },
      ];
      const objectDataMap = {
        [objectType]: {
          decimals: 3,
        },
      };

      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: objectDataMap,
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        type: 'mutated',
        changeType: 'increase',
        objectType: objectType,
        // additional fields
        amount: '1000000000',
        decimals: 3, // with decimals
        coinType: coinType,
        // leave it empty because there are multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
});

describe('Detect NFT Change', function () {
  test(
    'it should return nft change structure with objectDataMap, ' +
      'changeType=send, when object change is mutated, sender is user and  receiver is other',
    () => {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      const receiverAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

      const objectChanges = [
        {
          type: 'mutated',
          sender: accountAddress,
          owner: {
            AddressOwner: receiverAddress, // change to another address
          },
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          previousVersion: '16897',
          digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        },
      ];
      const objectDataMap = {
        '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306': {
          display: {
            name: 'test nft',
          },
        },
      };
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: objectDataMap as any,
      });
      expect(result.getNftChangeList()[0]).toEqual({
        category: 'nft',
        type: 'mutated',
        changeType: 'decrease',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        version: '9223372036854775807',
        display: {
          name: 'test nft',
        },
      });
    }
  );
  test(
    'it should return nft change structure with objectDataMap, ' +
      'changeType=receive, when object change is created, sender and receiver are the user',
    () => {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';

      const objectChanges = [
        {
          type: 'created',
          sender: accountAddress,
          owner: {
            AddressOwner: accountAddress, // same as account address
          },
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          previousVersion: '16897',
          digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        },
      ];
      const objectDataMap = {
        '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306': {
          display: {
            name: 'test nft',
          },
        },
      };
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: objectDataMap as any,
      });
      expect(result.getNftChangeList()[0]).toEqual({
        category: 'nft',
        type: 'created',
        changeType: 'increase',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::nft::Nft',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        version: '9223372036854775807',
        display: {
          name: 'test nft',
        },
      });
    }
  );
});

describe('Fallback Detect Object Change', function () {
  test(
    'it should return object change structure when balanceChange and objectDataMap do not work, ' +
      'changeType=receive, when object change is mutated, sender is other, and receiver is user',
    () => {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';
      const receiverAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

      const objectChanges = [
        {
          type: 'mutated',
          sender: accountAddress,
          owner: {
            AddressOwner: receiverAddress, // change to another address
          },
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          previousVersion: '16897',
          digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'mutated',
        changeType: 'decrease',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        version: '9223372036854775807',
      });
    }
  );
  test(
    'it should return changeType=mutate, ' +
      'when object change is mutated, sender and receiver are the user itself',
    () => {
      const accountAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';

      const objectChanges = [
        {
          type: 'mutated',
          sender: accountAddress,
          owner: {
            AddressOwner: accountAddress, // same as account address
          },
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          previousVersion: '16897',
          digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'mutated',
        changeType: 'modify',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8HUSL7Yn8aXYDj8JMp89sDvGCbWVFssL1hgQVXhPaNRJ',
        version: '9223372036854775807',
      });
    }
  );

  test(
    'it should return changeType=decrease ' +
      'when objectChange type is transferred, sender is user and receiver is other',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
      const otherAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';

      const objectChanges = [
        {
          type: 'transferred',
          sender: accountAddress,
          recipient: otherAddress,
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'transferred',
        changeType: 'decrease',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );

  test(
    'it should return changeType=increase ' +
      'when objectChange type is transferred, sender is other and receiver is user',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
      const otherAddress =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678e5b7';

      const objectChanges = [
        {
          type: 'transferred',
          sender: otherAddress,
          recipient: accountAddress,
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'transferred',
        changeType: 'increase',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );

  test(
    'it should return changeType=unknown ' +
      'when objectChange type is transferred, sender and receiver are not user',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
      const otherAddress1 =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678eaaa';
      const otherAddress2 =
        '0xe2664e827c8aaa42035c78e285ad6d8702af220d662b0614bd64d356a678ebbb';

      const objectChanges = [
        {
          type: 'transferred',
          sender: otherAddress1,
          recipient: otherAddress2,
          objectType:
            '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
          objectId:
            '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
          version: '9223372036854775807',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'transferred',
        changeType: 'unknown',
        objectType:
          '0x57c53166c2b04c1f1fc93105b39b6266cb1eccbe654f5d2fc89d5b44524b11fd::other::Something',
        objectId:
          '0x12de1aab1f366ef48eae514750462f80543f7756383fbe94102b9ccea304c306',
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );
});

describe('Handle Object Change with ObjectOwner', () => {
  test('it should preserve this object change if its parent object is not in the changes', () => {
    const accountAddress =
      '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
    const objectType =
      '0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::genesis::Mint';
    const objectId =
      '0x7d136b6b7b6be9799e1a8f86b104a041805325e97364bfc5a3b89df803c3b2ce';

    const objectChanges = [
      {
        type: 'mutated',
        sender: accountAddress,
        owner: {
          ObjectOwner:
            '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
        },
        objectType: objectType,
        objectId: objectId,
        version: '9223372036854775807',
        previousVersion: '19320939',
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
      },
    ];
    const result = AssetChangeAnalyzer.analyze({
      accountAddress: accountAddress,
      objectChanges: objectChanges as any,
      balanceChanges: [],
      objectDataMap: {},
    });
    expect(result.getObjectChangeList()[0]).toEqual({
      category: 'object',
      type: 'mutated',
      changeType: 'modify',
      objectType: objectType,
      objectId: objectId,
      digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
      version: '9223372036854775807',
    });
  });

  test(
    'it should filter out this object change ' +
      'if its parent object is in the changes',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

      const parentObjectId =
        '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a';
      const parentObjectType =
        '0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::genesis::Mint';
      const childObjectId =
        '0x7d136b6b7b6be9799e1a8f86b104a041805325e97364bfc5a3b89df803c3b2ce';
      const childObjectType =
        '0x2::dynamic_field::Field<0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::AppKey<0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::capy::Capy>, 0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::AppCap>';

      const objectChanges = [
        // parent object
        {
          type: 'mutated',
          sender:
            '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce',
          owner: {
            Shared: {
              initial_shared_version: 3822520,
            },
          },
          objectType: parentObjectType,
          objectId: parentObjectId,
          version: '9223372036854775807',
          previousVersion: '19320939',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
        // dynamic filed object
        {
          type: 'mutated',
          sender: accountAddress,
          owner: {
            ObjectOwner: parentObjectId,
          },
          objectType: childObjectType,
          objectId: childObjectId,
          version: '9223372036854775807',
          previousVersion: '19320939',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });

      expect(result.getObjectChangeList().length).toEqual(1);
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'mutated',
        changeType: 'modify',
        objectType: parentObjectType,
        objectId: parentObjectId,
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );
});

describe('Handle Object Change with Shared Object', () => {
  test(
    'it should return changeType=mutate for Share object' +
      'when objectChange type is mutated',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
      const objectType =
        '0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::genesis::Mint';
      const objectId =
        '0x7d136b6b7b6be9799e1a8f86b104a041805325e97364bfc5a3b89df803c3b2ce';

      const objectChanges = [
        {
          type: 'mutated',
          sender:
            '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce',
          owner: {
            Shared: {
              initial_shared_version: 3822520,
            },
          },
          objectType: objectType,
          objectId: objectId,
          version: '9223372036854775807',
          previousVersion: '19320939',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'mutated',
        changeType: 'modify',
        objectType: objectType,
        objectId: objectId,
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );
});

describe('Edge Case Detect Object Change', function () {
  test(
    'it should return changeType=publish ' +
      'when objectChange type is published',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

      const objectChanges = [
        {
          type: 'published',
          packageId:
            '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
          version: '9223372036854775807',
          digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
          modules: [],
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'published',
        changeType: 'publish',
        objectType: '',
        objectId:
          '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
        digest: '8G1RcNzthZ5HWnsKr1JXjKuPBzQDEnkTqar8LW4YMTW3',
        version: '9223372036854775807',
      });
    }
  );

  test(
    'it should return changeType=mutate ' + 'when objectChange type is wrapped',
    () => {
      const accountAddress =
        '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

      const objectChanges = [
        {
          type: 'wrapped',
          sender: accountAddress,
          objectType:
            '0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::genesis::Mint',
          objectId:
            '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
          version: '9223372036854775807',
        },
      ];
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges as any,
        balanceChanges: [],
        objectDataMap: {},
      });
      expect(result.getObjectChangeList()[0]).toEqual({
        category: 'object',
        type: 'wrapped',
        changeType: 'modify',
        objectType:
          '0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::genesis::Mint',
        objectId:
          '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
        digest: '',
        version: '9223372036854775807',
      });
    }
  );
});
