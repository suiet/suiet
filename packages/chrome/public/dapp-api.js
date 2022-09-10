var l = Object.defineProperty;
var y = (n, e, o) =>
  e in n
    ? l(n, e, { enumerable: !0, configurable: !0, writable: !0, value: o })
    : (n[e] = o);
var i = (n, e, o) => (y(n, typeof e != 'symbol' ? e + '' : e, o), o);
let s;
const p = new Uint8Array(16);
function m() {
  if (
    !s &&
    ((s =
      typeof crypto < 'u' &&
      crypto.getRandomValues &&
      crypto.getRandomValues.bind(crypto)),
    !s)
  )
    throw new Error(
      'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
    );
  return s(p);
}
const t = [];
for (let n = 0; n < 256; ++n) t.push((n + 256).toString(16).slice(1));
function g(n, e = 0) {
  return (
    t[n[e + 0]] +
    t[n[e + 1]] +
    t[n[e + 2]] +
    t[n[e + 3]] +
    '-' +
    t[n[e + 4]] +
    t[n[e + 5]] +
    '-' +
    t[n[e + 6]] +
    t[n[e + 7]] +
    '-' +
    t[n[e + 8]] +
    t[n[e + 9]] +
    '-' +
    t[n[e + 10]] +
    t[n[e + 11]] +
    t[n[e + 12]] +
    t[n[e + 13]] +
    t[n[e + 14]] +
    t[n[e + 15]]
  ).toLowerCase();
}
const U =
    typeof crypto < 'u' && crypto.randomUUID && crypto.randomUUID.bind(crypto),
  u = {
    randomUUID: U,
  };
function w(n, e, o) {
  if (u.randomUUID && !e && !n) return u.randomUUID();
  n = n || {};
  const c = n.random || (n.rng || m)();
  if (((c[6] = (c[6] & 15) | 64), (c[8] = (c[8] & 63) | 128), e)) {
    o = o || 0;
    for (let r = 0; r < 16; ++r) e[o + r] = c[r];
    return e;
  }
  return g(c);
}
var a = /* @__PURE__ */ ((n) => (
  (n.DAPP = 'DAPP'), (n.SUIET_CONTENT = 'SUIET_CONTENT'), n
))(a || {});
function d(n, e) {
  return {
    id: w(),
    funcName: n,
    payload: e,
  };
}
class T {
  constructor() {
    i(this, 'name');
    i(this, 'connected');
    i(this, 'connecting');
    (this.name = 'Suiet'), (this.connected = !1), (this.connecting = !1);
  }
  async connect() {
    window.postMessage({
      target: a.SUIET_CONTENT,
      payload: d('connect', null),
    });
  }
  async disconnect() {
    console.log('req close message proxy'),
      window.postMessage({
        target: a.SUIET_CONTENT,
        payload: d('disconnect', null),
      });
  }
  async hasPermissions(e) {
    return console.log('permissions', e), !0;
  }
  async requestPermissions() {
    return !0;
  }
  async executeMoveCall(e) {
    return await Promise.resolve(void 0);
  }
  async executeSerializedMoveCall(e) {
    return await Promise.resolve(void 0);
  }
  async getAccounts() {
    return [];
  }
}
Object.defineProperty(window, '__suiet__', {
  enumerable: !1,
  configurable: !1,
  value: new T(),
});
export { T as DAppInterface };
