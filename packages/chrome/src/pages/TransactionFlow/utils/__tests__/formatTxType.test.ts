import formatTxType from '../formatTxType';

describe('transaction display type', function () {
  test('convert from txHistoryItem', () => {
    expect(formatTxType('incoming')).toEqual('received');
    expect(formatTxType('outgoing')).toEqual('sent');
    expect(formatTxType('outgoing', 'Call')).toEqual('moveCall');
  });
});
