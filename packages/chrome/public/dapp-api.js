var o = Object.defineProperty;
var r = (n, e, s) =>
  e in n
    ? o(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s })
    : (n[e] = s);
var t = (n, e, s) => (r(n, typeof e != 'symbol' ? e + '' : e, s), s);
class a {
  constructor() {
    t(this, 'name');
    t(this, 'connected');
    t(this, 'connecting');
    (this.name = ''), (this.connected = !1), (this.connecting = !1);
  }
  async hasPermissions(e) {
    return console.log('permissions', e), !0;
  }
  async requestPermissions() {
    return (
      window.postMessage({
        target: 'suiet_content-script',
        payload: {
          joke: 'Knock knock',
        },
      }),
      !0
    );
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
  value: new a(),
});
export { a as DAppInterface };
