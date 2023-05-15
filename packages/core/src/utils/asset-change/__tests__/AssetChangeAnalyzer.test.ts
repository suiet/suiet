import AssetChangeAnalyzer, { ObjectChange } from '../AssetChangeAnalyzer';

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
        ownership: 'owned',
        type: 'mutated',
        changeType: 'decrease',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '-999',
        symbol: 'SUI',
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
      'changeType=increase, when when object change is mutated and amount is positive',
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
        ownership: 'owned',
        type: 'mutated',
        changeType: 'increase',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        symbol: 'SUI',
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
        ownership: 'owned',
        type: 'mutated',
        changeType: 'increase',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        symbol: 'SUI',
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
        ownership: 'owned',
        changeType: 'increase',
        type: 'mutated',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        // additional fields
        amount: '999',
        decimals: 9,
        coinType: '0x2::sui::SUI',
        symbol: 'SUI',
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
        ownership: 'owned',
        type: 'mutated',
        changeType: 'increase',
        objectType: objectType,
        // additional fields
        amount: '1000000000',
        symbol: 'TOKEN',
        decimals: 3, // with decimals
        coinType: coinType,
        // leave it empty because there are multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test(
    'it should return coinChange with symbol ' +
      'when symbol is provided in objectDataMap',
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
      const result = AssetChangeAnalyzer.analyze({
        accountAddress: accountAddress,
        objectChanges: objectChanges,
        balanceChanges: balanceChanges,
        objectDataMap: {
          [objectType]: {
            decimals: 3,
            symbol: 'test_coin', // additional info
          },
        },
      });
      expect(result.getCoinChangeList()[0]).toEqual({
        category: 'coin',
        ownership: 'owned',
        type: 'mutated',
        changeType: 'increase',
        objectType: objectType,
        // additional fields
        amount: '1000000000',
        symbol: 'test_coin', // with symbol
        decimals: 3,
        coinType: coinType,
        // leave it empty because there are multiple coin object changes
        objectId: '',
        digest: '',
        version: '',
      });
    }
  );
  test('it should filter out coinChanges that do not belong to the current account', function () {
    const accountAddress =
      '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d';

    const otherAddress =
      '0x59ff302653885e57a48d8f78abae7da6a7100f14b59ef56866bbb76664410cad';

    const coinType = '0x2::sui::SUI';
    const objectType = `0x2::coin::Coin<${coinType}>`;

    // even if here is change of SUI, but without balanceChanges,
    // it would fall back to object change
    const objectChanges: any[] = [
      {
        type: 'mutated',
        sender:
          '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        owner: {
          AddressOwner:
            '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        },
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0x249bca0218ce9fc0ccf70696c68a832e3502489079c22c290320b725ce1522d7',
        version: '9223372036854775807',
        previousVersion: '1794810',
        digest: 'DruAVkkmgedEK2e8r4nzWFcVSVgYDPY3wPqDptub1E3c',
      },
      {
        type: 'created',
        sender:
          '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        owner: {
          AddressOwner:
            '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        },
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0x7091c4e27b940ba68050058f64c5281b57c84a4c67f8b323944c5ad9cb9a396d',
        version: '9223372036854775807',
        digest: '8oJrA46C1dCVMXH3MUFzNJ2e4RuhkogACP3CBqRKi1qA',
      },
      {
        type: 'created',
        sender:
          '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        owner: {
          AddressOwner:
            '0x59ff302653885e57a48d8f78abae7da6a7100f14b59ef56866bbb76664410cad',
        },
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0xa317a707e1a3c0533309f026267d538e1e179d013e3d9b747966f961e4eaea51',
        version: '9223372036854775807',
        digest: 'BfjRHaQ6b112f7dQS1HZSKx8nAcX5HuLmPUdEndtKHY4',
      },
      {
        type: 'deleted',
        sender:
          '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0x5f57d3dee5590a2a5553196de5a8a0d8d4d0eae32b9abb64cca7f51d0d695c63',
        version: '9223372036854775807',
      },
      {
        type: 'deleted',
        sender:
          '0x02b8c7910bd47a8b7ba494871f85d89e2e509df3bfa04861dbf5d9852910977d',
        objectType: '0x2::coin::Coin<0x2::sui::SUI>',
        objectId:
          '0xec8561d391b773478b52c4dfb891330172a23fdf2f91b1513b3f2056875c0892',
        version: '9223372036854775807',
      },
    ];
    const balanceChanges = [
      {
        owner: {
          AddressOwner: accountAddress,
        },
        coinType: '0x2::sui::SUI',
        amount: '-131155372484',
      },
      {
        owner: {
          AddressOwner: otherAddress,
        },
        coinType: '0x2::sui::SUI',
        amount: '2500000000',
      },
    ];
    const result = AssetChangeAnalyzer.analyze({
      accountAddress: accountAddress,
      objectChanges: objectChanges,
      balanceChanges: balanceChanges,
      objectDataMap: {},
    });

    expect(result.getCoinChangeList().length).toEqual(1);
    expect(result.getCoinChangeList()[0]).toEqual({
      category: 'coin',
      ownership: 'owned',
      type: 'mutated',
      changeType: 'decrease',
      objectType: objectType,
      // additional fields
      amount: '-131155372484',
      symbol: 'SUI', // with symbol
      decimals: 9,
      coinType: coinType,
      // leave it empty because there are multiple coin object changes
      objectId: '',
      digest: '',
      version: '',
    });
  });
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
        ownership: 'owned',
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
        ownership: 'owned',
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
        ownership: 'owned',
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
        ownership: 'owned',
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
        ownership: 'owned',
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
        ownership: 'owned',
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
        ownership: 'unknown',
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

describe('Handle DynamicField: Object Change with ObjectOwner', () => {
  test('it should filter out all the object changes of dynamic fields', () => {
    const accountAddress =
      '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';

    const objectChanges = [
      // dynamic filed objects
      {
        type: 'mutated',
        sender: accountAddress,
        owner: {
          ObjectOwner:
            '0x7ab8d6a33cc59f9d426f6f40edc727b6fa57b341c165b465dd2a6ca1c49adc5a',
        },
        objectType:
          '0x2::dynamic_field::Field<0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::AppKey<0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::capy::Capy>, 0x3dcfc5338d8358450b145629c985a9d6cb20f9c0ab6667e328e152cdfd8022cd::suifrens::AppCap>',
        objectId:
          '0x7d136b6b7b6be9799e1a8f86b104a041805325e97364bfc5a3b89df803c3b2ce',
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

    expect(result.getObjectChangeList().length).toEqual(0);
  });
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
        ownership: 'shared',
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
        ownership: 'unknown',
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
    'it should return changeType=modify ' + 'when objectChange type is wrapped',
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
        ownership: 'unknown',
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

describe('determine object ownership', () => {
  test('it should return owner=owned', () => {
    const accountAddress =
      '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
    const objectChange: ObjectChange = {
      type: 'mutated',
      sender: accountAddress,
      owner: {
        AddressOwner: accountAddress,
      },
      objectType: '',
      objectId: '',
      version: '',
      previousVersion: '',
      digest: '',
    };
    expect(
      AssetChangeAnalyzer.objectOwnership(objectChange, accountAddress)
    ).toEqual('owned');
  });
  test('it should return owner=shared', () => {
    const accountAddress =
      '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
    const objectChange: ObjectChange = {
      type: 'mutated',
      sender: accountAddress,
      owner: {
        Shared: {
          initial_shared_version: 3822520,
        },
      },
      objectType: '',
      objectId: '',
      version: '',
      previousVersion: '',
      digest: '',
    };
    expect(
      AssetChangeAnalyzer.objectOwnership(objectChange, accountAddress)
    ).toEqual('shared');

    const objectChange2: ObjectChange = {
      type: 'mutated',
      sender: accountAddress,
      owner: {
        ObjectOwner:
          '0x8244085600ed77e1698e68428ec171c3757561ed7dc63b9a38a0623aa3604cff',
      },
      objectType:
        '0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies',
      objectId:
        '0x2542e1b0df5a57868fd6cfcf3707e9c1e9409f2dd14a393bd191f7f712cb58cc',
      version: '9223372036854775807',
      previousVersion: '1768647',
      digest: '6N7QPRLy5EhUTqwmBkgApm1rNuoJsh6qy59upz3cN7R5',
    };
    expect(
      AssetChangeAnalyzer.objectOwnership(objectChange2, accountAddress)
    ).toEqual('shared');
  });
  test('it should return owner=dynamicField', () => {
    const accountAddress =
      '0x5259566eff17db24fb013e71558075ad775ad66eb09bdcbddfe58b633d904fce';
    const objectChange: ObjectChange = {
      type: 'mutated',
      sender: accountAddress,
      owner: {
        ObjectOwner: '',
      },
      objectType:
        '0x2::dynamic_field::Field<0x1::type_name::TypeName, 0x2::balance::Balance<0x2::sui::SUI>>',
      objectId: '',
      version: '',
      previousVersion: '',
      digest: '',
    };
    expect(
      AssetChangeAnalyzer.objectOwnership(objectChange, accountAddress)
    ).toEqual('dynamicField');
  });
});

describe('order of object and nft', () => {
  test('it should follow the order: decrease, increase, modify, publish, unknown', () => {
    expect(
      AssetChangeAnalyzer.orderObjectChangeList([
        { changeType: 'unknown' },
        { changeType: 'publish' },
        { changeType: 'modify' },
        { changeType: 'increase' },
        { changeType: 'decrease' },
      ] as any)
    ).toEqual([
      { changeType: 'decrease' },
      { changeType: 'increase' },
      { changeType: 'modify' },
      { changeType: 'publish' },
      { changeType: 'unknown' },
    ]);
  });
});
