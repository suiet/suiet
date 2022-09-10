var o = Object.defineProperty;
var t = (n, e, s) =>
  e in n
    ? o(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s })
    : (n[e] = s);
var c = (n, e, s) => (t(n, typeof e != 'symbol' ? e + '' : e, s), s);
class a {
  constructor() {
    c(this, 'name');
    c(this, 'connected');
    c(this, 'connecting');
    (this.name = ''), (this.connected = !1), (this.connecting = !1);
  }
  async connect() {
    console.log('fake connected');
  }
  async disconnect() {
    console.log('fake disconnected');
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
  value: new a(),
});
export { a as DAppInterface };
