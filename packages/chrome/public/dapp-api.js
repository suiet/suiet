var l = Object.defineProperty;
var f = (e, n, o) => n in e ? l(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o;
var a = (e, n, o) => (f(e, typeof n != "symbol" ? n + "" : n, o), o);
var i, y = new Uint8Array(16);
function p() {
  if (!i && (i = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto < "u" && typeof msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto), !i))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return i(y);
}
const g = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function m(e) {
  return typeof e == "string" && g.test(e);
}
var t = [];
for (var u = 0; u < 256; ++u)
  t.push((u + 256).toString(16).substr(1));
function v(e) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, o = (t[e[n + 0]] + t[e[n + 1]] + t[e[n + 2]] + t[e[n + 3]] + "-" + t[e[n + 4]] + t[e[n + 5]] + "-" + t[e[n + 6]] + t[e[n + 7]] + "-" + t[e[n + 8]] + t[e[n + 9]] + "-" + t[e[n + 10]] + t[e[n + 11]] + t[e[n + 12]] + t[e[n + 13]] + t[e[n + 14]] + t[e[n + 15]]).toLowerCase();
  if (!m(o))
    throw TypeError("Stringified UUID is invalid");
  return o;
}
function w(e, n, o) {
  e = e || {};
  var s = e.random || (e.rng || p)();
  if (s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, n) {
    o = o || 0;
    for (var r = 0; r < 16; ++r)
      n[o + r] = s[r];
    return n;
  }
  return v(s);
}
var c = /* @__PURE__ */ ((e) => (e.DAPP = "DAPP", e.SUIET_CONTENT = "SUIET_CONTENT", e))(c || {});
function d(e, n) {
  return {
    id: w(),
    funcName: e,
    payload: n
  };
}
class T {
  constructor() {
    a(this, "name");
    a(this, "connected");
    a(this, "connecting");
    this.name = "Suiet", this.connected = !1, this.connecting = !1;
  }
  async connect() {
    window.postMessage({
      target: c.SUIET_CONTENT,
      payload: d("connect", null)
    });
  }
  async disconnect() {
    window.postMessage({
      target: c.SUIET_CONTENT,
      payload: d("disconnect", null)
    });
  }
  async hasPermissions(n) {
    return console.log("permissions", n), !0;
  }
  async requestPermissions() {
    return !0;
  }
  async executeMoveCall(n) {
    return await Promise.resolve(void 0);
  }
  async executeSerializedMoveCall(n) {
    return await Promise.resolve(void 0);
  }
  async getAccounts() {
    return [];
  }
}
Object.defineProperty(window, "__suiet__", {
  enumerable: !1,
  configurable: !1,
  value: new T()
});
export {
  T as DAppInterface
};
