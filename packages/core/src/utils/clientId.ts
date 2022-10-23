import randomBytes from 'randombytes';

const randomString = ({
  length: e,
  characters: t,
}: {
  length: number;
  characters: string;
}) => {
  if (!(e >= 0 && Number.isFinite(e)))
    throw new TypeError(
      'Expected a `length` to be a non-negative finite number'
    );
  if (t.length === 0)
    throw new TypeError(
      'Expected `characters` string length to be greater than or equal to 1'
    );
  if (t.length > 65536)
    throw new TypeError(
      'Expected `characters` string length to be less or equal to 65536'
    );
  const r = t.length;
  const n = Math.floor(65536 / r) * r - 1;
  const o = 2 * Math.ceil(1.1 * e);
  let i = '';
  let a = 0;
  for (; a < e; ) {
    const s = randomBytes(o);
    let u = 0;
    for (; u < o && a < e; ) {
      const c = s.readUInt16LE(u);
      // eslint-disable-next-line
      (u += 2), !(c > n) && ((i += t[c % r]), a++);
    }
  }
  return i;
};

export const generateClientId = (len: number, t?: any, prefix?: any) => {
  const n = randomString({
    length: len,
    characters: t ?? 'abcdefghijklmnopqrstuvwxyz0123456789',
  });
  return (prefix ?? '') + n;
};
