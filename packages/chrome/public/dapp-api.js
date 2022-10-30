var xi = Object.defineProperty;
var bi = (n, i, s) => i in n ? xi(n, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[i] = s;
var kt = (n, i, s) => (bi(n, typeof i != "symbol" ? i + "" : i, s), s), de = (n, i, s) => {
  if (!i.has(n))
    throw TypeError("Cannot " + s);
};
var At = (n, i, s) => (de(n, i, "read from private field"), s ? s.call(n) : i.get(n)), Tt = (n, i, s) => {
  if (i.has(n))
    throw TypeError("Cannot add the same private member more than once");
  i instanceof WeakSet ? i.add(n) : i.set(n, s);
}, Yt = (n, i, s, h) => (de(n, i, "write to private field"), h ? h.call(n, s) : i.set(n, s), s);
var tr = (n, i, s) => (de(n, i, "access private method"), s);
var jt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Je(n) {
  var i = n.default;
  if (typeof i == "function") {
    var s = function() {
      return i.apply(this, arguments);
    };
    s.prototype = i.prototype;
  } else
    s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(n).forEach(function(h) {
    var p = Object.getOwnPropertyDescriptor(n, h);
    Object.defineProperty(s, h, p.get ? p : {
      enumerable: !0,
      get: function() {
        return n[h];
      }
    });
  }), s;
}
var qr = {}, Gr = {};
Gr.byteLength = Ai;
Gr.toByteArray = Ii;
Gr.fromByteArray = Ui;
var zt = [], Dt = [], Ei = typeof Uint8Array < "u" ? Uint8Array : Array, pe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ir = 0, _i = pe.length; ir < _i; ++ir)
  zt[ir] = pe[ir], Dt[pe.charCodeAt(ir)] = ir;
Dt["-".charCodeAt(0)] = 62;
Dt["_".charCodeAt(0)] = 63;
function Xe(n) {
  var i = n.length;
  if (i % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var s = n.indexOf("=");
  s === -1 && (s = i);
  var h = s === i ? 0 : 4 - s % 4;
  return [s, h];
}
function Ai(n) {
  var i = Xe(n), s = i[0], h = i[1];
  return (s + h) * 3 / 4 - h;
}
function Bi(n, i, s) {
  return (i + s) * 3 / 4 - s;
}
function Ii(n) {
  var i, s = Xe(n), h = s[0], p = s[1], f = new Ei(Bi(n, h, p)), M = 0, v = p > 0 ? h - 4 : h, B;
  for (B = 0; B < v; B += 4)
    i = Dt[n.charCodeAt(B)] << 18 | Dt[n.charCodeAt(B + 1)] << 12 | Dt[n.charCodeAt(B + 2)] << 6 | Dt[n.charCodeAt(B + 3)], f[M++] = i >> 16 & 255, f[M++] = i >> 8 & 255, f[M++] = i & 255;
  return p === 2 && (i = Dt[n.charCodeAt(B)] << 2 | Dt[n.charCodeAt(B + 1)] >> 4, f[M++] = i & 255), p === 1 && (i = Dt[n.charCodeAt(B)] << 10 | Dt[n.charCodeAt(B + 1)] << 4 | Dt[n.charCodeAt(B + 2)] >> 2, f[M++] = i >> 8 & 255, f[M++] = i & 255), f;
}
function Si(n) {
  return zt[n >> 18 & 63] + zt[n >> 12 & 63] + zt[n >> 6 & 63] + zt[n & 63];
}
function Fi(n, i, s) {
  for (var h, p = [], f = i; f < s; f += 3)
    h = (n[f] << 16 & 16711680) + (n[f + 1] << 8 & 65280) + (n[f + 2] & 255), p.push(Si(h));
  return p.join("");
}
function Ui(n) {
  for (var i, s = n.length, h = s % 3, p = [], f = 16383, M = 0, v = s - h; M < v; M += f)
    p.push(Fi(n, M, M + f > v ? v : M + f));
  return h === 1 ? (i = n[s - 1], p.push(
    zt[i >> 2] + zt[i << 4 & 63] + "=="
  )) : h === 2 && (i = (n[s - 2] << 8) + n[s - 1], p.push(
    zt[i >> 10] + zt[i >> 4 & 63] + zt[i << 2 & 63] + "="
  )), p.join("");
}
var Be = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Be.read = function(n, i, s, h, p) {
  var f, M, v = p * 8 - h - 1, B = (1 << v) - 1, I = B >> 1, F = -7, k = s ? p - 1 : 0, O = s ? -1 : 1, S = n[i + k];
  for (k += O, f = S & (1 << -F) - 1, S >>= -F, F += v; F > 0; f = f * 256 + n[i + k], k += O, F -= 8)
    ;
  for (M = f & (1 << -F) - 1, f >>= -F, F += h; F > 0; M = M * 256 + n[i + k], k += O, F -= 8)
    ;
  if (f === 0)
    f = 1 - I;
  else {
    if (f === B)
      return M ? NaN : (S ? -1 : 1) * (1 / 0);
    M = M + Math.pow(2, h), f = f - I;
  }
  return (S ? -1 : 1) * M * Math.pow(2, f - h);
};
Be.write = function(n, i, s, h, p, f) {
  var M, v, B, I = f * 8 - p - 1, F = (1 << I) - 1, k = F >> 1, O = p === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S = h ? 0 : f - 1, z = h ? 1 : -1, j = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
  for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (v = isNaN(i) ? 1 : 0, M = F) : (M = Math.floor(Math.log(i) / Math.LN2), i * (B = Math.pow(2, -M)) < 1 && (M--, B *= 2), M + k >= 1 ? i += O / B : i += O * Math.pow(2, 1 - k), i * B >= 2 && (M++, B /= 2), M + k >= F ? (v = 0, M = F) : M + k >= 1 ? (v = (i * B - 1) * Math.pow(2, p), M = M + k) : (v = i * Math.pow(2, k - 1) * Math.pow(2, p), M = 0)); p >= 8; n[s + S] = v & 255, S += z, v /= 256, p -= 8)
    ;
  for (M = M << p | v, I += p; I > 0; n[s + S] = M & 255, S += z, M /= 256, I -= 8)
    ;
  n[s + S - z] |= j * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  const i = Gr, s = Be, h = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = v, n.SlowBuffer = ot, n.INSPECT_MAX_BYTES = 50;
  const p = 2147483647;
  n.kMaxLength = p, v.TYPED_ARRAY_SUPPORT = f(), !v.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function f() {
    try {
      const a = new Uint8Array(1), r = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(a, r), a.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(v.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (!!v.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(v.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (!!v.isBuffer(this))
        return this.byteOffset;
    }
  });
  function M(a) {
    if (a > p)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
    const r = new Uint8Array(a);
    return Object.setPrototypeOf(r, v.prototype), r;
  }
  function v(a, r, e) {
    if (typeof a == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return k(a);
    }
    return B(a, r, e);
  }
  v.poolSize = 8192;
  function B(a, r, e) {
    if (typeof a == "string")
      return O(a, r);
    if (ArrayBuffer.isView(a))
      return z(a);
    if (a == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
      );
    if (Rt(a, ArrayBuffer) || a && Rt(a.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Rt(a, SharedArrayBuffer) || a && Rt(a.buffer, SharedArrayBuffer)))
      return j(a, r, e);
    if (typeof a == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const c = a.valueOf && a.valueOf();
    if (c != null && c !== a)
      return v.from(c, r, e);
    const x = Bt(a);
    if (x)
      return x;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof a[Symbol.toPrimitive] == "function")
      return v.from(a[Symbol.toPrimitive]("string"), r, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
    );
  }
  v.from = function(a, r, e) {
    return B(a, r, e);
  }, Object.setPrototypeOf(v.prototype, Uint8Array.prototype), Object.setPrototypeOf(v, Uint8Array);
  function I(a) {
    if (typeof a != "number")
      throw new TypeError('"size" argument must be of type number');
    if (a < 0)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
  }
  function F(a, r, e) {
    return I(a), a <= 0 ? M(a) : r !== void 0 ? typeof e == "string" ? M(a).fill(r, e) : M(a).fill(r) : M(a);
  }
  v.alloc = function(a, r, e) {
    return F(a, r, e);
  };
  function k(a) {
    return I(a), M(a < 0 ? 0 : Q(a) | 0);
  }
  v.allocUnsafe = function(a) {
    return k(a);
  }, v.allocUnsafeSlow = function(a) {
    return k(a);
  };
  function O(a, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !v.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const e = It(a, r) | 0;
    let c = M(e);
    const x = c.write(a, r);
    return x !== e && (c = c.slice(0, x)), c;
  }
  function S(a) {
    const r = a.length < 0 ? 0 : Q(a.length) | 0, e = M(r);
    for (let c = 0; c < r; c += 1)
      e[c] = a[c] & 255;
    return e;
  }
  function z(a) {
    if (Rt(a, Uint8Array)) {
      const r = new Uint8Array(a);
      return j(r.buffer, r.byteOffset, r.byteLength);
    }
    return S(a);
  }
  function j(a, r, e) {
    if (r < 0 || a.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (a.byteLength < r + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let c;
    return r === void 0 && e === void 0 ? c = new Uint8Array(a) : e === void 0 ? c = new Uint8Array(a, r) : c = new Uint8Array(a, r, e), Object.setPrototypeOf(c, v.prototype), c;
  }
  function Bt(a) {
    if (v.isBuffer(a)) {
      const r = Q(a.length) | 0, e = M(r);
      return e.length === 0 || a.copy(e, 0, 0, r), e;
    }
    if (a.length !== void 0)
      return typeof a.length != "number" || V(a.length) ? M(0) : S(a);
    if (a.type === "Buffer" && Array.isArray(a.data))
      return S(a.data);
  }
  function Q(a) {
    if (a >= p)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + p.toString(16) + " bytes");
    return a | 0;
  }
  function ot(a) {
    return +a != a && (a = 0), v.alloc(+a);
  }
  v.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== v.prototype;
  }, v.compare = function(r, e) {
    if (Rt(r, Uint8Array) && (r = v.from(r, r.offset, r.byteLength)), Rt(e, Uint8Array) && (e = v.from(e, e.offset, e.byteLength)), !v.isBuffer(r) || !v.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === e)
      return 0;
    let c = r.length, x = e.length;
    for (let E = 0, A = Math.min(c, x); E < A; ++E)
      if (r[E] !== e[E]) {
        c = r[E], x = e[E];
        break;
      }
    return c < x ? -1 : x < c ? 1 : 0;
  }, v.isEncoding = function(r) {
    switch (String(r).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, v.concat = function(r, e) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return v.alloc(0);
    let c;
    if (e === void 0)
      for (e = 0, c = 0; c < r.length; ++c)
        e += r[c].length;
    const x = v.allocUnsafe(e);
    let E = 0;
    for (c = 0; c < r.length; ++c) {
      let A = r[c];
      if (Rt(A, Uint8Array))
        E + A.length > x.length ? (v.isBuffer(A) || (A = v.from(A)), A.copy(x, E)) : Uint8Array.prototype.set.call(
          x,
          A,
          E
        );
      else if (v.isBuffer(A))
        A.copy(x, E);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      E += A.length;
    }
    return x;
  };
  function It(a, r) {
    if (v.isBuffer(a))
      return a.length;
    if (ArrayBuffer.isView(a) || Rt(a, ArrayBuffer))
      return a.byteLength;
    if (typeof a != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof a
      );
    const e = a.length, c = arguments.length > 2 && arguments[2] === !0;
    if (!c && e === 0)
      return 0;
    let x = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return Y(a).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return X(a).length;
        default:
          if (x)
            return c ? -1 : Y(a).length;
          r = ("" + r).toLowerCase(), x = !0;
      }
  }
  v.byteLength = It;
  function Lt(a, r, e) {
    let c = !1;
    if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, r >>>= 0, e <= r))
      return "";
    for (a || (a = "utf8"); ; )
      switch (a) {
        case "hex":
          return b(this, r, e);
        case "utf8":
        case "utf-8":
          return t(this, r, e);
        case "ascii":
          return m(this, r, e);
        case "latin1":
        case "binary":
          return w(this, r, e);
        case "base64":
          return g(this, r, e);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return _(this, r, e);
        default:
          if (c)
            throw new TypeError("Unknown encoding: " + a);
          a = (a + "").toLowerCase(), c = !0;
      }
  }
  v.prototype._isBuffer = !0;
  function st(a, r, e) {
    const c = a[r];
    a[r] = a[e], a[e] = c;
  }
  v.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < r; e += 2)
      st(this, e, e + 1);
    return this;
  }, v.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < r; e += 4)
      st(this, e, e + 3), st(this, e + 1, e + 2);
    return this;
  }, v.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < r; e += 8)
      st(this, e, e + 7), st(this, e + 1, e + 6), st(this, e + 2, e + 5), st(this, e + 3, e + 4);
    return this;
  }, v.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? t(this, 0, r) : Lt.apply(this, arguments);
  }, v.prototype.toLocaleString = v.prototype.toString, v.prototype.equals = function(r) {
    if (!v.isBuffer(r))
      throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : v.compare(this, r) === 0;
  }, v.prototype.inspect = function() {
    let r = "";
    const e = n.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
  }, h && (v.prototype[h] = v.prototype.inspect), v.prototype.compare = function(r, e, c, x, E) {
    if (Rt(r, Uint8Array) && (r = v.from(r, r.offset, r.byteLength)), !v.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (e === void 0 && (e = 0), c === void 0 && (c = r ? r.length : 0), x === void 0 && (x = 0), E === void 0 && (E = this.length), e < 0 || c > r.length || x < 0 || E > this.length)
      throw new RangeError("out of range index");
    if (x >= E && e >= c)
      return 0;
    if (x >= E)
      return -1;
    if (e >= c)
      return 1;
    if (e >>>= 0, c >>>= 0, x >>>= 0, E >>>= 0, this === r)
      return 0;
    let A = E - x, D = c - e;
    const C = Math.min(A, D), R = this.slice(x, E), W = r.slice(e, c);
    for (let T = 0; T < C; ++T)
      if (R[T] !== W[T]) {
        A = R[T], D = W[T];
        break;
      }
    return A < D ? -1 : D < A ? 1 : 0;
  };
  function $(a, r, e, c, x) {
    if (a.length === 0)
      return -1;
    if (typeof e == "string" ? (c = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, V(e) && (e = x ? 0 : a.length - 1), e < 0 && (e = a.length + e), e >= a.length) {
      if (x)
        return -1;
      e = a.length - 1;
    } else if (e < 0)
      if (x)
        e = 0;
      else
        return -1;
    if (typeof r == "string" && (r = v.from(r, c)), v.isBuffer(r))
      return r.length === 0 ? -1 : St(a, r, e, c, x);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? x ? Uint8Array.prototype.indexOf.call(a, r, e) : Uint8Array.prototype.lastIndexOf.call(a, r, e) : St(a, [r], e, c, x);
    throw new TypeError("val must be string, number or Buffer");
  }
  function St(a, r, e, c, x) {
    let E = 1, A = a.length, D = r.length;
    if (c !== void 0 && (c = String(c).toLowerCase(), c === "ucs2" || c === "ucs-2" || c === "utf16le" || c === "utf-16le")) {
      if (a.length < 2 || r.length < 2)
        return -1;
      E = 2, A /= 2, D /= 2, e /= 2;
    }
    function C(W, T) {
      return E === 1 ? W[T] : W.readUInt16BE(T * E);
    }
    let R;
    if (x) {
      let W = -1;
      for (R = e; R < A; R++)
        if (C(a, R) === C(r, W === -1 ? 0 : R - W)) {
          if (W === -1 && (W = R), R - W + 1 === D)
            return W * E;
        } else
          W !== -1 && (R -= R - W), W = -1;
    } else
      for (e + D > A && (e = A - D), R = e; R >= 0; R--) {
        let W = !0;
        for (let T = 0; T < D; T++)
          if (C(a, R + T) !== C(r, T)) {
            W = !1;
            break;
          }
        if (W)
          return R;
      }
    return -1;
  }
  v.prototype.includes = function(r, e, c) {
    return this.indexOf(r, e, c) !== -1;
  }, v.prototype.indexOf = function(r, e, c) {
    return $(this, r, e, c, !0);
  }, v.prototype.lastIndexOf = function(r, e, c) {
    return $(this, r, e, c, !1);
  };
  function qt(a, r, e, c) {
    e = Number(e) || 0;
    const x = a.length - e;
    c ? (c = Number(c), c > x && (c = x)) : c = x;
    const E = r.length;
    c > E / 2 && (c = E / 2);
    let A;
    for (A = 0; A < c; ++A) {
      const D = parseInt(r.substr(A * 2, 2), 16);
      if (V(D))
        return A;
      a[e + A] = D;
    }
    return A;
  }
  function wr(a, r, e, c) {
    return G(Y(r, a.length - e), a, e, c);
  }
  function ar(a, r, e, c) {
    return G(et(r), a, e, c);
  }
  function K(a, r, e, c) {
    return G(X(r), a, e, c);
  }
  function Gt(a, r, e, c) {
    return G(gr(r, a.length - e), a, e, c);
  }
  v.prototype.write = function(r, e, c, x) {
    if (e === void 0)
      x = "utf8", c = this.length, e = 0;
    else if (c === void 0 && typeof e == "string")
      x = e, c = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(c) ? (c = c >>> 0, x === void 0 && (x = "utf8")) : (x = c, c = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const E = this.length - e;
    if ((c === void 0 || c > E) && (c = E), r.length > 0 && (c < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    x || (x = "utf8");
    let A = !1;
    for (; ; )
      switch (x) {
        case "hex":
          return qt(this, r, e, c);
        case "utf8":
        case "utf-8":
          return wr(this, r, e, c);
        case "ascii":
        case "latin1":
        case "binary":
          return ar(this, r, e, c);
        case "base64":
          return K(this, r, e, c);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Gt(this, r, e, c);
        default:
          if (A)
            throw new TypeError("Unknown encoding: " + x);
          x = ("" + x).toLowerCase(), A = !0;
      }
  }, v.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function g(a, r, e) {
    return r === 0 && e === a.length ? i.fromByteArray(a) : i.fromByteArray(a.slice(r, e));
  }
  function t(a, r, e) {
    e = Math.min(a.length, e);
    const c = [];
    let x = r;
    for (; x < e; ) {
      const E = a[x];
      let A = null, D = E > 239 ? 4 : E > 223 ? 3 : E > 191 ? 2 : 1;
      if (x + D <= e) {
        let C, R, W, T;
        switch (D) {
          case 1:
            E < 128 && (A = E);
            break;
          case 2:
            C = a[x + 1], (C & 192) === 128 && (T = (E & 31) << 6 | C & 63, T > 127 && (A = T));
            break;
          case 3:
            C = a[x + 1], R = a[x + 2], (C & 192) === 128 && (R & 192) === 128 && (T = (E & 15) << 12 | (C & 63) << 6 | R & 63, T > 2047 && (T < 55296 || T > 57343) && (A = T));
            break;
          case 4:
            C = a[x + 1], R = a[x + 2], W = a[x + 3], (C & 192) === 128 && (R & 192) === 128 && (W & 192) === 128 && (T = (E & 15) << 18 | (C & 63) << 12 | (R & 63) << 6 | W & 63, T > 65535 && T < 1114112 && (A = T));
        }
      }
      A === null ? (A = 65533, D = 1) : A > 65535 && (A -= 65536, c.push(A >>> 10 & 1023 | 55296), A = 56320 | A & 1023), c.push(A), x += D;
    }
    return l(c);
  }
  const u = 4096;
  function l(a) {
    const r = a.length;
    if (r <= u)
      return String.fromCharCode.apply(String, a);
    let e = "", c = 0;
    for (; c < r; )
      e += String.fromCharCode.apply(
        String,
        a.slice(c, c += u)
      );
    return e;
  }
  function m(a, r, e) {
    let c = "";
    e = Math.min(a.length, e);
    for (let x = r; x < e; ++x)
      c += String.fromCharCode(a[x] & 127);
    return c;
  }
  function w(a, r, e) {
    let c = "";
    e = Math.min(a.length, e);
    for (let x = r; x < e; ++x)
      c += String.fromCharCode(a[x]);
    return c;
  }
  function b(a, r, e) {
    const c = a.length;
    (!r || r < 0) && (r = 0), (!e || e < 0 || e > c) && (e = c);
    let x = "";
    for (let E = r; E < e; ++E)
      x += it[a[E]];
    return x;
  }
  function _(a, r, e) {
    const c = a.slice(r, e);
    let x = "";
    for (let E = 0; E < c.length - 1; E += 2)
      x += String.fromCharCode(c[E] + c[E + 1] * 256);
    return x;
  }
  v.prototype.slice = function(r, e) {
    const c = this.length;
    r = ~~r, e = e === void 0 ? c : ~~e, r < 0 ? (r += c, r < 0 && (r = 0)) : r > c && (r = c), e < 0 ? (e += c, e < 0 && (e = 0)) : e > c && (e = c), e < r && (e = r);
    const x = this.subarray(r, e);
    return Object.setPrototypeOf(x, v.prototype), x;
  };
  function d(a, r, e) {
    if (a % 1 !== 0 || a < 0)
      throw new RangeError("offset is not uint");
    if (a + r > e)
      throw new RangeError("Trying to access beyond buffer length");
  }
  v.prototype.readUintLE = v.prototype.readUIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let x = this[r], E = 1, A = 0;
    for (; ++A < e && (E *= 256); )
      x += this[r + A] * E;
    return x;
  }, v.prototype.readUintBE = v.prototype.readUIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let x = this[r + --e], E = 1;
    for (; e > 0 && (E *= 256); )
      x += this[r + --e] * E;
    return x;
  }, v.prototype.readUint8 = v.prototype.readUInt8 = function(r, e) {
    return r = r >>> 0, e || d(r, 1, this.length), this[r];
  }, v.prototype.readUint16LE = v.prototype.readUInt16LE = function(r, e) {
    return r = r >>> 0, e || d(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, v.prototype.readUint16BE = v.prototype.readUInt16BE = function(r, e) {
    return r = r >>> 0, e || d(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, v.prototype.readUint32LE = v.prototype.readUInt32LE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, v.prototype.readUint32BE = v.prototype.readUInt32BE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, v.prototype.readBigUInt64LE = Ot(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && q(r, this.length - 8);
    const x = e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, E = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + c * 2 ** 24;
    return BigInt(x) + (BigInt(E) << BigInt(32));
  }), v.prototype.readBigUInt64BE = Ot(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && q(r, this.length - 8);
    const x = e * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], E = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c;
    return (BigInt(x) << BigInt(32)) + BigInt(E);
  }), v.prototype.readIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let x = this[r], E = 1, A = 0;
    for (; ++A < e && (E *= 256); )
      x += this[r + A] * E;
    return E *= 128, x >= E && (x -= Math.pow(2, 8 * e)), x;
  }, v.prototype.readIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let x = e, E = 1, A = this[r + --x];
    for (; x > 0 && (E *= 256); )
      A += this[r + --x] * E;
    return E *= 128, A >= E && (A -= Math.pow(2, 8 * e)), A;
  }, v.prototype.readInt8 = function(r, e) {
    return r = r >>> 0, e || d(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, v.prototype.readInt16LE = function(r, e) {
    r = r >>> 0, e || d(r, 2, this.length);
    const c = this[r] | this[r + 1] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, v.prototype.readInt16BE = function(r, e) {
    r = r >>> 0, e || d(r, 2, this.length);
    const c = this[r + 1] | this[r] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, v.prototype.readInt32LE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, v.prototype.readInt32BE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, v.prototype.readBigInt64LE = Ot(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && q(r, this.length - 8);
    const x = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (c << 24);
    return (BigInt(x) << BigInt(32)) + BigInt(e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), v.prototype.readBigInt64BE = Ot(function(r) {
    r = r >>> 0, Wt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && q(r, this.length - 8);
    const x = (e << 24) + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(x) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c);
  }), v.prototype.readFloatLE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), s.read(this, r, !0, 23, 4);
  }, v.prototype.readFloatBE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), s.read(this, r, !1, 23, 4);
  }, v.prototype.readDoubleLE = function(r, e) {
    return r = r >>> 0, e || d(r, 8, this.length), s.read(this, r, !0, 52, 8);
  }, v.prototype.readDoubleBE = function(r, e) {
    return r = r >>> 0, e || d(r, 8, this.length), s.read(this, r, !1, 52, 8);
  };
  function o(a, r, e, c, x, E) {
    if (!v.isBuffer(a))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > x || r < E)
      throw new RangeError('"value" argument is out of bounds');
    if (e + c > a.length)
      throw new RangeError("Index out of range");
  }
  v.prototype.writeUintLE = v.prototype.writeUIntLE = function(r, e, c, x) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !x) {
      const D = Math.pow(2, 8 * c) - 1;
      o(this, r, e, c, D, 0);
    }
    let E = 1, A = 0;
    for (this[e] = r & 255; ++A < c && (E *= 256); )
      this[e + A] = r / E & 255;
    return e + c;
  }, v.prototype.writeUintBE = v.prototype.writeUIntBE = function(r, e, c, x) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !x) {
      const D = Math.pow(2, 8 * c) - 1;
      o(this, r, e, c, D, 0);
    }
    let E = c - 1, A = 1;
    for (this[e + E] = r & 255; --E >= 0 && (A *= 256); )
      this[e + E] = r / A & 255;
    return e + c;
  }, v.prototype.writeUint8 = v.prototype.writeUInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
  }, v.prototype.writeUint16LE = v.prototype.writeUInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, v.prototype.writeUint16BE = v.prototype.writeUInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, v.prototype.writeUint32LE = v.prototype.writeUInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
  }, v.prototype.writeUint32BE = v.prototype.writeUInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  };
  function y(a, r, e, c, x) {
    J(r, c, x, a, e, 7);
    let E = Number(r & BigInt(4294967295));
    a[e++] = E, E = E >> 8, a[e++] = E, E = E >> 8, a[e++] = E, E = E >> 8, a[e++] = E;
    let A = Number(r >> BigInt(32) & BigInt(4294967295));
    return a[e++] = A, A = A >> 8, a[e++] = A, A = A >> 8, a[e++] = A, A = A >> 8, a[e++] = A, e;
  }
  function L(a, r, e, c, x) {
    J(r, c, x, a, e, 7);
    let E = Number(r & BigInt(4294967295));
    a[e + 7] = E, E = E >> 8, a[e + 6] = E, E = E >> 8, a[e + 5] = E, E = E >> 8, a[e + 4] = E;
    let A = Number(r >> BigInt(32) & BigInt(4294967295));
    return a[e + 3] = A, A = A >> 8, a[e + 2] = A, A = A >> 8, a[e + 1] = A, A = A >> 8, a[e] = A, e + 8;
  }
  v.prototype.writeBigUInt64LE = Ot(function(r, e = 0) {
    return y(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), v.prototype.writeBigUInt64BE = Ot(function(r, e = 0) {
    return L(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), v.prototype.writeIntLE = function(r, e, c, x) {
    if (r = +r, e = e >>> 0, !x) {
      const C = Math.pow(2, 8 * c - 1);
      o(this, r, e, c, C - 1, -C);
    }
    let E = 0, A = 1, D = 0;
    for (this[e] = r & 255; ++E < c && (A *= 256); )
      r < 0 && D === 0 && this[e + E - 1] !== 0 && (D = 1), this[e + E] = (r / A >> 0) - D & 255;
    return e + c;
  }, v.prototype.writeIntBE = function(r, e, c, x) {
    if (r = +r, e = e >>> 0, !x) {
      const C = Math.pow(2, 8 * c - 1);
      o(this, r, e, c, C - 1, -C);
    }
    let E = c - 1, A = 1, D = 0;
    for (this[e + E] = r & 255; --E >= 0 && (A *= 256); )
      r < 0 && D === 0 && this[e + E + 1] !== 0 && (D = 1), this[e + E] = (r / A >> 0) - D & 255;
    return e + c;
  }, v.prototype.writeInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
  }, v.prototype.writeInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, v.prototype.writeInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, v.prototype.writeInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
  }, v.prototype.writeInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || o(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  }, v.prototype.writeBigInt64LE = Ot(function(r, e = 0) {
    return y(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), v.prototype.writeBigInt64BE = Ot(function(r, e = 0) {
    return L(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function U(a, r, e, c, x, E) {
    if (e + c > a.length)
      throw new RangeError("Index out of range");
    if (e < 0)
      throw new RangeError("Index out of range");
  }
  function N(a, r, e, c, x) {
    return r = +r, e = e >>> 0, x || U(a, r, e, 4), s.write(a, r, e, c, 23, 4), e + 4;
  }
  v.prototype.writeFloatLE = function(r, e, c) {
    return N(this, r, e, !0, c);
  }, v.prototype.writeFloatBE = function(r, e, c) {
    return N(this, r, e, !1, c);
  };
  function _t(a, r, e, c, x) {
    return r = +r, e = e >>> 0, x || U(a, r, e, 8), s.write(a, r, e, c, 52, 8), e + 8;
  }
  v.prototype.writeDoubleLE = function(r, e, c) {
    return _t(this, r, e, !0, c);
  }, v.prototype.writeDoubleBE = function(r, e, c) {
    return _t(this, r, e, !1, c);
  }, v.prototype.copy = function(r, e, c, x) {
    if (!v.isBuffer(r))
      throw new TypeError("argument should be a Buffer");
    if (c || (c = 0), !x && x !== 0 && (x = this.length), e >= r.length && (e = r.length), e || (e = 0), x > 0 && x < c && (x = c), x === c || r.length === 0 || this.length === 0)
      return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (c < 0 || c >= this.length)
      throw new RangeError("Index out of range");
    if (x < 0)
      throw new RangeError("sourceEnd out of bounds");
    x > this.length && (x = this.length), r.length - e < x - c && (x = r.length - e + c);
    const E = x - c;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, c, x) : Uint8Array.prototype.set.call(
      r,
      this.subarray(c, x),
      e
    ), E;
  }, v.prototype.fill = function(r, e, c, x) {
    if (typeof r == "string") {
      if (typeof e == "string" ? (x = e, e = 0, c = this.length) : typeof c == "string" && (x = c, c = this.length), x !== void 0 && typeof x != "string")
        throw new TypeError("encoding must be a string");
      if (typeof x == "string" && !v.isEncoding(x))
        throw new TypeError("Unknown encoding: " + x);
      if (r.length === 1) {
        const A = r.charCodeAt(0);
        (x === "utf8" && A < 128 || x === "latin1") && (r = A);
      }
    } else
      typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (e < 0 || this.length < e || this.length < c)
      throw new RangeError("Out of range index");
    if (c <= e)
      return this;
    e = e >>> 0, c = c === void 0 ? this.length : c >>> 0, r || (r = 0);
    let E;
    if (typeof r == "number")
      for (E = e; E < c; ++E)
        this[E] = r;
    else {
      const A = v.isBuffer(r) ? r : v.from(r, x), D = A.length;
      if (D === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (E = 0; E < c - e; ++E)
        this[E + e] = A[E % D];
    }
    return this;
  };
  const P = {};
  function Z(a, r, e) {
    P[a] = class extends e {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: r.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${a}]`, this.stack, delete this.name;
      }
      get code() {
        return a;
      }
      set code(x) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: x,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${a}]: ${this.message}`;
      }
    };
  }
  Z(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(a) {
      return a ? `${a} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Z(
    "ERR_INVALID_ARG_TYPE",
    function(a, r) {
      return `The "${a}" argument must be of type number. Received type ${typeof r}`;
    },
    TypeError
  ), Z(
    "ERR_OUT_OF_RANGE",
    function(a, r, e) {
      let c = `The value of "${a}" is out of range.`, x = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? x = lr(String(e)) : typeof e == "bigint" && (x = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (x = lr(x)), x += "n"), c += ` It must be ${r}. Received ${x}`, c;
    },
    RangeError
  );
  function lr(a) {
    let r = "", e = a.length;
    const c = a[0] === "-" ? 1 : 0;
    for (; e >= c + 4; e -= 3)
      r = `_${a.slice(e - 3, e)}${r}`;
    return `${a.slice(0, e)}${r}`;
  }
  function tt(a, r, e) {
    Wt(r, "offset"), (a[r] === void 0 || a[r + e] === void 0) && q(r, a.length - (e + 1));
  }
  function J(a, r, e, c, x, E) {
    if (a > e || a < r) {
      const A = typeof r == "bigint" ? "n" : "";
      let D;
      throw E > 3 ? r === 0 || r === BigInt(0) ? D = `>= 0${A} and < 2${A} ** ${(E + 1) * 8}${A}` : D = `>= -(2${A} ** ${(E + 1) * 8 - 1}${A}) and < 2 ** ${(E + 1) * 8 - 1}${A}` : D = `>= ${r}${A} and <= ${e}${A}`, new P.ERR_OUT_OF_RANGE("value", D, a);
    }
    tt(c, x, E);
  }
  function Wt(a, r) {
    if (typeof a != "number")
      throw new P.ERR_INVALID_ARG_TYPE(r, "number", a);
  }
  function q(a, r, e) {
    throw Math.floor(a) !== a ? (Wt(a, e), new P.ERR_OUT_OF_RANGE(e || "offset", "an integer", a)) : r < 0 ? new P.ERR_BUFFER_OUT_OF_BOUNDS() : new P.ERR_OUT_OF_RANGE(
      e || "offset",
      `>= ${e ? 1 : 0} and <= ${r}`,
      a
    );
  }
  const rt = /[^+/0-9A-Za-z-_]/g;
  function vr(a) {
    if (a = a.split("=")[0], a = a.trim().replace(rt, ""), a.length < 2)
      return "";
    for (; a.length % 4 !== 0; )
      a = a + "=";
    return a;
  }
  function Y(a, r) {
    r = r || 1 / 0;
    let e;
    const c = a.length;
    let x = null;
    const E = [];
    for (let A = 0; A < c; ++A) {
      if (e = a.charCodeAt(A), e > 55295 && e < 57344) {
        if (!x) {
          if (e > 56319) {
            (r -= 3) > -1 && E.push(239, 191, 189);
            continue;
          } else if (A + 1 === c) {
            (r -= 3) > -1 && E.push(239, 191, 189);
            continue;
          }
          x = e;
          continue;
        }
        if (e < 56320) {
          (r -= 3) > -1 && E.push(239, 191, 189), x = e;
          continue;
        }
        e = (x - 55296 << 10 | e - 56320) + 65536;
      } else
        x && (r -= 3) > -1 && E.push(239, 191, 189);
      if (x = null, e < 128) {
        if ((r -= 1) < 0)
          break;
        E.push(e);
      } else if (e < 2048) {
        if ((r -= 2) < 0)
          break;
        E.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((r -= 3) < 0)
          break;
        E.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((r -= 4) < 0)
          break;
        E.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return E;
  }
  function et(a) {
    const r = [];
    for (let e = 0; e < a.length; ++e)
      r.push(a.charCodeAt(e) & 255);
    return r;
  }
  function gr(a, r) {
    let e, c, x;
    const E = [];
    for (let A = 0; A < a.length && !((r -= 2) < 0); ++A)
      e = a.charCodeAt(A), c = e >> 8, x = e % 256, E.push(x), E.push(c);
    return E;
  }
  function X(a) {
    return i.toByteArray(vr(a));
  }
  function G(a, r, e, c) {
    let x;
    for (x = 0; x < c && !(x + e >= r.length || x >= a.length); ++x)
      r[x + e] = a[x];
    return x;
  }
  function Rt(a, r) {
    return a instanceof r || a != null && a.constructor != null && a.constructor.name != null && a.constructor.name === r.name;
  }
  function V(a) {
    return a !== a;
  }
  const it = function() {
    const a = "0123456789abcdef", r = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const c = e * 16;
      for (let x = 0; x < 16; ++x)
        r[c + x] = a[e] + a[x];
    }
    return r;
  }();
  function Ot(a) {
    return typeof BigInt > "u" ? nt : a;
  }
  function nt() {
    throw new Error("BigInt not supported");
  }
})(qr);
var ge = function(n, i) {
  return ge = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(s, h) {
    s.__proto__ = h;
  } || function(s, h) {
    for (var p in h)
      Object.prototype.hasOwnProperty.call(h, p) && (s[p] = h[p]);
  }, ge(n, i);
};
function Ie(n, i) {
  if (typeof i != "function" && i !== null)
    throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
  ge(n, i);
  function s() {
    this.constructor = n;
  }
  n.prototype = i === null ? Object.create(i) : (s.prototype = i.prototype, new s());
}
function Li(n, i, s, h) {
  function p(f) {
    return f instanceof s ? f : new s(function(M) {
      M(f);
    });
  }
  return new (s || (s = Promise))(function(f, M) {
    function v(F) {
      try {
        I(h.next(F));
      } catch (k) {
        M(k);
      }
    }
    function B(F) {
      try {
        I(h.throw(F));
      } catch (k) {
        M(k);
      }
    }
    function I(F) {
      F.done ? f(F.value) : p(F.value).then(v, B);
    }
    I((h = h.apply(n, i || [])).next());
  });
}
function ti(n, i) {
  var s = { label: 0, sent: function() {
    if (f[0] & 1)
      throw f[1];
    return f[1];
  }, trys: [], ops: [] }, h, p, f, M;
  return M = { next: v(0), throw: v(1), return: v(2) }, typeof Symbol == "function" && (M[Symbol.iterator] = function() {
    return this;
  }), M;
  function v(I) {
    return function(F) {
      return B([I, F]);
    };
  }
  function B(I) {
    if (h)
      throw new TypeError("Generator is already executing.");
    for (; s; )
      try {
        if (h = 1, p && (f = I[0] & 2 ? p.return : I[0] ? p.throw || ((f = p.return) && f.call(p), 0) : p.next) && !(f = f.call(p, I[1])).done)
          return f;
        switch (p = 0, f && (I = [I[0] & 2, f.value]), I[0]) {
          case 0:
          case 1:
            f = I;
            break;
          case 4:
            return s.label++, { value: I[1], done: !1 };
          case 5:
            s.label++, p = I[1], I = [0];
            continue;
          case 7:
            I = s.ops.pop(), s.trys.pop();
            continue;
          default:
            if (f = s.trys, !(f = f.length > 0 && f[f.length - 1]) && (I[0] === 6 || I[0] === 2)) {
              s = 0;
              continue;
            }
            if (I[0] === 3 && (!f || I[1] > f[0] && I[1] < f[3])) {
              s.label = I[1];
              break;
            }
            if (I[0] === 6 && s.label < f[1]) {
              s.label = f[1], f = I;
              break;
            }
            if (f && s.label < f[2]) {
              s.label = f[2], s.ops.push(I);
              break;
            }
            f[2] && s.ops.pop(), s.trys.pop();
            continue;
        }
        I = i.call(n, s);
      } catch (F) {
        I = [6, F], p = 0;
      } finally {
        h = f = 0;
      }
    if (I[0] & 5)
      throw I[1];
    return { value: I[0] ? I[1] : void 0, done: !0 };
  }
}
function cr(n) {
  var i = typeof Symbol == "function" && Symbol.iterator, s = i && n[i], h = 0;
  if (s)
    return s.call(n);
  if (n && typeof n.length == "number")
    return {
      next: function() {
        return n && h >= n.length && (n = void 0), { value: n && n[h++], done: !n };
      }
    };
  throw new TypeError(i ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function ur(n, i) {
  var s = typeof Symbol == "function" && n[Symbol.iterator];
  if (!s)
    return n;
  var h = s.call(n), p, f = [], M;
  try {
    for (; (i === void 0 || i-- > 0) && !(p = h.next()).done; )
      f.push(p.value);
  } catch (v) {
    M = { error: v };
  } finally {
    try {
      p && !p.done && (s = h.return) && s.call(h);
    } finally {
      if (M)
        throw M.error;
    }
  }
  return f;
}
function dr(n, i, s) {
  if (s || arguments.length === 2)
    for (var h = 0, p = i.length, f; h < p; h++)
      (f || !(h in i)) && (f || (f = Array.prototype.slice.call(i, 0, h)), f[h] = i[h]);
  return n.concat(f || Array.prototype.slice.call(i));
}
function sr(n) {
  return this instanceof sr ? (this.v = n, this) : new sr(n);
}
function Ti(n, i, s) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var h = s.apply(n, i || []), p, f = [];
  return p = {}, M("next"), M("throw"), M("return"), p[Symbol.asyncIterator] = function() {
    return this;
  }, p;
  function M(O) {
    h[O] && (p[O] = function(S) {
      return new Promise(function(z, j) {
        f.push([O, S, z, j]) > 1 || v(O, S);
      });
    });
  }
  function v(O, S) {
    try {
      B(h[O](S));
    } catch (z) {
      k(f[0][3], z);
    }
  }
  function B(O) {
    O.value instanceof sr ? Promise.resolve(O.value.v).then(I, F) : k(f[0][2], O);
  }
  function I(O) {
    v("next", O);
  }
  function F(O) {
    v("throw", O);
  }
  function k(O, S) {
    O(S), f.shift(), f.length && v(f[0][0], f[0][1]);
  }
}
function Ni(n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var i = n[Symbol.asyncIterator], s;
  return i ? i.call(n) : (n = typeof cr == "function" ? cr(n) : n[Symbol.iterator](), s = {}, h("next"), h("throw"), h("return"), s[Symbol.asyncIterator] = function() {
    return this;
  }, s);
  function h(f) {
    s[f] = n[f] && function(M) {
      return new Promise(function(v, B) {
        M = n[f](M), p(v, B, M.done, M.value);
      });
    };
  }
  function p(f, M, v, B) {
    Promise.resolve(B).then(function(I) {
      f({ value: I, done: v });
    }, M);
  }
}
function H(n) {
  return typeof n == "function";
}
function ri(n) {
  var i = function(h) {
    Error.call(h), h.stack = new Error().stack;
  }, s = n(i);
  return s.prototype = Object.create(Error.prototype), s.prototype.constructor = s, s;
}
var me = ri(function(n) {
  return function(s) {
    n(this), this.message = s ? s.length + ` errors occurred during unsubscription:
` + s.map(function(h, p) {
      return p + 1 + ") " + h.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = s;
  };
});
function qe(n, i) {
  if (n) {
    var s = n.indexOf(i);
    0 <= s && n.splice(s, 1);
  }
}
var Se = function() {
  function n(i) {
    this.initialTeardown = i, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return n.prototype.unsubscribe = function() {
    var i, s, h, p, f;
    if (!this.closed) {
      this.closed = !0;
      var M = this._parentage;
      if (M)
        if (this._parentage = null, Array.isArray(M))
          try {
            for (var v = cr(M), B = v.next(); !B.done; B = v.next()) {
              var I = B.value;
              I.remove(this);
            }
          } catch (j) {
            i = { error: j };
          } finally {
            try {
              B && !B.done && (s = v.return) && s.call(v);
            } finally {
              if (i)
                throw i.error;
            }
          }
        else
          M.remove(this);
      var F = this.initialTeardown;
      if (H(F))
        try {
          F();
        } catch (j) {
          f = j instanceof me ? j.errors : [j];
        }
      var k = this._finalizers;
      if (k) {
        this._finalizers = null;
        try {
          for (var O = cr(k), S = O.next(); !S.done; S = O.next()) {
            var z = S.value;
            try {
              Ge(z);
            } catch (j) {
              f = f != null ? f : [], j instanceof me ? f = dr(dr([], ur(f)), ur(j.errors)) : f.push(j);
            }
          }
        } catch (j) {
          h = { error: j };
        } finally {
          try {
            S && !S.done && (p = O.return) && p.call(O);
          } finally {
            if (h)
              throw h.error;
          }
        }
      }
      if (f)
        throw new me(f);
    }
  }, n.prototype.add = function(i) {
    var s;
    if (i && i !== this)
      if (this.closed)
        Ge(i);
      else {
        if (i instanceof n) {
          if (i.closed || i._hasParent(this))
            return;
          i._addParent(this);
        }
        (this._finalizers = (s = this._finalizers) !== null && s !== void 0 ? s : []).push(i);
      }
  }, n.prototype._hasParent = function(i) {
    var s = this._parentage;
    return s === i || Array.isArray(s) && s.includes(i);
  }, n.prototype._addParent = function(i) {
    var s = this._parentage;
    this._parentage = Array.isArray(s) ? (s.push(i), s) : s ? [s, i] : i;
  }, n.prototype._removeParent = function(i) {
    var s = this._parentage;
    s === i ? this._parentage = null : Array.isArray(s) && qe(s, i);
  }, n.prototype.remove = function(i) {
    var s = this._finalizers;
    s && qe(s, i), i instanceof n && i._removeParent(this);
  }, n.EMPTY = function() {
    var i = new n();
    return i.closed = !0, i;
  }(), n;
}();
Se.EMPTY;
function ei(n) {
  return n instanceof Se || n && "closed" in n && H(n.remove) && H(n.add) && H(n.unsubscribe);
}
function Ge(n) {
  H(n) ? n() : n.unsubscribe();
}
var ii = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, Me = {
  setTimeout: function(n, i) {
    for (var s = [], h = 2; h < arguments.length; h++)
      s[h - 2] = arguments[h];
    var p = Me.delegate;
    return p != null && p.setTimeout ? p.setTimeout.apply(p, dr([n, i], ur(s))) : setTimeout.apply(void 0, dr([n, i], ur(s)));
  },
  clearTimeout: function(n) {
    var i = Me.delegate;
    return ((i == null ? void 0 : i.clearTimeout) || clearTimeout)(n);
  },
  delegate: void 0
};
function ni(n) {
  Me.setTimeout(function() {
    throw n;
  });
}
function We() {
}
function Ri(n) {
  n();
}
var Fe = function(n) {
  Ie(i, n);
  function i(s) {
    var h = n.call(this) || this;
    return h.isStopped = !1, s ? (h.destination = s, ei(s) && s.add(h)) : h.destination = ki, h;
  }
  return i.create = function(s, h, p) {
    return new xe(s, h, p);
  }, i.prototype.next = function(s) {
    this.isStopped || this._next(s);
  }, i.prototype.error = function(s) {
    this.isStopped || (this.isStopped = !0, this._error(s));
  }, i.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, i.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, n.prototype.unsubscribe.call(this), this.destination = null);
  }, i.prototype._next = function(s) {
    this.destination.next(s);
  }, i.prototype._error = function(s) {
    try {
      this.destination.error(s);
    } finally {
      this.unsubscribe();
    }
  }, i.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, i;
}(Se), Ci = Function.prototype.bind;
function ye(n, i) {
  return Ci.call(n, i);
}
var Di = function() {
  function n(i) {
    this.partialObserver = i;
  }
  return n.prototype.next = function(i) {
    var s = this.partialObserver;
    if (s.next)
      try {
        s.next(i);
      } catch (h) {
        Mr(h);
      }
  }, n.prototype.error = function(i) {
    var s = this.partialObserver;
    if (s.error)
      try {
        s.error(i);
      } catch (h) {
        Mr(h);
      }
    else
      Mr(i);
  }, n.prototype.complete = function() {
    var i = this.partialObserver;
    if (i.complete)
      try {
        i.complete();
      } catch (s) {
        Mr(s);
      }
  }, n;
}(), xe = function(n) {
  Ie(i, n);
  function i(s, h, p) {
    var f = n.call(this) || this, M;
    if (H(s) || !s)
      M = {
        next: s != null ? s : void 0,
        error: h != null ? h : void 0,
        complete: p != null ? p : void 0
      };
    else {
      var v;
      f && ii.useDeprecatedNextContext ? (v = Object.create(s), v.unsubscribe = function() {
        return f.unsubscribe();
      }, M = {
        next: s.next && ye(s.next, v),
        error: s.error && ye(s.error, v),
        complete: s.complete && ye(s.complete, v)
      }) : M = s;
    }
    return f.destination = new Di(M), f;
  }
  return i;
}(Fe);
function Mr(n) {
  ni(n);
}
function Oi(n) {
  throw n;
}
var ki = {
  closed: !0,
  next: We,
  error: Oi,
  complete: We
}, Ue = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function ji(n) {
  return n;
}
function Pi(n) {
  return n.length === 0 ? ji : n.length === 1 ? n[0] : function(s) {
    return n.reduce(function(h, p) {
      return p(h);
    }, s);
  };
}
var Xt = function() {
  function n(i) {
    i && (this._subscribe = i);
  }
  return n.prototype.lift = function(i) {
    var s = new n();
    return s.source = this, s.operator = i, s;
  }, n.prototype.subscribe = function(i, s, h) {
    var p = this, f = $i(i) ? i : new xe(i, s, h);
    return Ri(function() {
      var M = p, v = M.operator, B = M.source;
      f.add(v ? v.call(f, B) : B ? p._subscribe(f) : p._trySubscribe(f));
    }), f;
  }, n.prototype._trySubscribe = function(i) {
    try {
      return this._subscribe(i);
    } catch (s) {
      i.error(s);
    }
  }, n.prototype.forEach = function(i, s) {
    var h = this;
    return s = Ye(s), new s(function(p, f) {
      var M = new xe({
        next: function(v) {
          try {
            i(v);
          } catch (B) {
            f(B), M.unsubscribe();
          }
        },
        error: f,
        complete: p
      });
      h.subscribe(M);
    });
  }, n.prototype._subscribe = function(i) {
    var s;
    return (s = this.source) === null || s === void 0 ? void 0 : s.subscribe(i);
  }, n.prototype[Ue] = function() {
    return this;
  }, n.prototype.pipe = function() {
    for (var i = [], s = 0; s < arguments.length; s++)
      i[s] = arguments[s];
    return Pi(i)(this);
  }, n.prototype.toPromise = function(i) {
    var s = this;
    return i = Ye(i), new i(function(h, p) {
      var f;
      s.subscribe(function(M) {
        return f = M;
      }, function(M) {
        return p(M);
      }, function() {
        return h(f);
      });
    });
  }, n.create = function(i) {
    return new n(i);
  }, n;
}();
function Ye(n) {
  var i;
  return (i = n != null ? n : ii.Promise) !== null && i !== void 0 ? i : Promise;
}
function zi(n) {
  return n && H(n.next) && H(n.error) && H(n.complete);
}
function $i(n) {
  return n && n instanceof Fe || zi(n) && ei(n);
}
function Zi(n) {
  return H(n == null ? void 0 : n.lift);
}
function Wr(n) {
  return function(i) {
    if (Zi(i))
      return i.lift(function(s) {
        try {
          return n(s, this);
        } catch (h) {
          this.error(h);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function pr(n, i, s, h, p) {
  return new qi(n, i, s, h, p);
}
var qi = function(n) {
  Ie(i, n);
  function i(s, h, p, f, M, v) {
    var B = n.call(this, s) || this;
    return B.onFinalize = M, B.shouldUnsubscribe = v, B._next = h ? function(I) {
      try {
        h(I);
      } catch (F) {
        s.error(F);
      }
    } : n.prototype._next, B._error = f ? function(I) {
      try {
        f(I);
      } catch (F) {
        s.error(F);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._error, B._complete = p ? function() {
      try {
        p();
      } catch (I) {
        s.error(I);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._complete, B;
  }
  return i.prototype.unsubscribe = function() {
    var s;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var h = this.closed;
      n.prototype.unsubscribe.call(this), !h && ((s = this.onFinalize) === null || s === void 0 || s.call(this));
    }
  }, i;
}(Fe), Gi = new Xt(function(n) {
  return n.complete();
}), oi = function(n) {
  return n && typeof n.length == "number" && typeof n != "function";
};
function Wi(n) {
  return H(n == null ? void 0 : n.then);
}
function Yi(n) {
  return H(n[Ue]);
}
function Vi(n) {
  return Symbol.asyncIterator && H(n == null ? void 0 : n[Symbol.asyncIterator]);
}
function Hi(n) {
  return new TypeError("You provided " + (n !== null && typeof n == "object" ? "an invalid object" : "'" + n + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Qi() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Ki = Qi();
function Ji(n) {
  return H(n == null ? void 0 : n[Ki]);
}
function Xi(n) {
  return Ti(this, arguments, function() {
    var s, h, p, f;
    return ti(this, function(M) {
      switch (M.label) {
        case 0:
          s = n.getReader(), M.label = 1;
        case 1:
          M.trys.push([1, , 9, 10]), M.label = 2;
        case 2:
          return [4, sr(s.read())];
        case 3:
          return h = M.sent(), p = h.value, f = h.done, f ? [4, sr(void 0)] : [3, 5];
        case 4:
          return [2, M.sent()];
        case 5:
          return [4, sr(p)];
        case 6:
          return [4, M.sent()];
        case 7:
          return M.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return s.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function tn(n) {
  return H(n == null ? void 0 : n.getReader);
}
function Le(n) {
  if (n instanceof Xt)
    return n;
  if (n != null) {
    if (Yi(n))
      return rn(n);
    if (oi(n))
      return en(n);
    if (Wi(n))
      return nn(n);
    if (Vi(n))
      return si(n);
    if (Ji(n))
      return on(n);
    if (tn(n))
      return sn(n);
  }
  throw Hi(n);
}
function rn(n) {
  return new Xt(function(i) {
    var s = n[Ue]();
    if (H(s.subscribe))
      return s.subscribe(i);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function en(n) {
  return new Xt(function(i) {
    for (var s = 0; s < n.length && !i.closed; s++)
      i.next(n[s]);
    i.complete();
  });
}
function nn(n) {
  return new Xt(function(i) {
    n.then(function(s) {
      i.closed || (i.next(s), i.complete());
    }, function(s) {
      return i.error(s);
    }).then(null, ni);
  });
}
function on(n) {
  return new Xt(function(i) {
    var s, h;
    try {
      for (var p = cr(n), f = p.next(); !f.done; f = p.next()) {
        var M = f.value;
        if (i.next(M), i.closed)
          return;
      }
    } catch (v) {
      s = { error: v };
    } finally {
      try {
        f && !f.done && (h = p.return) && h.call(p);
      } finally {
        if (s)
          throw s.error;
      }
    }
    i.complete();
  });
}
function si(n) {
  return new Xt(function(i) {
    fn(n, i).catch(function(s) {
      return i.error(s);
    });
  });
}
function sn(n) {
  return si(Xi(n));
}
function fn(n, i) {
  var s, h, p, f;
  return Li(this, void 0, void 0, function() {
    var M, v;
    return ti(this, function(B) {
      switch (B.label) {
        case 0:
          B.trys.push([0, 5, 6, 11]), s = Ni(n), B.label = 1;
        case 1:
          return [4, s.next()];
        case 2:
          if (h = B.sent(), !!h.done)
            return [3, 4];
          if (M = h.value, i.next(M), i.closed)
            return [2];
          B.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return v = B.sent(), p = { error: v }, [3, 11];
        case 6:
          return B.trys.push([6, , 9, 10]), h && !h.done && (f = s.return) ? [4, f.call(s)] : [3, 8];
        case 7:
          B.sent(), B.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (p)
            throw p.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return i.complete(), [2];
      }
    });
  });
}
function un(n, i, s, h, p) {
  h === void 0 && (h = 0), p === void 0 && (p = !1);
  var f = i.schedule(function() {
    s(), p ? n.add(this.schedule(null, h)) : this.unsubscribe();
  }, h);
  if (n.add(f), !p)
    return f;
}
var hn = ri(function(n) {
  return function() {
    n(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function an(n, i) {
  var s = typeof i == "object";
  return new Promise(function(h, p) {
    var f = !1, M;
    n.subscribe({
      next: function(v) {
        M = v, f = !0;
      },
      error: p,
      complete: function() {
        f ? h(M) : s ? h(i.defaultValue) : p(new hn());
      }
    });
  });
}
function Ur(n, i) {
  return Wr(function(s, h) {
    var p = 0;
    s.subscribe(pr(h, function(f) {
      h.next(n.call(i, f, p++));
    }));
  });
}
var ln = Array.isArray;
function cn(n, i) {
  return ln(i) ? n.apply(void 0, dr([], ur(i))) : n(i);
}
function dn(n) {
  return Ur(function(i) {
    return cn(n, i);
  });
}
function pn(n, i, s, h, p, f, M, v) {
  var B = [], I = 0, F = 0, k = !1, O = function() {
    k && !B.length && !I && i.complete();
  }, S = function(j) {
    return I < h ? z(j) : B.push(j);
  }, z = function(j) {
    f && i.next(j), I++;
    var Bt = !1;
    Le(s(j, F++)).subscribe(pr(i, function(Q) {
      p == null || p(Q), f ? S(Q) : i.next(Q);
    }, function() {
      Bt = !0;
    }, void 0, function() {
      if (Bt)
        try {
          I--;
          for (var Q = function() {
            var ot = B.shift();
            M ? un(i, M, function() {
              return z(ot);
            }) : z(ot);
          }; B.length && I < h; )
            Q();
          O();
        } catch (ot) {
          i.error(ot);
        }
    }));
  };
  return n.subscribe(pr(i, S, function() {
    k = !0, O();
  })), function() {
    v == null || v();
  };
}
function fi(n, i, s) {
  return s === void 0 && (s = 1 / 0), H(i) ? fi(function(h, p) {
    return Ur(function(f, M) {
      return i(h, f, p, M);
    })(Le(n(h, p)));
  }, s) : (typeof i == "number" && (s = i), Wr(function(h, p) {
    return pn(h, p, n, s);
  }));
}
var mn = ["addListener", "removeListener"], yn = ["addEventListener", "removeEventListener"], wn = ["on", "off"];
function be(n, i, s, h) {
  if (H(s) && (h = s, s = void 0), h)
    return be(n, i, s).pipe(dn(h));
  var p = ur(Mn(n) ? yn.map(function(v) {
    return function(B) {
      return n[v](i, B, s);
    };
  }) : vn(n) ? mn.map(Ve(n, i)) : gn(n) ? wn.map(Ve(n, i)) : [], 2), f = p[0], M = p[1];
  if (!f && oi(n))
    return fi(function(v) {
      return be(v, i, s);
    })(Le(n));
  if (!f)
    throw new TypeError("Invalid event target");
  return new Xt(function(v) {
    var B = function() {
      for (var I = [], F = 0; F < arguments.length; F++)
        I[F] = arguments[F];
      return v.next(1 < I.length ? I : I[0]);
    };
    return f(B), function() {
      return M(B);
    };
  });
}
function Ve(n, i) {
  return function(s) {
    return function(h) {
      return n[s](i, h);
    };
  };
}
function vn(n) {
  return H(n.addListener) && H(n.removeListener);
}
function gn(n) {
  return H(n.on) && H(n.off);
}
function Mn(n) {
  return H(n.addEventListener) && H(n.removeEventListener);
}
function He(n, i) {
  return Wr(function(s, h) {
    var p = 0;
    s.subscribe(pr(h, function(f) {
      return n.call(i, f, p++) && h.next(f);
    }));
  });
}
function xn(n) {
  return n <= 0 ? function() {
    return Gi;
  } : Wr(function(i, s) {
    var h = 0;
    i.subscribe(pr(s, function(p) {
      ++h <= n && (s.next(p), n <= h && s.complete());
    }));
  });
}
class ui {
  constructor(i, s) {
    kt(this, "msgObservable");
    kt(this, "source");
    kt(this, "target");
    if (i === s)
      throw new Error(
        "[WindowMessageStream] source and target must be different"
      );
    this.source = i, this.target = s, this.msgObservable = be(
      window,
      "message"
    ).pipe(
      He(
        (h) => {
          var p;
          return h.source === window && ((p = h.data) == null ? void 0 : p.target) === this.source;
        }
      ),
      Ur((h) => h.data)
    );
  }
  async post(i) {
    const s = {
      target: this.target,
      payload: i
    };
    return window.postMessage(s), await an(
      this.msgObservable.pipe(
        He((h) => h.payload.id === i.id),
        Ur((h) => h.payload),
        xn(1)
      )
    );
  }
  subscribe(i) {
    this.msgObservable.subscribe(i);
  }
}
let xr;
const bn = new Uint8Array(16);
function En() {
  if (!xr && (xr = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !xr))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return xr(bn);
}
const Ft = [];
for (let n = 0; n < 256; ++n)
  Ft.push((n + 256).toString(16).slice(1));
function _n(n, i = 0) {
  return (Ft[n[i + 0]] + Ft[n[i + 1]] + Ft[n[i + 2]] + Ft[n[i + 3]] + "-" + Ft[n[i + 4]] + Ft[n[i + 5]] + "-" + Ft[n[i + 6]] + Ft[n[i + 7]] + "-" + Ft[n[i + 8]] + Ft[n[i + 9]] + "-" + Ft[n[i + 10]] + Ft[n[i + 11]] + Ft[n[i + 12]] + Ft[n[i + 13]] + Ft[n[i + 14]] + Ft[n[i + 15]]).toLowerCase();
}
const An = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Qe = {
  randomUUID: An
};
function Bn(n, i, s) {
  if (Qe.randomUUID && !i && !n)
    return Qe.randomUUID();
  n = n || {};
  const h = n.random || (n.rng || En)();
  if (h[6] = h[6] & 15 | 64, h[8] = h[8] & 63 | 128, i) {
    s = s || 0;
    for (let p = 0; p < 16; ++p)
      i[s + p] = h[p];
    return i;
  }
  return _n(h);
}
var mr = /* @__PURE__ */ ((n) => (n.DAPP = "DAPP", n.SUIET_CONTENT = "SUIET_CONTENT", n))(mr || {});
function Qt(n, i, s) {
  return {
    id: Bn(),
    funcName: n,
    payload: i,
    options: s
  };
}
function Ke(n) {
  return `[SUIET_WALLET]: ${n}`;
}
var hi = /* @__PURE__ */ ((n) => (n.MOVE_CALL = "moveCall", n.SERIALIZED_MOVE_CALL = "SERIALIZED_MOVE_CALL", n))(hi || {}), Ut = {}, ai = { exports: {} };
const In = {}, Sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: In
}, Symbol.toStringTag, { value: "Module" })), Fn = /* @__PURE__ */ Je(Sn);
(function(n) {
  (function(i, s) {
    function h(g, t) {
      if (!g)
        throw new Error(t || "Assertion failed");
    }
    function p(g, t) {
      g.super_ = t;
      var u = function() {
      };
      u.prototype = t.prototype, g.prototype = new u(), g.prototype.constructor = g;
    }
    function f(g, t, u) {
      if (f.isBN(g))
        return g;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, g !== null && ((t === "le" || t === "be") && (u = t, t = 10), this._init(g || 0, t || 10, u || "be"));
    }
    typeof i == "object" ? i.exports = f : s.BN = f, f.BN = f, f.wordSize = 26;
    var M;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? M = window.Buffer : M = Fn.Buffer;
    } catch {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, u) {
      return t.cmp(u) > 0 ? t : u;
    }, f.min = function(t, u) {
      return t.cmp(u) < 0 ? t : u;
    }, f.prototype._init = function(t, u, l) {
      if (typeof t == "number")
        return this._initNumber(t, u, l);
      if (typeof t == "object")
        return this._initArray(t, u, l);
      u === "hex" && (u = 16), h(u === (u | 0) && u >= 2 && u <= 36), t = t.toString().replace(/\s+/g, "");
      var m = 0;
      t[0] === "-" && (m++, this.negative = 1), m < t.length && (u === 16 ? this._parseHex(t, m, l) : (this._parseBase(t, u, m), l === "le" && this._initArray(this.toArray(), u, l)));
    }, f.prototype._initNumber = function(t, u, l) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (h(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), l === "le" && this._initArray(this.toArray(), u, l);
    }, f.prototype._initArray = function(t, u, l) {
      if (h(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var m = 0; m < this.length; m++)
        this.words[m] = 0;
      var w, b, _ = 0;
      if (l === "be")
        for (m = t.length - 1, w = 0; m >= 0; m -= 3)
          b = t[m] | t[m - 1] << 8 | t[m - 2] << 16, this.words[w] |= b << _ & 67108863, this.words[w + 1] = b >>> 26 - _ & 67108863, _ += 24, _ >= 26 && (_ -= 26, w++);
      else if (l === "le")
        for (m = 0, w = 0; m < t.length; m += 3)
          b = t[m] | t[m + 1] << 8 | t[m + 2] << 16, this.words[w] |= b << _ & 67108863, this.words[w + 1] = b >>> 26 - _ & 67108863, _ += 24, _ >= 26 && (_ -= 26, w++);
      return this._strip();
    };
    function v(g, t) {
      var u = g.charCodeAt(t);
      if (u >= 48 && u <= 57)
        return u - 48;
      if (u >= 65 && u <= 70)
        return u - 55;
      if (u >= 97 && u <= 102)
        return u - 87;
      h(!1, "Invalid character in " + g);
    }
    function B(g, t, u) {
      var l = v(g, u);
      return u - 1 >= t && (l |= v(g, u - 1) << 4), l;
    }
    f.prototype._parseHex = function(t, u, l) {
      this.length = Math.ceil((t.length - u) / 6), this.words = new Array(this.length);
      for (var m = 0; m < this.length; m++)
        this.words[m] = 0;
      var w = 0, b = 0, _;
      if (l === "be")
        for (m = t.length - 1; m >= u; m -= 2)
          _ = B(t, u, m) << w, this.words[b] |= _ & 67108863, w >= 18 ? (w -= 18, b += 1, this.words[b] |= _ >>> 26) : w += 8;
      else {
        var d = t.length - u;
        for (m = d % 2 === 0 ? u + 1 : u; m < t.length; m += 2)
          _ = B(t, u, m) << w, this.words[b] |= _ & 67108863, w >= 18 ? (w -= 18, b += 1, this.words[b] |= _ >>> 26) : w += 8;
      }
      this._strip();
    };
    function I(g, t, u, l) {
      for (var m = 0, w = 0, b = Math.min(g.length, u), _ = t; _ < b; _++) {
        var d = g.charCodeAt(_) - 48;
        m *= l, d >= 49 ? w = d - 49 + 10 : d >= 17 ? w = d - 17 + 10 : w = d, h(d >= 0 && w < l, "Invalid character"), m += w;
      }
      return m;
    }
    f.prototype._parseBase = function(t, u, l) {
      this.words = [0], this.length = 1;
      for (var m = 0, w = 1; w <= 67108863; w *= u)
        m++;
      m--, w = w / u | 0;
      for (var b = t.length - l, _ = b % m, d = Math.min(b, b - _) + l, o = 0, y = l; y < d; y += m)
        o = I(t, y, y + m, u), this.imuln(w), this.words[0] + o < 67108864 ? this.words[0] += o : this._iaddn(o);
      if (_ !== 0) {
        var L = 1;
        for (o = I(t, y, t.length, u), y = 0; y < _; y++)
          L *= u;
        this.imuln(L), this.words[0] + o < 67108864 ? this.words[0] += o : this._iaddn(o);
      }
      this._strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var u = 0; u < this.length; u++)
        t.words[u] = this.words[u];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    };
    function F(g, t) {
      g.words = t.words, g.length = t.length, g.negative = t.negative, g.red = t.red;
    }
    if (f.prototype._move = function(t) {
      F(t, this);
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype._strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, typeof Symbol < "u" && typeof Symbol.for == "function")
      try {
        f.prototype[Symbol.for("nodejs.util.inspect.custom")] = k;
      } catch {
        f.prototype.inspect = k;
      }
    else
      f.prototype.inspect = k;
    function k() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var O = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], S = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], z = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, u) {
      t = t || 10, u = u | 0 || 1;
      var l;
      if (t === 16 || t === "hex") {
        l = "";
        for (var m = 0, w = 0, b = 0; b < this.length; b++) {
          var _ = this.words[b], d = ((_ << m | w) & 16777215).toString(16);
          w = _ >>> 24 - m & 16777215, m += 2, m >= 26 && (m -= 26, b--), w !== 0 || b !== this.length - 1 ? l = O[6 - d.length] + d + l : l = d + l;
        }
        for (w !== 0 && (l = w.toString(16) + l); l.length % u !== 0; )
          l = "0" + l;
        return this.negative !== 0 && (l = "-" + l), l;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var o = S[t], y = z[t];
        l = "";
        var L = this.clone();
        for (L.negative = 0; !L.isZero(); ) {
          var U = L.modrn(y).toString(t);
          L = L.idivn(y), L.isZero() ? l = U + l : l = O[o - U.length] + U + l;
        }
        for (this.isZero() && (l = "0" + l); l.length % u !== 0; )
          l = "0" + l;
        return this.negative !== 0 && (l = "-" + l), l;
      }
      h(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && h(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, M && (f.prototype.toBuffer = function(t, u) {
      return this.toArrayLike(M, t, u);
    }), f.prototype.toArray = function(t, u) {
      return this.toArrayLike(Array, t, u);
    };
    var j = function(t, u) {
      return t.allocUnsafe ? t.allocUnsafe(u) : new t(u);
    };
    f.prototype.toArrayLike = function(t, u, l) {
      this._strip();
      var m = this.byteLength(), w = l || Math.max(1, m);
      h(m <= w, "byte array longer than desired length"), h(w > 0, "Requested array length <= 0");
      var b = j(t, w), _ = u === "le" ? "LE" : "BE";
      return this["_toArrayLike" + _](b, m), b;
    }, f.prototype._toArrayLikeLE = function(t, u) {
      for (var l = 0, m = 0, w = 0, b = 0; w < this.length; w++) {
        var _ = this.words[w] << b | m;
        t[l++] = _ & 255, l < t.length && (t[l++] = _ >> 8 & 255), l < t.length && (t[l++] = _ >> 16 & 255), b === 6 ? (l < t.length && (t[l++] = _ >> 24 & 255), m = 0, b = 0) : (m = _ >>> 24, b += 2);
      }
      if (l < t.length)
        for (t[l++] = m; l < t.length; )
          t[l++] = 0;
    }, f.prototype._toArrayLikeBE = function(t, u) {
      for (var l = t.length - 1, m = 0, w = 0, b = 0; w < this.length; w++) {
        var _ = this.words[w] << b | m;
        t[l--] = _ & 255, l >= 0 && (t[l--] = _ >> 8 & 255), l >= 0 && (t[l--] = _ >> 16 & 255), b === 6 ? (l >= 0 && (t[l--] = _ >> 24 & 255), m = 0, b = 0) : (m = _ >>> 24, b += 2);
      }
      if (l >= 0)
        for (t[l--] = m; l >= 0; )
          t[l--] = 0;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var u = t, l = 0;
      return u >= 4096 && (l += 13, u >>>= 13), u >= 64 && (l += 7, u >>>= 7), u >= 8 && (l += 4, u >>>= 4), u >= 2 && (l += 2, u >>>= 2), l + u;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var u = t, l = 0;
      return (u & 8191) === 0 && (l += 13, u >>>= 13), (u & 127) === 0 && (l += 7, u >>>= 7), (u & 15) === 0 && (l += 4, u >>>= 4), (u & 3) === 0 && (l += 2, u >>>= 2), (u & 1) === 0 && l++, l;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], u = this._countBits(t);
      return (this.length - 1) * 26 + u;
    };
    function Bt(g) {
      for (var t = new Array(g.bitLength()), u = 0; u < t.length; u++) {
        var l = u / 26 | 0, m = u % 26;
        t[u] = g.words[l] >>> m & 1;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, u = 0; u < this.length; u++) {
        var l = this._zeroBits(this.words[u]);
        if (t += l, l !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var u = 0; u < t.length; u++)
        this.words[u] = this.words[u] | t.words[u];
      return this._strip();
    }, f.prototype.ior = function(t) {
      return h((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var u;
      this.length > t.length ? u = t : u = this;
      for (var l = 0; l < u.length; l++)
        this.words[l] = this.words[l] & t.words[l];
      return this.length = u.length, this._strip();
    }, f.prototype.iand = function(t) {
      return h((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var u, l;
      this.length > t.length ? (u = this, l = t) : (u = t, l = this);
      for (var m = 0; m < l.length; m++)
        this.words[m] = u.words[m] ^ l.words[m];
      if (this !== u)
        for (; m < u.length; m++)
          this.words[m] = u.words[m];
      return this.length = u.length, this._strip();
    }, f.prototype.ixor = function(t) {
      return h((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      h(typeof t == "number" && t >= 0);
      var u = Math.ceil(t / 26) | 0, l = t % 26;
      this._expand(u), l > 0 && u--;
      for (var m = 0; m < u; m++)
        this.words[m] = ~this.words[m] & 67108863;
      return l > 0 && (this.words[m] = ~this.words[m] & 67108863 >> 26 - l), this._strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, u) {
      h(typeof t == "number" && t >= 0);
      var l = t / 26 | 0, m = t % 26;
      return this._expand(l + 1), u ? this.words[l] = this.words[l] | 1 << m : this.words[l] = this.words[l] & ~(1 << m), this._strip();
    }, f.prototype.iadd = function(t) {
      var u;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, u = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, u = this.isub(t), t.negative = 1, u._normSign();
      var l, m;
      this.length > t.length ? (l = this, m = t) : (l = t, m = this);
      for (var w = 0, b = 0; b < m.length; b++)
        u = (l.words[b] | 0) + (m.words[b] | 0) + w, this.words[b] = u & 67108863, w = u >>> 26;
      for (; w !== 0 && b < l.length; b++)
        u = (l.words[b] | 0) + w, this.words[b] = u & 67108863, w = u >>> 26;
      if (this.length = l.length, w !== 0)
        this.words[this.length] = w, this.length++;
      else if (l !== this)
        for (; b < l.length; b++)
          this.words[b] = l.words[b];
      return this;
    }, f.prototype.add = function(t) {
      var u;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, u = this.sub(t), t.negative ^= 1, u) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, u = t.sub(this), this.negative = 1, u) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var u = this.iadd(t);
        return t.negative = 1, u._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var l = this.cmp(t);
      if (l === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var m, w;
      l > 0 ? (m = this, w = t) : (m = t, w = this);
      for (var b = 0, _ = 0; _ < w.length; _++)
        u = (m.words[_] | 0) - (w.words[_] | 0) + b, b = u >> 26, this.words[_] = u & 67108863;
      for (; b !== 0 && _ < m.length; _++)
        u = (m.words[_] | 0) + b, b = u >> 26, this.words[_] = u & 67108863;
      if (b === 0 && _ < m.length && m !== this)
        for (; _ < m.length; _++)
          this.words[_] = m.words[_];
      return this.length = Math.max(this.length, _), m !== this && (this.negative = 1), this._strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function Q(g, t, u) {
      u.negative = t.negative ^ g.negative;
      var l = g.length + t.length | 0;
      u.length = l, l = l - 1 | 0;
      var m = g.words[0] | 0, w = t.words[0] | 0, b = m * w, _ = b & 67108863, d = b / 67108864 | 0;
      u.words[0] = _;
      for (var o = 1; o < l; o++) {
        for (var y = d >>> 26, L = d & 67108863, U = Math.min(o, t.length - 1), N = Math.max(0, o - g.length + 1); N <= U; N++) {
          var _t = o - N | 0;
          m = g.words[_t] | 0, w = t.words[N] | 0, b = m * w + L, y += b / 67108864 | 0, L = b & 67108863;
        }
        u.words[o] = L | 0, d = y | 0;
      }
      return d !== 0 ? u.words[o] = d | 0 : u.length--, u._strip();
    }
    var ot = function(t, u, l) {
      var m = t.words, w = u.words, b = l.words, _ = 0, d, o, y, L = m[0] | 0, U = L & 8191, N = L >>> 13, _t = m[1] | 0, P = _t & 8191, Z = _t >>> 13, lr = m[2] | 0, tt = lr & 8191, J = lr >>> 13, Wt = m[3] | 0, q = Wt & 8191, rt = Wt >>> 13, vr = m[4] | 0, Y = vr & 8191, et = vr >>> 13, gr = m[5] | 0, X = gr & 8191, G = gr >>> 13, Rt = m[6] | 0, V = Rt & 8191, it = Rt >>> 13, Ot = m[7] | 0, nt = Ot & 8191, a = Ot >>> 13, r = m[8] | 0, e = r & 8191, c = r >>> 13, x = m[9] | 0, E = x & 8191, A = x >>> 13, D = w[0] | 0, C = D & 8191, R = D >>> 13, W = w[1] | 0, T = W & 8191, ft = W >>> 13, De = w[2] | 0, ut = De & 8191, ht = De >>> 13, Oe = w[3] | 0, at = Oe & 8191, lt = Oe >>> 13, ke = w[4] | 0, ct = ke & 8191, dt = ke >>> 13, je = w[5] | 0, pt = je & 8191, mt = je >>> 13, Pe = w[6] | 0, yt = Pe & 8191, wt = Pe >>> 13, ze = w[7] | 0, vt = ze & 8191, gt = ze >>> 13, $e = w[8] | 0, Mt = $e & 8191, xt = $e >>> 13, Ze = w[9] | 0, bt = Ze & 8191, Et = Ze >>> 13;
      l.negative = t.negative ^ u.negative, l.length = 19, d = Math.imul(U, C), o = Math.imul(U, R), o = o + Math.imul(N, C) | 0, y = Math.imul(N, R);
      var Vr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Vr >>> 26) | 0, Vr &= 67108863, d = Math.imul(P, C), o = Math.imul(P, R), o = o + Math.imul(Z, C) | 0, y = Math.imul(Z, R), d = d + Math.imul(U, T) | 0, o = o + Math.imul(U, ft) | 0, o = o + Math.imul(N, T) | 0, y = y + Math.imul(N, ft) | 0;
      var Hr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Hr >>> 26) | 0, Hr &= 67108863, d = Math.imul(tt, C), o = Math.imul(tt, R), o = o + Math.imul(J, C) | 0, y = Math.imul(J, R), d = d + Math.imul(P, T) | 0, o = o + Math.imul(P, ft) | 0, o = o + Math.imul(Z, T) | 0, y = y + Math.imul(Z, ft) | 0, d = d + Math.imul(U, ut) | 0, o = o + Math.imul(U, ht) | 0, o = o + Math.imul(N, ut) | 0, y = y + Math.imul(N, ht) | 0;
      var Qr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Qr >>> 26) | 0, Qr &= 67108863, d = Math.imul(q, C), o = Math.imul(q, R), o = o + Math.imul(rt, C) | 0, y = Math.imul(rt, R), d = d + Math.imul(tt, T) | 0, o = o + Math.imul(tt, ft) | 0, o = o + Math.imul(J, T) | 0, y = y + Math.imul(J, ft) | 0, d = d + Math.imul(P, ut) | 0, o = o + Math.imul(P, ht) | 0, o = o + Math.imul(Z, ut) | 0, y = y + Math.imul(Z, ht) | 0, d = d + Math.imul(U, at) | 0, o = o + Math.imul(U, lt) | 0, o = o + Math.imul(N, at) | 0, y = y + Math.imul(N, lt) | 0;
      var Kr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Kr >>> 26) | 0, Kr &= 67108863, d = Math.imul(Y, C), o = Math.imul(Y, R), o = o + Math.imul(et, C) | 0, y = Math.imul(et, R), d = d + Math.imul(q, T) | 0, o = o + Math.imul(q, ft) | 0, o = o + Math.imul(rt, T) | 0, y = y + Math.imul(rt, ft) | 0, d = d + Math.imul(tt, ut) | 0, o = o + Math.imul(tt, ht) | 0, o = o + Math.imul(J, ut) | 0, y = y + Math.imul(J, ht) | 0, d = d + Math.imul(P, at) | 0, o = o + Math.imul(P, lt) | 0, o = o + Math.imul(Z, at) | 0, y = y + Math.imul(Z, lt) | 0, d = d + Math.imul(U, ct) | 0, o = o + Math.imul(U, dt) | 0, o = o + Math.imul(N, ct) | 0, y = y + Math.imul(N, dt) | 0;
      var Jr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Jr >>> 26) | 0, Jr &= 67108863, d = Math.imul(X, C), o = Math.imul(X, R), o = o + Math.imul(G, C) | 0, y = Math.imul(G, R), d = d + Math.imul(Y, T) | 0, o = o + Math.imul(Y, ft) | 0, o = o + Math.imul(et, T) | 0, y = y + Math.imul(et, ft) | 0, d = d + Math.imul(q, ut) | 0, o = o + Math.imul(q, ht) | 0, o = o + Math.imul(rt, ut) | 0, y = y + Math.imul(rt, ht) | 0, d = d + Math.imul(tt, at) | 0, o = o + Math.imul(tt, lt) | 0, o = o + Math.imul(J, at) | 0, y = y + Math.imul(J, lt) | 0, d = d + Math.imul(P, ct) | 0, o = o + Math.imul(P, dt) | 0, o = o + Math.imul(Z, ct) | 0, y = y + Math.imul(Z, dt) | 0, d = d + Math.imul(U, pt) | 0, o = o + Math.imul(U, mt) | 0, o = o + Math.imul(N, pt) | 0, y = y + Math.imul(N, mt) | 0;
      var Xr = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (Xr >>> 26) | 0, Xr &= 67108863, d = Math.imul(V, C), o = Math.imul(V, R), o = o + Math.imul(it, C) | 0, y = Math.imul(it, R), d = d + Math.imul(X, T) | 0, o = o + Math.imul(X, ft) | 0, o = o + Math.imul(G, T) | 0, y = y + Math.imul(G, ft) | 0, d = d + Math.imul(Y, ut) | 0, o = o + Math.imul(Y, ht) | 0, o = o + Math.imul(et, ut) | 0, y = y + Math.imul(et, ht) | 0, d = d + Math.imul(q, at) | 0, o = o + Math.imul(q, lt) | 0, o = o + Math.imul(rt, at) | 0, y = y + Math.imul(rt, lt) | 0, d = d + Math.imul(tt, ct) | 0, o = o + Math.imul(tt, dt) | 0, o = o + Math.imul(J, ct) | 0, y = y + Math.imul(J, dt) | 0, d = d + Math.imul(P, pt) | 0, o = o + Math.imul(P, mt) | 0, o = o + Math.imul(Z, pt) | 0, y = y + Math.imul(Z, mt) | 0, d = d + Math.imul(U, yt) | 0, o = o + Math.imul(U, wt) | 0, o = o + Math.imul(N, yt) | 0, y = y + Math.imul(N, wt) | 0;
      var te = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, d = Math.imul(nt, C), o = Math.imul(nt, R), o = o + Math.imul(a, C) | 0, y = Math.imul(a, R), d = d + Math.imul(V, T) | 0, o = o + Math.imul(V, ft) | 0, o = o + Math.imul(it, T) | 0, y = y + Math.imul(it, ft) | 0, d = d + Math.imul(X, ut) | 0, o = o + Math.imul(X, ht) | 0, o = o + Math.imul(G, ut) | 0, y = y + Math.imul(G, ht) | 0, d = d + Math.imul(Y, at) | 0, o = o + Math.imul(Y, lt) | 0, o = o + Math.imul(et, at) | 0, y = y + Math.imul(et, lt) | 0, d = d + Math.imul(q, ct) | 0, o = o + Math.imul(q, dt) | 0, o = o + Math.imul(rt, ct) | 0, y = y + Math.imul(rt, dt) | 0, d = d + Math.imul(tt, pt) | 0, o = o + Math.imul(tt, mt) | 0, o = o + Math.imul(J, pt) | 0, y = y + Math.imul(J, mt) | 0, d = d + Math.imul(P, yt) | 0, o = o + Math.imul(P, wt) | 0, o = o + Math.imul(Z, yt) | 0, y = y + Math.imul(Z, wt) | 0, d = d + Math.imul(U, vt) | 0, o = o + Math.imul(U, gt) | 0, o = o + Math.imul(N, vt) | 0, y = y + Math.imul(N, gt) | 0;
      var re = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, d = Math.imul(e, C), o = Math.imul(e, R), o = o + Math.imul(c, C) | 0, y = Math.imul(c, R), d = d + Math.imul(nt, T) | 0, o = o + Math.imul(nt, ft) | 0, o = o + Math.imul(a, T) | 0, y = y + Math.imul(a, ft) | 0, d = d + Math.imul(V, ut) | 0, o = o + Math.imul(V, ht) | 0, o = o + Math.imul(it, ut) | 0, y = y + Math.imul(it, ht) | 0, d = d + Math.imul(X, at) | 0, o = o + Math.imul(X, lt) | 0, o = o + Math.imul(G, at) | 0, y = y + Math.imul(G, lt) | 0, d = d + Math.imul(Y, ct) | 0, o = o + Math.imul(Y, dt) | 0, o = o + Math.imul(et, ct) | 0, y = y + Math.imul(et, dt) | 0, d = d + Math.imul(q, pt) | 0, o = o + Math.imul(q, mt) | 0, o = o + Math.imul(rt, pt) | 0, y = y + Math.imul(rt, mt) | 0, d = d + Math.imul(tt, yt) | 0, o = o + Math.imul(tt, wt) | 0, o = o + Math.imul(J, yt) | 0, y = y + Math.imul(J, wt) | 0, d = d + Math.imul(P, vt) | 0, o = o + Math.imul(P, gt) | 0, o = o + Math.imul(Z, vt) | 0, y = y + Math.imul(Z, gt) | 0, d = d + Math.imul(U, Mt) | 0, o = o + Math.imul(U, xt) | 0, o = o + Math.imul(N, Mt) | 0, y = y + Math.imul(N, xt) | 0;
      var ee = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, d = Math.imul(E, C), o = Math.imul(E, R), o = o + Math.imul(A, C) | 0, y = Math.imul(A, R), d = d + Math.imul(e, T) | 0, o = o + Math.imul(e, ft) | 0, o = o + Math.imul(c, T) | 0, y = y + Math.imul(c, ft) | 0, d = d + Math.imul(nt, ut) | 0, o = o + Math.imul(nt, ht) | 0, o = o + Math.imul(a, ut) | 0, y = y + Math.imul(a, ht) | 0, d = d + Math.imul(V, at) | 0, o = o + Math.imul(V, lt) | 0, o = o + Math.imul(it, at) | 0, y = y + Math.imul(it, lt) | 0, d = d + Math.imul(X, ct) | 0, o = o + Math.imul(X, dt) | 0, o = o + Math.imul(G, ct) | 0, y = y + Math.imul(G, dt) | 0, d = d + Math.imul(Y, pt) | 0, o = o + Math.imul(Y, mt) | 0, o = o + Math.imul(et, pt) | 0, y = y + Math.imul(et, mt) | 0, d = d + Math.imul(q, yt) | 0, o = o + Math.imul(q, wt) | 0, o = o + Math.imul(rt, yt) | 0, y = y + Math.imul(rt, wt) | 0, d = d + Math.imul(tt, vt) | 0, o = o + Math.imul(tt, gt) | 0, o = o + Math.imul(J, vt) | 0, y = y + Math.imul(J, gt) | 0, d = d + Math.imul(P, Mt) | 0, o = o + Math.imul(P, xt) | 0, o = o + Math.imul(Z, Mt) | 0, y = y + Math.imul(Z, xt) | 0, d = d + Math.imul(U, bt) | 0, o = o + Math.imul(U, Et) | 0, o = o + Math.imul(N, bt) | 0, y = y + Math.imul(N, Et) | 0;
      var ie = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, d = Math.imul(E, T), o = Math.imul(E, ft), o = o + Math.imul(A, T) | 0, y = Math.imul(A, ft), d = d + Math.imul(e, ut) | 0, o = o + Math.imul(e, ht) | 0, o = o + Math.imul(c, ut) | 0, y = y + Math.imul(c, ht) | 0, d = d + Math.imul(nt, at) | 0, o = o + Math.imul(nt, lt) | 0, o = o + Math.imul(a, at) | 0, y = y + Math.imul(a, lt) | 0, d = d + Math.imul(V, ct) | 0, o = o + Math.imul(V, dt) | 0, o = o + Math.imul(it, ct) | 0, y = y + Math.imul(it, dt) | 0, d = d + Math.imul(X, pt) | 0, o = o + Math.imul(X, mt) | 0, o = o + Math.imul(G, pt) | 0, y = y + Math.imul(G, mt) | 0, d = d + Math.imul(Y, yt) | 0, o = o + Math.imul(Y, wt) | 0, o = o + Math.imul(et, yt) | 0, y = y + Math.imul(et, wt) | 0, d = d + Math.imul(q, vt) | 0, o = o + Math.imul(q, gt) | 0, o = o + Math.imul(rt, vt) | 0, y = y + Math.imul(rt, gt) | 0, d = d + Math.imul(tt, Mt) | 0, o = o + Math.imul(tt, xt) | 0, o = o + Math.imul(J, Mt) | 0, y = y + Math.imul(J, xt) | 0, d = d + Math.imul(P, bt) | 0, o = o + Math.imul(P, Et) | 0, o = o + Math.imul(Z, bt) | 0, y = y + Math.imul(Z, Et) | 0;
      var ne = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, d = Math.imul(E, ut), o = Math.imul(E, ht), o = o + Math.imul(A, ut) | 0, y = Math.imul(A, ht), d = d + Math.imul(e, at) | 0, o = o + Math.imul(e, lt) | 0, o = o + Math.imul(c, at) | 0, y = y + Math.imul(c, lt) | 0, d = d + Math.imul(nt, ct) | 0, o = o + Math.imul(nt, dt) | 0, o = o + Math.imul(a, ct) | 0, y = y + Math.imul(a, dt) | 0, d = d + Math.imul(V, pt) | 0, o = o + Math.imul(V, mt) | 0, o = o + Math.imul(it, pt) | 0, y = y + Math.imul(it, mt) | 0, d = d + Math.imul(X, yt) | 0, o = o + Math.imul(X, wt) | 0, o = o + Math.imul(G, yt) | 0, y = y + Math.imul(G, wt) | 0, d = d + Math.imul(Y, vt) | 0, o = o + Math.imul(Y, gt) | 0, o = o + Math.imul(et, vt) | 0, y = y + Math.imul(et, gt) | 0, d = d + Math.imul(q, Mt) | 0, o = o + Math.imul(q, xt) | 0, o = o + Math.imul(rt, Mt) | 0, y = y + Math.imul(rt, xt) | 0, d = d + Math.imul(tt, bt) | 0, o = o + Math.imul(tt, Et) | 0, o = o + Math.imul(J, bt) | 0, y = y + Math.imul(J, Et) | 0;
      var oe = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, d = Math.imul(E, at), o = Math.imul(E, lt), o = o + Math.imul(A, at) | 0, y = Math.imul(A, lt), d = d + Math.imul(e, ct) | 0, o = o + Math.imul(e, dt) | 0, o = o + Math.imul(c, ct) | 0, y = y + Math.imul(c, dt) | 0, d = d + Math.imul(nt, pt) | 0, o = o + Math.imul(nt, mt) | 0, o = o + Math.imul(a, pt) | 0, y = y + Math.imul(a, mt) | 0, d = d + Math.imul(V, yt) | 0, o = o + Math.imul(V, wt) | 0, o = o + Math.imul(it, yt) | 0, y = y + Math.imul(it, wt) | 0, d = d + Math.imul(X, vt) | 0, o = o + Math.imul(X, gt) | 0, o = o + Math.imul(G, vt) | 0, y = y + Math.imul(G, gt) | 0, d = d + Math.imul(Y, Mt) | 0, o = o + Math.imul(Y, xt) | 0, o = o + Math.imul(et, Mt) | 0, y = y + Math.imul(et, xt) | 0, d = d + Math.imul(q, bt) | 0, o = o + Math.imul(q, Et) | 0, o = o + Math.imul(rt, bt) | 0, y = y + Math.imul(rt, Et) | 0;
      var se = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, d = Math.imul(E, ct), o = Math.imul(E, dt), o = o + Math.imul(A, ct) | 0, y = Math.imul(A, dt), d = d + Math.imul(e, pt) | 0, o = o + Math.imul(e, mt) | 0, o = o + Math.imul(c, pt) | 0, y = y + Math.imul(c, mt) | 0, d = d + Math.imul(nt, yt) | 0, o = o + Math.imul(nt, wt) | 0, o = o + Math.imul(a, yt) | 0, y = y + Math.imul(a, wt) | 0, d = d + Math.imul(V, vt) | 0, o = o + Math.imul(V, gt) | 0, o = o + Math.imul(it, vt) | 0, y = y + Math.imul(it, gt) | 0, d = d + Math.imul(X, Mt) | 0, o = o + Math.imul(X, xt) | 0, o = o + Math.imul(G, Mt) | 0, y = y + Math.imul(G, xt) | 0, d = d + Math.imul(Y, bt) | 0, o = o + Math.imul(Y, Et) | 0, o = o + Math.imul(et, bt) | 0, y = y + Math.imul(et, Et) | 0;
      var fe = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, d = Math.imul(E, pt), o = Math.imul(E, mt), o = o + Math.imul(A, pt) | 0, y = Math.imul(A, mt), d = d + Math.imul(e, yt) | 0, o = o + Math.imul(e, wt) | 0, o = o + Math.imul(c, yt) | 0, y = y + Math.imul(c, wt) | 0, d = d + Math.imul(nt, vt) | 0, o = o + Math.imul(nt, gt) | 0, o = o + Math.imul(a, vt) | 0, y = y + Math.imul(a, gt) | 0, d = d + Math.imul(V, Mt) | 0, o = o + Math.imul(V, xt) | 0, o = o + Math.imul(it, Mt) | 0, y = y + Math.imul(it, xt) | 0, d = d + Math.imul(X, bt) | 0, o = o + Math.imul(X, Et) | 0, o = o + Math.imul(G, bt) | 0, y = y + Math.imul(G, Et) | 0;
      var ue = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, d = Math.imul(E, yt), o = Math.imul(E, wt), o = o + Math.imul(A, yt) | 0, y = Math.imul(A, wt), d = d + Math.imul(e, vt) | 0, o = o + Math.imul(e, gt) | 0, o = o + Math.imul(c, vt) | 0, y = y + Math.imul(c, gt) | 0, d = d + Math.imul(nt, Mt) | 0, o = o + Math.imul(nt, xt) | 0, o = o + Math.imul(a, Mt) | 0, y = y + Math.imul(a, xt) | 0, d = d + Math.imul(V, bt) | 0, o = o + Math.imul(V, Et) | 0, o = o + Math.imul(it, bt) | 0, y = y + Math.imul(it, Et) | 0;
      var he = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, d = Math.imul(E, vt), o = Math.imul(E, gt), o = o + Math.imul(A, vt) | 0, y = Math.imul(A, gt), d = d + Math.imul(e, Mt) | 0, o = o + Math.imul(e, xt) | 0, o = o + Math.imul(c, Mt) | 0, y = y + Math.imul(c, xt) | 0, d = d + Math.imul(nt, bt) | 0, o = o + Math.imul(nt, Et) | 0, o = o + Math.imul(a, bt) | 0, y = y + Math.imul(a, Et) | 0;
      var ae = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, d = Math.imul(E, Mt), o = Math.imul(E, xt), o = o + Math.imul(A, Mt) | 0, y = Math.imul(A, xt), d = d + Math.imul(e, bt) | 0, o = o + Math.imul(e, Et) | 0, o = o + Math.imul(c, bt) | 0, y = y + Math.imul(c, Et) | 0;
      var le = (_ + d | 0) + ((o & 8191) << 13) | 0;
      _ = (y + (o >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, d = Math.imul(E, bt), o = Math.imul(E, Et), o = o + Math.imul(A, bt) | 0, y = Math.imul(A, Et);
      var ce = (_ + d | 0) + ((o & 8191) << 13) | 0;
      return _ = (y + (o >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, b[0] = Vr, b[1] = Hr, b[2] = Qr, b[3] = Kr, b[4] = Jr, b[5] = Xr, b[6] = te, b[7] = re, b[8] = ee, b[9] = ie, b[10] = ne, b[11] = oe, b[12] = se, b[13] = fe, b[14] = ue, b[15] = he, b[16] = ae, b[17] = le, b[18] = ce, _ !== 0 && (b[19] = _, l.length++), l;
    };
    Math.imul || (ot = Q);
    function It(g, t, u) {
      u.negative = t.negative ^ g.negative, u.length = g.length + t.length;
      for (var l = 0, m = 0, w = 0; w < u.length - 1; w++) {
        var b = m;
        m = 0;
        for (var _ = l & 67108863, d = Math.min(w, t.length - 1), o = Math.max(0, w - g.length + 1); o <= d; o++) {
          var y = w - o, L = g.words[y] | 0, U = t.words[o] | 0, N = L * U, _t = N & 67108863;
          b = b + (N / 67108864 | 0) | 0, _t = _t + _ | 0, _ = _t & 67108863, b = b + (_t >>> 26) | 0, m += b >>> 26, b &= 67108863;
        }
        u.words[w] = _, l = b, b = m;
      }
      return l !== 0 ? u.words[w] = l : u.length--, u._strip();
    }
    function Lt(g, t, u) {
      return It(g, t, u);
    }
    f.prototype.mulTo = function(t, u) {
      var l, m = this.length + t.length;
      return this.length === 10 && t.length === 10 ? l = ot(this, t, u) : m < 63 ? l = Q(this, t, u) : m < 1024 ? l = It(this, t, u) : l = Lt(this, t, u), l;
    }, f.prototype.mul = function(t) {
      var u = new f(null);
      return u.words = new Array(this.length + t.length), this.mulTo(t, u);
    }, f.prototype.mulf = function(t) {
      var u = new f(null);
      return u.words = new Array(this.length + t.length), Lt(this, t, u);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      var u = t < 0;
      u && (t = -t), h(typeof t == "number"), h(t < 67108864);
      for (var l = 0, m = 0; m < this.length; m++) {
        var w = (this.words[m] | 0) * t, b = (w & 67108863) + (l & 67108863);
        l >>= 26, l += w / 67108864 | 0, l += b >>> 26, this.words[m] = b & 67108863;
      }
      return l !== 0 && (this.words[m] = l, this.length++), u ? this.ineg() : this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var u = Bt(t);
      if (u.length === 0)
        return new f(1);
      for (var l = this, m = 0; m < u.length && u[m] === 0; m++, l = l.sqr())
        ;
      if (++m < u.length)
        for (var w = l.sqr(); m < u.length; m++, w = w.sqr())
          u[m] !== 0 && (l = l.mul(w));
      return l;
    }, f.prototype.iushln = function(t) {
      h(typeof t == "number" && t >= 0);
      var u = t % 26, l = (t - u) / 26, m = 67108863 >>> 26 - u << 26 - u, w;
      if (u !== 0) {
        var b = 0;
        for (w = 0; w < this.length; w++) {
          var _ = this.words[w] & m, d = (this.words[w] | 0) - _ << u;
          this.words[w] = d | b, b = _ >>> 26 - u;
        }
        b && (this.words[w] = b, this.length++);
      }
      if (l !== 0) {
        for (w = this.length - 1; w >= 0; w--)
          this.words[w + l] = this.words[w];
        for (w = 0; w < l; w++)
          this.words[w] = 0;
        this.length += l;
      }
      return this._strip();
    }, f.prototype.ishln = function(t) {
      return h(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, u, l) {
      h(typeof t == "number" && t >= 0);
      var m;
      u ? m = (u - u % 26) / 26 : m = 0;
      var w = t % 26, b = Math.min((t - w) / 26, this.length), _ = 67108863 ^ 67108863 >>> w << w, d = l;
      if (m -= b, m = Math.max(0, m), d) {
        for (var o = 0; o < b; o++)
          d.words[o] = this.words[o];
        d.length = b;
      }
      if (b !== 0)
        if (this.length > b)
          for (this.length -= b, o = 0; o < this.length; o++)
            this.words[o] = this.words[o + b];
        else
          this.words[0] = 0, this.length = 1;
      var y = 0;
      for (o = this.length - 1; o >= 0 && (y !== 0 || o >= m); o--) {
        var L = this.words[o] | 0;
        this.words[o] = y << 26 - w | L >>> w, y = L & _;
      }
      return d && y !== 0 && (d.words[d.length++] = y), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, f.prototype.ishrn = function(t, u, l) {
      return h(this.negative === 0), this.iushrn(t, u, l);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      h(typeof t == "number" && t >= 0);
      var u = t % 26, l = (t - u) / 26, m = 1 << u;
      if (this.length <= l)
        return !1;
      var w = this.words[l];
      return !!(w & m);
    }, f.prototype.imaskn = function(t) {
      h(typeof t == "number" && t >= 0);
      var u = t % 26, l = (t - u) / 26;
      if (h(this.negative === 0, "imaskn works only with positive numbers"), this.length <= l)
        return this;
      if (u !== 0 && l++, this.length = Math.min(l, this.length), u !== 0) {
        var m = 67108863 ^ 67108863 >>> u << u;
        this.words[this.length - 1] &= m;
      }
      return this._strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return h(typeof t == "number"), h(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var u = 0; u < this.length && this.words[u] >= 67108864; u++)
        this.words[u] -= 67108864, u === this.length - 1 ? this.words[u + 1] = 1 : this.words[u + 1]++;
      return this.length = Math.max(this.length, u + 1), this;
    }, f.prototype.isubn = function(t) {
      if (h(typeof t == "number"), h(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var u = 0; u < this.length && this.words[u] < 0; u++)
          this.words[u] += 67108864, this.words[u + 1] -= 1;
      return this._strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, u, l) {
      var m = t.length + l, w;
      this._expand(m);
      var b, _ = 0;
      for (w = 0; w < t.length; w++) {
        b = (this.words[w + l] | 0) + _;
        var d = (t.words[w] | 0) * u;
        b -= d & 67108863, _ = (b >> 26) - (d / 67108864 | 0), this.words[w + l] = b & 67108863;
      }
      for (; w < this.length - l; w++)
        b = (this.words[w + l] | 0) + _, _ = b >> 26, this.words[w + l] = b & 67108863;
      if (_ === 0)
        return this._strip();
      for (h(_ === -1), _ = 0, w = 0; w < this.length; w++)
        b = -(this.words[w] | 0) + _, _ = b >> 26, this.words[w] = b & 67108863;
      return this.negative = 1, this._strip();
    }, f.prototype._wordDiv = function(t, u) {
      var l = this.length - t.length, m = this.clone(), w = t, b = w.words[w.length - 1] | 0, _ = this._countBits(b);
      l = 26 - _, l !== 0 && (w = w.ushln(l), m.iushln(l), b = w.words[w.length - 1] | 0);
      var d = m.length - w.length, o;
      if (u !== "mod") {
        o = new f(null), o.length = d + 1, o.words = new Array(o.length);
        for (var y = 0; y < o.length; y++)
          o.words[y] = 0;
      }
      var L = m.clone()._ishlnsubmul(w, 1, d);
      L.negative === 0 && (m = L, o && (o.words[d] = 1));
      for (var U = d - 1; U >= 0; U--) {
        var N = (m.words[w.length + U] | 0) * 67108864 + (m.words[w.length + U - 1] | 0);
        for (N = Math.min(N / b | 0, 67108863), m._ishlnsubmul(w, N, U); m.negative !== 0; )
          N--, m.negative = 0, m._ishlnsubmul(w, 1, U), m.isZero() || (m.negative ^= 1);
        o && (o.words[U] = N);
      }
      return o && o._strip(), m._strip(), u !== "div" && l !== 0 && m.iushrn(l), {
        div: o || null,
        mod: m
      };
    }, f.prototype.divmod = function(t, u, l) {
      if (h(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var m, w, b;
      return this.negative !== 0 && t.negative === 0 ? (b = this.neg().divmod(t, u), u !== "mod" && (m = b.div.neg()), u !== "div" && (w = b.mod.neg(), l && w.negative !== 0 && w.iadd(t)), {
        div: m,
        mod: w
      }) : this.negative === 0 && t.negative !== 0 ? (b = this.divmod(t.neg(), u), u !== "mod" && (m = b.div.neg()), {
        div: m,
        mod: b.mod
      }) : (this.negative & t.negative) !== 0 ? (b = this.neg().divmod(t.neg(), u), u !== "div" && (w = b.mod.neg(), l && w.negative !== 0 && w.isub(t)), {
        div: b.div,
        mod: w
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? u === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : u === "mod" ? {
        div: null,
        mod: new f(this.modrn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modrn(t.words[0]))
      } : this._wordDiv(t, u);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var u = this.divmod(t);
      if (u.mod.isZero())
        return u.div;
      var l = u.div.negative !== 0 ? u.mod.isub(t) : u.mod, m = t.ushrn(1), w = t.andln(1), b = l.cmp(m);
      return b < 0 || w === 1 && b === 0 ? u.div : u.div.negative !== 0 ? u.div.isubn(1) : u.div.iaddn(1);
    }, f.prototype.modrn = function(t) {
      var u = t < 0;
      u && (t = -t), h(t <= 67108863);
      for (var l = (1 << 26) % t, m = 0, w = this.length - 1; w >= 0; w--)
        m = (l * m + (this.words[w] | 0)) % t;
      return u ? -m : m;
    }, f.prototype.modn = function(t) {
      return this.modrn(t);
    }, f.prototype.idivn = function(t) {
      var u = t < 0;
      u && (t = -t), h(t <= 67108863);
      for (var l = 0, m = this.length - 1; m >= 0; m--) {
        var w = (this.words[m] | 0) + l * 67108864;
        this.words[m] = w / t | 0, l = w % t;
      }
      return this._strip(), u ? this.ineg() : this;
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      h(t.negative === 0), h(!t.isZero());
      var u = this, l = t.clone();
      u.negative !== 0 ? u = u.umod(t) : u = u.clone();
      for (var m = new f(1), w = new f(0), b = new f(0), _ = new f(1), d = 0; u.isEven() && l.isEven(); )
        u.iushrn(1), l.iushrn(1), ++d;
      for (var o = l.clone(), y = u.clone(); !u.isZero(); ) {
        for (var L = 0, U = 1; (u.words[0] & U) === 0 && L < 26; ++L, U <<= 1)
          ;
        if (L > 0)
          for (u.iushrn(L); L-- > 0; )
            (m.isOdd() || w.isOdd()) && (m.iadd(o), w.isub(y)), m.iushrn(1), w.iushrn(1);
        for (var N = 0, _t = 1; (l.words[0] & _t) === 0 && N < 26; ++N, _t <<= 1)
          ;
        if (N > 0)
          for (l.iushrn(N); N-- > 0; )
            (b.isOdd() || _.isOdd()) && (b.iadd(o), _.isub(y)), b.iushrn(1), _.iushrn(1);
        u.cmp(l) >= 0 ? (u.isub(l), m.isub(b), w.isub(_)) : (l.isub(u), b.isub(m), _.isub(w));
      }
      return {
        a: b,
        b: _,
        gcd: l.iushln(d)
      };
    }, f.prototype._invmp = function(t) {
      h(t.negative === 0), h(!t.isZero());
      var u = this, l = t.clone();
      u.negative !== 0 ? u = u.umod(t) : u = u.clone();
      for (var m = new f(1), w = new f(0), b = l.clone(); u.cmpn(1) > 0 && l.cmpn(1) > 0; ) {
        for (var _ = 0, d = 1; (u.words[0] & d) === 0 && _ < 26; ++_, d <<= 1)
          ;
        if (_ > 0)
          for (u.iushrn(_); _-- > 0; )
            m.isOdd() && m.iadd(b), m.iushrn(1);
        for (var o = 0, y = 1; (l.words[0] & y) === 0 && o < 26; ++o, y <<= 1)
          ;
        if (o > 0)
          for (l.iushrn(o); o-- > 0; )
            w.isOdd() && w.iadd(b), w.iushrn(1);
        u.cmp(l) >= 0 ? (u.isub(l), m.isub(w)) : (l.isub(u), w.isub(m));
      }
      var L;
      return u.cmpn(1) === 0 ? L = m : L = w, L.cmpn(0) < 0 && L.iadd(t), L;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var u = this.clone(), l = t.clone();
      u.negative = 0, l.negative = 0;
      for (var m = 0; u.isEven() && l.isEven(); m++)
        u.iushrn(1), l.iushrn(1);
      do {
        for (; u.isEven(); )
          u.iushrn(1);
        for (; l.isEven(); )
          l.iushrn(1);
        var w = u.cmp(l);
        if (w < 0) {
          var b = u;
          u = l, l = b;
        } else if (w === 0 || l.cmpn(1) === 0)
          break;
        u.isub(l);
      } while (!0);
      return l.iushln(m);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      h(typeof t == "number");
      var u = t % 26, l = (t - u) / 26, m = 1 << u;
      if (this.length <= l)
        return this._expand(l + 1), this.words[l] |= m, this;
      for (var w = m, b = l; w !== 0 && b < this.length; b++) {
        var _ = this.words[b] | 0;
        _ += w, w = _ >>> 26, _ &= 67108863, this.words[b] = _;
      }
      return w !== 0 && (this.words[b] = w, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var u = t < 0;
      if (this.negative !== 0 && !u)
        return -1;
      if (this.negative === 0 && u)
        return 1;
      this._strip();
      var l;
      if (this.length > 1)
        l = 1;
      else {
        u && (t = -t), h(t <= 67108863, "Number is too big");
        var m = this.words[0] | 0;
        l = m === t ? 0 : m < t ? -1 : 1;
      }
      return this.negative !== 0 ? -l | 0 : l;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var u = this.ucmp(t);
      return this.negative !== 0 ? -u | 0 : u;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var u = 0, l = this.length - 1; l >= 0; l--) {
        var m = this.words[l] | 0, w = t.words[l] | 0;
        if (m !== w) {
          m < w ? u = -1 : m > w && (u = 1);
          break;
        }
      }
      return u;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new K(t);
    }, f.prototype.toRed = function(t) {
      return h(!this.red, "Already a number in reduction context"), h(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return h(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return h(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return h(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return h(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return h(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return h(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return h(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return h(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return h(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return h(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return h(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return h(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return h(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return h(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return h(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var st = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function $(g, t) {
      this.name = g, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    $.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, $.prototype.ireduce = function(t) {
      var u = t, l;
      do
        this.split(u, this.tmp), u = this.imulK(u), u = u.iadd(this.tmp), l = u.bitLength();
      while (l > this.n);
      var m = l < this.n ? -1 : u.ucmp(this.p);
      return m === 0 ? (u.words[0] = 0, u.length = 1) : m > 0 ? u.isub(this.p) : u.strip !== void 0 ? u.strip() : u._strip(), u;
    }, $.prototype.split = function(t, u) {
      t.iushrn(this.n, 0, u);
    }, $.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function St() {
      $.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    p(St, $), St.prototype.split = function(t, u) {
      for (var l = 4194303, m = Math.min(t.length, 9), w = 0; w < m; w++)
        u.words[w] = t.words[w];
      if (u.length = m, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var b = t.words[9];
      for (u.words[u.length++] = b & l, w = 10; w < t.length; w++) {
        var _ = t.words[w] | 0;
        t.words[w - 10] = (_ & l) << 4 | b >>> 22, b = _;
      }
      b >>>= 22, t.words[w - 10] = b, b === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, St.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var u = 0, l = 0; l < t.length; l++) {
        var m = t.words[l] | 0;
        u += m * 977, t.words[l] = u & 67108863, u = m * 64 + (u / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function qt() {
      $.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    p(qt, $);
    function wr() {
      $.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    p(wr, $);
    function ar() {
      $.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    p(ar, $), ar.prototype.imulK = function(t) {
      for (var u = 0, l = 0; l < t.length; l++) {
        var m = (t.words[l] | 0) * 19 + u, w = m & 67108863;
        m >>>= 26, t.words[l] = w, u = m;
      }
      return u !== 0 && (t.words[t.length++] = u), t;
    }, f._prime = function(t) {
      if (st[t])
        return st[t];
      var u;
      if (t === "k256")
        u = new St();
      else if (t === "p224")
        u = new qt();
      else if (t === "p192")
        u = new wr();
      else if (t === "p25519")
        u = new ar();
      else
        throw new Error("Unknown prime " + t);
      return st[t] = u, u;
    };
    function K(g) {
      if (typeof g == "string") {
        var t = f._prime(g);
        this.m = t.p, this.prime = t;
      } else
        h(g.gtn(1), "modulus must be greater than 1"), this.m = g, this.prime = null;
    }
    K.prototype._verify1 = function(t) {
      h(t.negative === 0, "red works only with positives"), h(t.red, "red works only with red numbers");
    }, K.prototype._verify2 = function(t, u) {
      h((t.negative | u.negative) === 0, "red works only with positives"), h(
        t.red && t.red === u.red,
        "red works only with red numbers"
      );
    }, K.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : (F(t, t.umod(this.m)._forceRed(this)), t);
    }, K.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, K.prototype.add = function(t, u) {
      this._verify2(t, u);
      var l = t.add(u);
      return l.cmp(this.m) >= 0 && l.isub(this.m), l._forceRed(this);
    }, K.prototype.iadd = function(t, u) {
      this._verify2(t, u);
      var l = t.iadd(u);
      return l.cmp(this.m) >= 0 && l.isub(this.m), l;
    }, K.prototype.sub = function(t, u) {
      this._verify2(t, u);
      var l = t.sub(u);
      return l.cmpn(0) < 0 && l.iadd(this.m), l._forceRed(this);
    }, K.prototype.isub = function(t, u) {
      this._verify2(t, u);
      var l = t.isub(u);
      return l.cmpn(0) < 0 && l.iadd(this.m), l;
    }, K.prototype.shl = function(t, u) {
      return this._verify1(t), this.imod(t.ushln(u));
    }, K.prototype.imul = function(t, u) {
      return this._verify2(t, u), this.imod(t.imul(u));
    }, K.prototype.mul = function(t, u) {
      return this._verify2(t, u), this.imod(t.mul(u));
    }, K.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, K.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, K.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var u = this.m.andln(3);
      if (h(u % 2 === 1), u === 3) {
        var l = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, l);
      }
      for (var m = this.m.subn(1), w = 0; !m.isZero() && m.andln(1) === 0; )
        w++, m.iushrn(1);
      h(!m.isZero());
      var b = new f(1).toRed(this), _ = b.redNeg(), d = this.m.subn(1).iushrn(1), o = this.m.bitLength();
      for (o = new f(2 * o * o).toRed(this); this.pow(o, d).cmp(_) !== 0; )
        o.redIAdd(_);
      for (var y = this.pow(o, m), L = this.pow(t, m.addn(1).iushrn(1)), U = this.pow(t, m), N = w; U.cmp(b) !== 0; ) {
        for (var _t = U, P = 0; _t.cmp(b) !== 0; P++)
          _t = _t.redSqr();
        h(P < N);
        var Z = this.pow(y, new f(1).iushln(N - P - 1));
        L = L.redMul(Z), y = Z.redSqr(), U = U.redMul(y), N = P;
      }
      return L;
    }, K.prototype.invm = function(t) {
      var u = t._invmp(this.m);
      return u.negative !== 0 ? (u.negative = 0, this.imod(u).redNeg()) : this.imod(u);
    }, K.prototype.pow = function(t, u) {
      if (u.isZero())
        return new f(1).toRed(this);
      if (u.cmpn(1) === 0)
        return t.clone();
      var l = 4, m = new Array(1 << l);
      m[0] = new f(1).toRed(this), m[1] = t;
      for (var w = 2; w < m.length; w++)
        m[w] = this.mul(m[w - 1], t);
      var b = m[0], _ = 0, d = 0, o = u.bitLength() % 26;
      for (o === 0 && (o = 26), w = u.length - 1; w >= 0; w--) {
        for (var y = u.words[w], L = o - 1; L >= 0; L--) {
          var U = y >> L & 1;
          if (b !== m[0] && (b = this.sqr(b)), U === 0 && _ === 0) {
            d = 0;
            continue;
          }
          _ <<= 1, _ |= U, d++, !(d !== l && (w !== 0 || L !== 0)) && (b = this.mul(b, m[_]), d = 0, _ = 0);
        }
        o = 26;
      }
      return b;
    }, K.prototype.convertTo = function(t) {
      var u = t.umod(this.m);
      return u === t ? u.clone() : u;
    }, K.prototype.convertFrom = function(t) {
      var u = t.clone();
      return u.red = null, u;
    }, f.mont = function(t) {
      return new Gt(t);
    };
    function Gt(g) {
      K.call(this, g), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    p(Gt, K), Gt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Gt.prototype.convertFrom = function(t) {
      var u = this.imod(t.mul(this.rinv));
      return u.red = null, u;
    }, Gt.prototype.imul = function(t, u) {
      if (t.isZero() || u.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var l = t.imul(u), m = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), w = l.isub(m).iushrn(this.shift), b = w;
      return w.cmp(this.m) >= 0 ? b = w.isub(this.m) : w.cmpn(0) < 0 && (b = w.iadd(this.m)), b._forceRed(this);
    }, Gt.prototype.mul = function(t, u) {
      if (t.isZero() || u.isZero())
        return new f(0)._forceRed(this);
      var l = t.mul(u), m = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), w = l.isub(m).iushrn(this.shift), b = w;
      return w.cmp(this.m) >= 0 ? b = w.isub(this.m) : w.cmpn(0) < 0 && (b = w.iadd(this.m)), b._forceRed(this);
    }, Gt.prototype.invm = function(t) {
      var u = this.imod(t._invmp(this.m).mul(this.r2));
      return u._forceRed(this);
    };
  })(n, jt);
})(ai);
var Ee = { exports: {} };
(function(n, i) {
  var s = qr, h = s.Buffer;
  function p(M, v) {
    for (var B in M)
      v[B] = M[B];
  }
  h.from && h.alloc && h.allocUnsafe && h.allocUnsafeSlow ? n.exports = s : (p(s, i), i.Buffer = f);
  function f(M, v, B) {
    return h(M, v, B);
  }
  p(h, f), f.from = function(M, v, B) {
    if (typeof M == "number")
      throw new TypeError("Argument must not be a number");
    return h(M, v, B);
  }, f.alloc = function(M, v, B) {
    if (typeof M != "number")
      throw new TypeError("Argument must be a number");
    var I = h(M);
    return v !== void 0 ? typeof B == "string" ? I.fill(v, B) : I.fill(v) : I.fill(0), I;
  }, f.allocUnsafe = function(M) {
    if (typeof M != "number")
      throw new TypeError("Argument must be a number");
    return h(M);
  }, f.allocUnsafeSlow = function(M) {
    if (typeof M != "number")
      throw new TypeError("Argument must be a number");
    return s.SlowBuffer(M);
  };
})(Ee, Ee.exports);
var br = Ee.exports.Buffer;
function Un(n) {
  if (n.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var i = new Uint8Array(256), s = 0; s < i.length; s++)
    i[s] = 255;
  for (var h = 0; h < n.length; h++) {
    var p = n.charAt(h), f = p.charCodeAt(0);
    if (i[f] !== 255)
      throw new TypeError(p + " is ambiguous");
    i[f] = h;
  }
  var M = n.length, v = n.charAt(0), B = Math.log(M) / Math.log(256), I = Math.log(256) / Math.log(M);
  function F(S) {
    if ((Array.isArray(S) || S instanceof Uint8Array) && (S = br.from(S)), !br.isBuffer(S))
      throw new TypeError("Expected Buffer");
    if (S.length === 0)
      return "";
    for (var z = 0, j = 0, Bt = 0, Q = S.length; Bt !== Q && S[Bt] === 0; )
      Bt++, z++;
    for (var ot = (Q - Bt) * I + 1 >>> 0, It = new Uint8Array(ot); Bt !== Q; ) {
      for (var Lt = S[Bt], st = 0, $ = ot - 1; (Lt !== 0 || st < j) && $ !== -1; $--, st++)
        Lt += 256 * It[$] >>> 0, It[$] = Lt % M >>> 0, Lt = Lt / M >>> 0;
      if (Lt !== 0)
        throw new Error("Non-zero carry");
      j = st, Bt++;
    }
    for (var St = ot - j; St !== ot && It[St] === 0; )
      St++;
    for (var qt = v.repeat(z); St < ot; ++St)
      qt += n.charAt(It[St]);
    return qt;
  }
  function k(S) {
    if (typeof S != "string")
      throw new TypeError("Expected String");
    if (S.length === 0)
      return br.alloc(0);
    for (var z = 0, j = 0, Bt = 0; S[z] === v; )
      j++, z++;
    for (var Q = (S.length - z) * B + 1 >>> 0, ot = new Uint8Array(Q); S[z]; ) {
      var It = i[S.charCodeAt(z)];
      if (It === 255)
        return;
      for (var Lt = 0, st = Q - 1; (It !== 0 || Lt < Bt) && st !== -1; st--, Lt++)
        It += M * ot[st] >>> 0, ot[st] = It % 256 >>> 0, It = It / 256 >>> 0;
      if (It !== 0)
        throw new Error("Non-zero carry");
      Bt = Lt, z++;
    }
    for (var $ = Q - Bt; $ !== Q && ot[$] === 0; )
      $++;
    var St = br.allocUnsafe(j + (Q - $));
    St.fill(0, 0, j);
    for (var qt = j; $ !== Q; )
      St[qt++] = ot[$++];
    return St;
  }
  function O(S) {
    var z = k(S);
    if (z)
      return z;
    throw new Error("Non-base" + M + " character");
  }
  return {
    encode: F,
    decodeUnsafe: k,
    decode: O
  };
}
var Ln = Un, Tn = Ln, Nn = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", Rn = Tn(Nn);
function Ht(n, i, s) {
  return i <= n && n <= s;
}
function Yr(n) {
  if (n === void 0)
    return {};
  if (n === Object(n))
    return n;
  throw TypeError("Could not convert argument to dictionary");
}
function Cn(n) {
  for (var i = String(n), s = i.length, h = 0, p = []; h < s; ) {
    var f = i.charCodeAt(h);
    if (f < 55296 || f > 57343)
      p.push(f);
    else if (56320 <= f && f <= 57343)
      p.push(65533);
    else if (55296 <= f && f <= 56319)
      if (h === s - 1)
        p.push(65533);
      else {
        var M = n.charCodeAt(h + 1);
        if (56320 <= M && M <= 57343) {
          var v = f & 1023, B = M & 1023;
          p.push(65536 + (v << 10) + B), h += 1;
        } else
          p.push(65533);
      }
    h += 1;
  }
  return p;
}
function Dn(n) {
  for (var i = "", s = 0; s < n.length; ++s) {
    var h = n[s];
    h <= 65535 ? i += String.fromCharCode(h) : (h -= 65536, i += String.fromCharCode(
      (h >> 10) + 55296,
      (h & 1023) + 56320
    ));
  }
  return i;
}
var Lr = -1;
function Te(n) {
  this.tokens = [].slice.call(n);
}
Te.prototype = {
  endOfStream: function() {
    return !this.tokens.length;
  },
  read: function() {
    return this.tokens.length ? this.tokens.shift() : Lr;
  },
  prepend: function(n) {
    if (Array.isArray(n))
      for (var i = n; i.length; )
        this.tokens.unshift(i.pop());
    else
      this.tokens.unshift(n);
  },
  push: function(n) {
    if (Array.isArray(n))
      for (var i = n; i.length; )
        this.tokens.push(i.shift());
    else
      this.tokens.push(n);
  }
};
var hr = -1;
function we(n, i) {
  if (n)
    throw TypeError("Decoder error");
  return i || 65533;
}
var Tr = "utf-8";
function Nr(n, i) {
  if (!(this instanceof Nr))
    return new Nr(n, i);
  if (n = n !== void 0 ? String(n).toLowerCase() : Tr, n !== Tr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  i = Yr(i), this._streaming = !1, this._BOMseen = !1, this._decoder = null, this._fatal = Boolean(i.fatal), this._ignoreBOM = Boolean(i.ignoreBOM), Object.defineProperty(this, "encoding", { value: "utf-8" }), Object.defineProperty(this, "fatal", { value: this._fatal }), Object.defineProperty(this, "ignoreBOM", { value: this._ignoreBOM });
}
Nr.prototype = {
  decode: function(i, s) {
    var h;
    typeof i == "object" && i instanceof ArrayBuffer ? h = new Uint8Array(i) : typeof i == "object" && "buffer" in i && i.buffer instanceof ArrayBuffer ? h = new Uint8Array(
      i.buffer,
      i.byteOffset,
      i.byteLength
    ) : h = new Uint8Array(0), s = Yr(s), this._streaming || (this._decoder = new On({ fatal: this._fatal }), this._BOMseen = !1), this._streaming = Boolean(s.stream);
    for (var p = new Te(h), f = [], M; !p.endOfStream() && (M = this._decoder.handler(p, p.read()), M !== hr); )
      M !== null && (Array.isArray(M) ? f.push.apply(f, M) : f.push(M));
    if (!this._streaming) {
      do {
        if (M = this._decoder.handler(p, p.read()), M === hr)
          break;
        M !== null && (Array.isArray(M) ? f.push.apply(f, M) : f.push(M));
      } while (!p.endOfStream());
      this._decoder = null;
    }
    return f.length && ["utf-8"].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen && (f[0] === 65279 ? (this._BOMseen = !0, f.shift()) : this._BOMseen = !0), Dn(f);
  }
};
function Rr(n, i) {
  if (!(this instanceof Rr))
    return new Rr(n, i);
  if (n = n !== void 0 ? String(n).toLowerCase() : Tr, n !== Tr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  i = Yr(i), this._streaming = !1, this._encoder = null, this._options = { fatal: Boolean(i.fatal) }, Object.defineProperty(this, "encoding", { value: "utf-8" });
}
Rr.prototype = {
  encode: function(i, s) {
    i = i ? String(i) : "", s = Yr(s), this._streaming || (this._encoder = new kn(this._options)), this._streaming = Boolean(s.stream);
    for (var h = [], p = new Te(Cn(i)), f; !p.endOfStream() && (f = this._encoder.handler(p, p.read()), f !== hr); )
      Array.isArray(f) ? h.push.apply(h, f) : h.push(f);
    if (!this._streaming) {
      for (; f = this._encoder.handler(p, p.read()), f !== hr; )
        Array.isArray(f) ? h.push.apply(h, f) : h.push(f);
      this._encoder = null;
    }
    return new Uint8Array(h);
  }
};
function On(n) {
  var i = n.fatal, s = 0, h = 0, p = 0, f = 128, M = 191;
  this.handler = function(v, B) {
    if (B === Lr && p !== 0)
      return p = 0, we(i);
    if (B === Lr)
      return hr;
    if (p === 0) {
      if (Ht(B, 0, 127))
        return B;
      if (Ht(B, 194, 223))
        p = 1, s = B - 192;
      else if (Ht(B, 224, 239))
        B === 224 && (f = 160), B === 237 && (M = 159), p = 2, s = B - 224;
      else if (Ht(B, 240, 244))
        B === 240 && (f = 144), B === 244 && (M = 143), p = 3, s = B - 240;
      else
        return we(i);
      return s = s << 6 * p, null;
    }
    if (!Ht(B, f, M))
      return s = p = h = 0, f = 128, M = 191, v.prepend(B), we(i);
    if (f = 128, M = 191, h += 1, s += B - 128 << 6 * (p - h), h !== p)
      return null;
    var I = s;
    return s = p = h = 0, I;
  };
}
function kn(n) {
  n.fatal, this.handler = function(i, s) {
    if (s === Lr)
      return hr;
    if (Ht(s, 0, 127))
      return s;
    var h, p;
    Ht(s, 128, 2047) ? (h = 1, p = 192) : Ht(s, 2048, 65535) ? (h = 2, p = 224) : Ht(s, 65536, 1114111) && (h = 3, p = 240);
    for (var f = [(s >> 6 * h) + p]; h > 0; ) {
      var M = s >> 6 * (h - 1);
      f.push(128 | M & 63), h -= 1;
    }
    return f;
  };
}
const jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextEncoder: Rr,
  TextDecoder: Nr
}, Symbol.toStringTag, { value: "Module" })), Pn = /* @__PURE__ */ Je(jn);
var zn = jt && jt.__createBinding || (Object.create ? function(n, i, s, h) {
  h === void 0 && (h = s), Object.defineProperty(n, h, { enumerable: !0, get: function() {
    return i[s];
  } });
} : function(n, i, s, h) {
  h === void 0 && (h = s), n[h] = i[s];
}), $n = jt && jt.__setModuleDefault || (Object.create ? function(n, i) {
  Object.defineProperty(n, "default", { enumerable: !0, value: i });
} : function(n, i) {
  n.default = i;
}), $t = jt && jt.__decorate || function(n, i, s, h) {
  var p = arguments.length, f = p < 3 ? i : h === null ? h = Object.getOwnPropertyDescriptor(i, s) : h, M;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    f = Reflect.decorate(n, i, s, h);
  else
    for (var v = n.length - 1; v >= 0; v--)
      (M = n[v]) && (f = (p < 3 ? M(f) : p > 3 ? M(i, s, f) : M(i, s)) || f);
  return p > 3 && f && Object.defineProperty(i, s, f), f;
}, Zn = jt && jt.__importStar || function(n) {
  if (n && n.__esModule)
    return n;
  var i = {};
  if (n != null)
    for (var s in n)
      s !== "default" && Object.hasOwnProperty.call(n, s) && zn(i, n, s);
  return $n(i, n), i;
}, li = jt && jt.__importDefault || function(n) {
  return n && n.__esModule ? n : { default: n };
};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.deserializeUnchecked = Ut.deserialize = Ut.serialize = Ut.BinaryReader = Ut.BinaryWriter = Ut.BorshError = _e = Ut.baseDecode = di = Ut.baseEncode = void 0;
const Jt = li(ai.exports), ci = li(Rn), qn = Zn(Pn), Gn = typeof TextDecoder != "function" ? qn.TextDecoder : TextDecoder, Wn = new Gn("utf-8", { fatal: !0 });
function Yn(n) {
  return typeof n == "string" && (n = Buffer.from(n, "utf8")), ci.default.encode(Buffer.from(n));
}
var di = Ut.baseEncode = Yn;
function Vn(n) {
  return Buffer.from(ci.default.decode(n));
}
var _e = Ut.baseDecode = Vn;
const ve = 1024;
class Nt extends Error {
  constructor(i) {
    super(i), this.fieldPath = [], this.originalMessage = i;
  }
  addToFieldPath(i) {
    this.fieldPath.splice(0, 0, i), this.message = this.originalMessage + ": " + this.fieldPath.join(".");
  }
}
Ut.BorshError = Nt;
class pi {
  constructor() {
    this.buf = Buffer.alloc(ve), this.length = 0;
  }
  maybeResize() {
    this.buf.length < 16 + this.length && (this.buf = Buffer.concat([this.buf, Buffer.alloc(ve)]));
  }
  writeU8(i) {
    this.maybeResize(), this.buf.writeUInt8(i, this.length), this.length += 1;
  }
  writeU16(i) {
    this.maybeResize(), this.buf.writeUInt16LE(i, this.length), this.length += 2;
  }
  writeU32(i) {
    this.maybeResize(), this.buf.writeUInt32LE(i, this.length), this.length += 4;
  }
  writeU64(i) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Jt.default(i).toArray("le", 8)));
  }
  writeU128(i) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Jt.default(i).toArray("le", 16)));
  }
  writeU256(i) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Jt.default(i).toArray("le", 32)));
  }
  writeU512(i) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Jt.default(i).toArray("le", 64)));
  }
  writeBuffer(i) {
    this.buf = Buffer.concat([
      Buffer.from(this.buf.subarray(0, this.length)),
      i,
      Buffer.alloc(ve)
    ]), this.length += i.length;
  }
  writeString(i) {
    this.maybeResize();
    const s = Buffer.from(i, "utf8");
    this.writeU32(s.length), this.writeBuffer(s);
  }
  writeFixedArray(i) {
    this.writeBuffer(Buffer.from(i));
  }
  writeArray(i, s) {
    this.maybeResize(), this.writeU32(i.length);
    for (const h of i)
      this.maybeResize(), s(h);
  }
  toArray() {
    return this.buf.subarray(0, this.length);
  }
}
Ut.BinaryWriter = pi;
function Zt(n, i, s) {
  const h = s.value;
  s.value = function(...p) {
    try {
      return h.apply(this, p);
    } catch (f) {
      if (f instanceof RangeError) {
        const M = f.code;
        if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(M) >= 0)
          throw new Nt("Reached the end of buffer when deserializing");
      }
      throw f;
    }
  };
}
class Ct {
  constructor(i) {
    this.buf = i, this.offset = 0;
  }
  readU8() {
    const i = this.buf.readUInt8(this.offset);
    return this.offset += 1, i;
  }
  readU16() {
    const i = this.buf.readUInt16LE(this.offset);
    return this.offset += 2, i;
  }
  readU32() {
    const i = this.buf.readUInt32LE(this.offset);
    return this.offset += 4, i;
  }
  readU64() {
    const i = this.readBuffer(8);
    return new Jt.default(i, "le");
  }
  readU128() {
    const i = this.readBuffer(16);
    return new Jt.default(i, "le");
  }
  readU256() {
    const i = this.readBuffer(32);
    return new Jt.default(i, "le");
  }
  readU512() {
    const i = this.readBuffer(64);
    return new Jt.default(i, "le");
  }
  readBuffer(i) {
    if (this.offset + i > this.buf.length)
      throw new Nt(`Expected buffer length ${i} isn't within bounds`);
    const s = this.buf.slice(this.offset, this.offset + i);
    return this.offset += i, s;
  }
  readString() {
    const i = this.readU32(), s = this.readBuffer(i);
    try {
      return Wn.decode(s);
    } catch (h) {
      throw new Nt(`Error decoding UTF-8 string: ${h}`);
    }
  }
  readFixedArray(i) {
    return new Uint8Array(this.readBuffer(i));
  }
  readArray(i) {
    const s = this.readU32(), h = Array();
    for (let p = 0; p < s; ++p)
      h.push(i());
    return h;
  }
}
$t([
  Zt
], Ct.prototype, "readU8", null);
$t([
  Zt
], Ct.prototype, "readU16", null);
$t([
  Zt
], Ct.prototype, "readU32", null);
$t([
  Zt
], Ct.prototype, "readU64", null);
$t([
  Zt
], Ct.prototype, "readU128", null);
$t([
  Zt
], Ct.prototype, "readU256", null);
$t([
  Zt
], Ct.prototype, "readU512", null);
$t([
  Zt
], Ct.prototype, "readString", null);
$t([
  Zt
], Ct.prototype, "readFixedArray", null);
$t([
  Zt
], Ct.prototype, "readArray", null);
Ut.BinaryReader = Ct;
function mi(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function rr(n, i, s, h, p) {
  try {
    if (typeof h == "string")
      p[`write${mi(h)}`](s);
    else if (h instanceof Array)
      if (typeof h[0] == "number") {
        if (s.length !== h[0])
          throw new Nt(`Expecting byte array of length ${h[0]}, but got ${s.length} bytes`);
        p.writeFixedArray(s);
      } else if (h.length === 2 && typeof h[1] == "number") {
        if (s.length !== h[1])
          throw new Nt(`Expecting byte array of length ${h[1]}, but got ${s.length} bytes`);
        for (let f = 0; f < h[1]; f++)
          rr(n, null, s[f], h[0], p);
      } else
        p.writeArray(s, (f) => {
          rr(n, i, f, h[0], p);
        });
    else if (h.kind !== void 0)
      switch (h.kind) {
        case "option": {
          s == null ? p.writeU8(0) : (p.writeU8(1), rr(n, i, s, h.type, p));
          break;
        }
        case "map": {
          p.writeU32(s.size), s.forEach((f, M) => {
            rr(n, i, M, h.key, p), rr(n, i, f, h.value, p);
          });
          break;
        }
        default:
          throw new Nt(`FieldType ${h} unrecognized`);
      }
    else
      yi(n, s, p);
  } catch (f) {
    throw f instanceof Nt && f.addToFieldPath(i), f;
  }
}
function yi(n, i, s) {
  if (typeof i.borshSerialize == "function") {
    i.borshSerialize(s);
    return;
  }
  const h = n.get(i.constructor);
  if (!h)
    throw new Nt(`Class ${i.constructor.name} is missing in schema`);
  if (h.kind === "struct")
    h.fields.map(([p, f]) => {
      rr(n, p, i[p], f, s);
    });
  else if (h.kind === "enum") {
    const p = i[h.field];
    for (let f = 0; f < h.values.length; ++f) {
      const [M, v] = h.values[f];
      if (M === p) {
        s.writeU8(f), rr(n, M, i[M], v, s);
        break;
      }
    }
  } else
    throw new Nt(`Unexpected schema kind: ${h.kind} for ${i.constructor.name}`);
}
function Hn(n, i, s = pi) {
  const h = new s();
  return yi(n, i, h), h.toArray();
}
Ut.serialize = Hn;
function er(n, i, s, h) {
  try {
    if (typeof s == "string")
      return h[`read${mi(s)}`]();
    if (s instanceof Array) {
      if (typeof s[0] == "number")
        return h.readFixedArray(s[0]);
      if (typeof s[1] == "number") {
        const p = [];
        for (let f = 0; f < s[1]; f++)
          p.push(er(n, null, s[0], h));
        return p;
      } else
        return h.readArray(() => er(n, i, s[0], h));
    }
    if (s.kind === "option")
      return h.readU8() ? er(n, i, s.type, h) : void 0;
    if (s.kind === "map") {
      let p = /* @__PURE__ */ new Map();
      const f = h.readU32();
      for (let M = 0; M < f; M++) {
        const v = er(n, i, s.key, h), B = er(n, i, s.value, h);
        p.set(v, B);
      }
      return p;
    }
    return Ne(n, s, h);
  } catch (p) {
    throw p instanceof Nt && p.addToFieldPath(i), p;
  }
}
function Ne(n, i, s) {
  if (typeof i.borshDeserialize == "function")
    return i.borshDeserialize(s);
  const h = n.get(i);
  if (!h)
    throw new Nt(`Class ${i.name} is missing in schema`);
  if (h.kind === "struct") {
    const p = {};
    for (const [f, M] of n.get(i).fields)
      p[f] = er(n, f, M, s);
    return new i(p);
  }
  if (h.kind === "enum") {
    const p = s.readU8();
    if (p >= h.values.length)
      throw new Nt(`Enum index: ${p} is out of range`);
    const [f, M] = h.values[p], v = er(n, f, M, s);
    return new i({ [f]: v });
  }
  throw new Nt(`Unexpected schema kind: ${h.kind} for ${i.constructor.name}`);
}
function Qn(n, i, s, h = Ct) {
  const p = new h(s), f = Ne(n, i, p);
  if (p.offset < s.length)
    throw new Nt(`Unexpected ${s.length - p.offset} bytes after deserialized data`);
  return f;
}
Ut.deserialize = Qn;
function Kn(n, i, s, h = Ct) {
  const p = new h(s);
  return Ne(n, i, p);
}
Ut.deserializeUnchecked = Kn;
class Jn {
  constructor() {
    kt(this, "name");
    kt(this, "connected");
    kt(this, "connecting");
    kt(this, "windowMsgStream");
    this.name = "Suiet", this.connected = !1, this.connecting = !1, this.windowMsgStream = new ui(
      mr.DAPP,
      mr.SUIET_CONTENT
    );
  }
  async connect(i) {
    return await this.windowMsgStream.post(Qt("handshake", null)), await this.windowMsgStream.post(
      Qt("dapp.connect", { permissions: i })
    );
  }
  async disconnect() {
    return await this.windowMsgStream.post(Qt("handwave", null));
  }
  async hasPermissions(i) {
    throw new Error("function not implemented yet");
  }
  async requestPermissions() {
    throw new Error("function not implemented yet");
  }
  async executeMoveCall(i) {
    return await this.windowMsgStream.post(
      Qt("dapp.requestTransaction", {
        type: hi.MOVE_CALL,
        data: i
      })
    );
  }
  async executeSerializedMoveCall(i) {
    throw new Error("function not implemented yet");
  }
  async getAccounts() {
    return await this.windowMsgStream.post(
      Qt("dapp.getAccounts", null)
    );
  }
  async signMessage(i) {
    const s = { message: di(i.message) }, h = await this.windowMsgStream.post(
      Qt("dapp.signMessage", s)
    );
    if (h.error)
      return h;
    const p = h.data;
    return {
      ...h,
      data: {
        signature: _e(p.signature),
        signedMessage: _e(p.signedMessage)
      }
    };
  }
  async getPublicKey() {
    return await this.windowMsgStream.post(Qt("dapp.getPublicKey", null));
  }
}
var nr = globalThis && globalThis.__classPrivateFieldSet || function(n, i, s, h, p) {
  if (h === "m")
    throw new TypeError("Private method is not writable");
  if (h === "a" && !p)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof i == "function" ? n !== i || !p : !i.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return h === "a" ? p.call(n, s) : p ? p.value = s : i.set(n, s), s;
}, or = globalThis && globalThis.__classPrivateFieldGet || function(n, i, s, h) {
  if (s === "a" && !h)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof i == "function" ? n !== i || !h : !i.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return s === "m" ? h : s === "a" ? h.call(n) : h ? h.value : i.get(n);
}, Er, _r, Ar, Br, Ir, Sr;
class Re {
  constructor(i) {
    Er.set(this, void 0), _r.set(this, void 0), Ar.set(this, void 0), Br.set(this, void 0), Ir.set(this, void 0), Sr.set(this, void 0), new.target === Re && Object.freeze(this), nr(this, Er, i.address, "f"), nr(this, _r, i.publicKey, "f"), nr(this, Ar, i.chains, "f"), nr(this, Br, i.features, "f"), nr(this, Ir, i.label, "f"), nr(this, Sr, i.icon, "f");
  }
  get address() {
    return or(this, Er, "f");
  }
  get publicKey() {
    return or(this, _r, "f").slice();
  }
  get chains() {
    return or(this, Ar, "f").slice();
  }
  get features() {
    return or(this, Br, "f").slice();
  }
  get label() {
    return or(this, Ir, "f");
  }
  get icon() {
    return or(this, Sr, "f");
  }
}
Er = /* @__PURE__ */ new WeakMap(), _r = /* @__PURE__ */ new WeakMap(), Ar = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new WeakMap();
var wi = "sui:devnet", Xn = "sui:testnet", to = "sui:localnet", ro = [
  wi,
  Xn,
  to
];
const eo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMjQiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8zMDVfMTI1MTYpIi8+PHBhdGggZD0iTTUxLjUgNDMuNmMtMy45IDAtNy42LTMuOS05LjUtNi40LTEuOSAyLjUtNS42IDYuNC05LjUgNi40LTQgMC03LjctMy45LTkuNS02LjQtMS44IDIuNS01LjUgNi40LTkuNSA2LjQtLjggMC0xLjUtLjYtMS41LTEuNSAwLS44LjctMS41IDEuNS0xLjUgMy4yIDAgNy4xLTUuMSA4LjItNi45LjMtLjQuOC0uNyAxLjMtLjdzMSAuMiAxLjMuN2MxLjEgMS44IDUgNi45IDguMiA2LjkgMy4xIDAgNy4xLTUuMSA4LjItNi45LjMtLjQuOC0uNyAxLjMtLjdzMSAuMiAxLjIuN2MxLjEgMS44IDUgNi45IDguMiA2LjkuOSAwIDEuNi43IDEuNiAxLjUgMCAuOS0uNiAxLjUtMS41IDEuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNTEuNSA1Mi4zYy0zLjkgMC03LjYtMy45LTkuNS02LjQtMS45IDIuNS01LjYgNi40LTkuNSA2LjQtNCAwLTcuNy0zLjktOS41LTYuNC0xLjggMi41LTUuNSA2LjQtOS41IDYuNC0uOCAwLTEuNS0uNi0xLjUtMS41IDAtLjguNy0xLjUgMS41LTEuNSAzLjIgMCA3LjEtNS4xIDguMi02LjkuMy0uNC44LS43IDEuMy0uN3MxIC4zIDEuMy43YzEuMSAxLjggNSA2LjkgOC4yIDYuOSAzLjEgMCA3LjEtNS4xIDguMi02LjkuMy0uNC44LS43IDEuMy0uN3MxIC4zIDEuMi43YzEuMSAxLjggNSA2LjkgOC4yIDYuOS45IDAgMS42LjcgMS42IDEuNSAwIC45LS42IDEuNS0xLjUgMS41ek0xNC42IDM2LjdjLS44IDAtMS40LS41LTEuNi0xLjNsLS4zLTMuNmMwLTEwLjkgOC45LTE5LjggMTkuOC0xOS44IDExIDAgMTkuOCA4LjkgMTkuOCAxOS44bC0uMyAzLjZjLS4xLjgtLjkgMS40LTEuNyAxLjItLjktLjEtMS41LS45LTEuMy0xLjhsLjMtM2MwLTkuMi03LjUtMTYuOC0xNi44LTE2LjgtOS4yIDAtMTYuNyA3LjUtMTYuNyAxNi44bC4yIDMuMWMuMi44LS4zIDEuNi0xLjEgMS44aC0uM3oiIGZpbGw9IiNmZmYiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMzA1XzEyNTE2IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDUyLjc1ODAzIDUxLjM1OCAtNTEuNDM5NDcgNTIuODQxNzIgMCA3LjQwNykiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDU4REQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2N0M4RkYiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";
var Ae = /* @__PURE__ */ ((n) => (n.VIEW_ACCOUNT = "viewAccount", n.SUGGEST_TX = "suggestTransactions", n))(Ae || {});
function io(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(i, s) {
    var h = n.get(i);
    h ? h.push(s) : n.set(i, [s]);
  }, off: function(i, s) {
    var h = n.get(i);
    h && (s ? h.splice(h.indexOf(s) >>> 0, 1) : n.set(i, []));
  }, emit: function(i, s) {
    var h = n.get(i);
    h && h.slice().map(function(p) {
      p(s);
    }), (h = n.get("*")) && h.slice().map(function(p) {
      p(i, s);
    });
  } };
}
class no extends Error {
  constructor(s, h = {}, p = "BizError", f = -1) {
    super(s);
    kt(this, "name");
    kt(this, "code");
    kt(this, "details");
    this.name = p, this.code = f, this.details = h;
  }
  toString() {
    return `[${this.name}:${this.code}]: ${this.message}`;
  }
}
class Ce extends no {
  constructor(i = "User rejection", s) {
    super(i, s, Ce.name, -4005);
  }
}
var Cr, Dr, Pt, Vt, yr, Kt, Or, kr, jr, Pr, zr, vi, fr, Fr, $r, gi, Zr, Mi;
class oo {
  constructor() {
    Tt(this, zr);
    Tt(this, fr);
    Tt(this, $r);
    Tt(this, Zr);
    Tt(this, Cr, "Suiet");
    Tt(this, Dr, "1.0.0");
    Tt(this, Pt, "disconnected");
    Tt(this, Vt, null);
    Tt(this, yr, void 0);
    Tt(this, Kt, void 0);
    Tt(this, Or, (i, s) => (At(this, Kt).on(i, s), () => At(this, Kt).off(i, s)));
    Tt(this, kr, async (i) => {
      if (At(this, Pt) === "connecting")
        throw new Error(
          "Existed connection is pending, please do not make duplicated calls"
        );
      if (console.log("this.#connectStatus", At(this, Pt)), At(this, Pt) === "disconnected") {
        Yt(this, Pt, "connecting");
        try {
          if (!await tr(this, fr, Fr).call(this, "dapp.connect", {
            permissions: [Ae.SUGGEST_TX, Ae.VIEW_ACCOUNT]
          }))
            throw new Ce();
          Yt(this, Pt, "connected");
        } catch (h) {
          throw console.log("connect error", h), Yt(this, Pt, "disconnected"), h;
        }
      }
      console.log("this.#getAccounts");
      const [s] = await tr(this, zr, vi).call(this);
      return At(this, Vt) && At(this, Vt).address === s.address ? { accounts: this.accounts } : (Yt(this, Vt, new Re({
        address: s.address,
        publicKey: qr.Buffer.from(s.publicKey, "base64"),
        chains: ro,
        features: [
          "standard:connect",
          "sui:signAndExecuteTransaction"
        ]
      })), At(this, Kt).emit("change", { accounts: this.accounts }), { accounts: this.accounts });
    });
    Tt(this, jr, async () => {
      Yt(this, Pt, "disconnected"), Yt(this, Vt, null), At(this, Kt).all.clear();
    });
    Tt(this, Pr, async (i) => {
      const s = "dapp.signAndExecuteTransaction";
      return await tr(this, fr, Fr).call(this, s, {
        transaction: i.transaction
      });
    });
    Yt(this, Kt, io()), Yt(this, yr, new ui(
      mr.DAPP,
      mr.SUIET_CONTENT
    ));
  }
  get version() {
    return At(this, Dr);
  }
  get name() {
    return At(this, Cr);
  }
  get icon() {
    return eo;
  }
  get chains() {
    return [wi];
  }
  get accounts() {
    return At(this, Vt) ? [At(this, Vt)] : [];
  }
  get features() {
    return {
      ["standard:connect"]: {
        version: "1.0.0",
        connect: At(this, kr)
      },
      ["standard:disconnect"]: {
        version: "1.0.0",
        disconnect: At(this, jr)
      },
      ["standard:events"]: {
        version: "1.0.0",
        on: At(this, Or)
      },
      ["sui:signAndExecuteTransaction"]: {
        version: "1.0.0",
        signAndExecuteTransaction: At(this, Pr)
      }
    };
  }
}
Cr = new WeakMap(), Dr = new WeakMap(), Pt = new WeakMap(), Vt = new WeakMap(), yr = new WeakMap(), Kt = new WeakMap(), Or = new WeakMap(), kr = new WeakMap(), jr = new WeakMap(), Pr = new WeakMap(), zr = new WeakSet(), vi = async function() {
  const i = "dapp.getAccountsInfo";
  return await tr(this, fr, Fr).call(this, i, null);
}, fr = new WeakSet(), Fr = async function(i, s, h = {
  nullable: !1
}) {
  const p = await At(this, yr).post(Qt(i, s));
  return tr(this, $r, gi).call(this, p, i), h != null && h.nullable || tr(this, Zr, Mi).call(this, p, i), p.data;
}, $r = new WeakSet(), gi = function(i, s) {
  var h, p;
  if (i.error) {
    const f = (p = (h = i.error) == null ? void 0 : h.msg) != null ? p : "Unknown Error";
    throw console.error(Ke(`${s} failed`), f), new Error(f);
  }
}, Zr = new WeakSet(), Mi = function(i, s) {
  if (i.data === null) {
    const h = "Response data is null";
    throw console.error(Ke(`${s} failed`), h), new Error(h);
  }
};
function so(n) {
  n.Buffer = qr.Buffer;
}
function fo(n) {
  var i;
  n.navigator.wallets = (i = n.navigator.wallets) != null ? i : [], n.navigator.wallets.push(({ register: s }) => {
    s(new oo());
  });
}
so(window);
Object.defineProperty(window, "__suiet__", {
  enumerable: !1,
  configurable: !1,
  value: new Jn()
});
fo(window);
