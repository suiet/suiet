import { ipfsToHttp, nftImgUrl } from '../nft';

describe('nft img url', function () {
  test('url starts with ipfs, change to ipfs gateway prefix', () => {
    expect(
      nftImgUrl(
        'ipfs://bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
      )
    ).toEqual(
      'https://ipfs.io/ipfs/bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
    );
  });
  test('otherwise, return intact', () => {
    expect(
      nftImgUrl(
        'https://ipfs.io/ipfs/bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
      )
    ).toEqual(
      'https://ipfs.io/ipfs/bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
    );
  });
});

test('ipfs to http', () => {
  expect(
    ipfsToHttp(
      'ipfs://bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
    )
  ).toEqual(
    'https://ipfs.io/ipfs/bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty'
  );
});
