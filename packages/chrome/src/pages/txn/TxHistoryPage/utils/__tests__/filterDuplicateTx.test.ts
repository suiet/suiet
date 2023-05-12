import filterDuplicateTransactions from '../filterDuplicateTx';

describe('filter duplicate transactions', function () {
  test('should filter the following duplicate transactions based on digest', function () {
    const txList: any[] = [
      {
        type: 'incoming',
        digest: 'aaa',
      },
      {
        type: 'outgoing',
        digest: 'aaa',
      },
      {
        type: 'outgoing',
        digest: 'bbb',
      },
      {
        type: 'incoming',
        digest: 'bbb',
      },
      {
        type: 'outgoing',
        digest: 'ccc',
      },
    ];
    const result = filterDuplicateTransactions(txList);
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        type: 'incoming',
        digest: 'aaa',
      },
      {
        type: 'outgoing',
        digest: 'bbb',
      },
      {
        type: 'outgoing',
        digest: 'ccc',
      },
    ]);
  });
});
