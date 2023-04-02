import formatTxType from '../formatTxType';

describe('transaction display type', function () {
  test('when category is transfer_coin', () => {
    expect(formatTxType('incoming', '', 'transfer_coin')).toEqual('received');
    expect(formatTxType('outgoing', '', 'transfer_coin')).toEqual('sent');
  });

  test('when category is not transfer_coin, return kind', () => {
    expect(formatTxType('incoming', 'MoveCall', 'something')).toEqual(
      'MoveCall'
    );
  });
});
