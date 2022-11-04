var te = Object.defineProperty;
var re = (e, n, o) => n in e ? te(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o;
var Y = (e, n, o) => (re(e, typeof n != "symbol" ? n + "" : n, o), o), jt = (e, n, o) => {
  if (!n.has(e))
    throw TypeError("Cannot " + o);
};
var T = (e, n, o) => (jt(e, n, "read from private field"), o ? o.call(e) : n.get(e)), C = (e, n, o) => {
  if (n.has(e))
    throw TypeError("Cannot add the same private member more than once");
  n instanceof WeakSet ? n.add(e) : n.set(e, o);
}, k = (e, n, o, c) => (jt(e, n, "write to private field"), c ? c.call(e, o) : n.set(e, o), o);
var V = (e, n, o) => (jt(e, n, "access private method"), o);
var zt = {}, Ut = {};
Ut.byteLength = ie;
Ut.toByteArray = ue;
Ut.fromByteArray = ae;
var D = [], _ = [], ee = typeof Uint8Array < "u" ? Uint8Array : Array, Dt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var q = 0, ne = Dt.length; q < ne; ++q)
  D[q] = Dt[q], _[Dt.charCodeAt(q)] = q;
_["-".charCodeAt(0)] = 62;
_["_".charCodeAt(0)] = 63;
function xr(e) {
  var n = e.length;
  if (n % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var o = e.indexOf("=");
  o === -1 && (o = n);
  var c = o === n ? 0 : 4 - o % 4;
  return [o, c];
}
function ie(e) {
  var n = xr(e), o = n[0], c = n[1];
  return (o + c) * 3 / 4 - c;
}
function oe(e, n, o) {
  return (n + o) * 3 / 4 - o;
}
function ue(e) {
  var n, o = xr(e), c = o[0], f = o[1], l = new ee(oe(e, c, f)), p = 0, s = f > 0 ? c - 4 : c, d;
  for (d = 0; d < s; d += 4)
    n = _[e.charCodeAt(d)] << 18 | _[e.charCodeAt(d + 1)] << 12 | _[e.charCodeAt(d + 2)] << 6 | _[e.charCodeAt(d + 3)], l[p++] = n >> 16 & 255, l[p++] = n >> 8 & 255, l[p++] = n & 255;
  return f === 2 && (n = _[e.charCodeAt(d)] << 2 | _[e.charCodeAt(d + 1)] >> 4, l[p++] = n & 255), f === 1 && (n = _[e.charCodeAt(d)] << 10 | _[e.charCodeAt(d + 1)] << 4 | _[e.charCodeAt(d + 2)] >> 2, l[p++] = n >> 8 & 255, l[p++] = n & 255), l;
}
function ce(e) {
  return D[e >> 18 & 63] + D[e >> 12 & 63] + D[e >> 6 & 63] + D[e & 63];
}
function se(e, n, o) {
  for (var c, f = [], l = n; l < o; l += 3)
    c = (e[l] << 16 & 16711680) + (e[l + 1] << 8 & 65280) + (e[l + 2] & 255), f.push(ce(c));
  return f.join("");
}
function ae(e) {
  for (var n, o = e.length, c = o % 3, f = [], l = 16383, p = 0, s = o - c; p < s; p += l)
    f.push(se(e, p, p + l > s ? s : p + l));
  return c === 1 ? (n = e[o - 1], f.push(
    D[n >> 2] + D[n << 4 & 63] + "=="
  )) : c === 2 && (n = (e[o - 2] << 8) + e[o - 1], f.push(
    D[n >> 10] + D[n >> 4 & 63] + D[n << 2 & 63] + "="
  )), f.join("");
}
var Zt = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
Zt.read = function(e, n, o, c, f) {
  var l, p, s = f * 8 - c - 1, d = (1 << s) - 1, w = d >> 1, m = -7, x = o ? f - 1 : 0, E = o ? -1 : 1, I = e[n + x];
  for (x += E, l = I & (1 << -m) - 1, I >>= -m, m += s; m > 0; l = l * 256 + e[n + x], x += E, m -= 8)
    ;
  for (p = l & (1 << -m) - 1, l >>= -m, m += c; m > 0; p = p * 256 + e[n + x], x += E, m -= 8)
    ;
  if (l === 0)
    l = 1 - w;
  else {
    if (l === d)
      return p ? NaN : (I ? -1 : 1) * (1 / 0);
    p = p + Math.pow(2, c), l = l - w;
  }
  return (I ? -1 : 1) * p * Math.pow(2, l - c);
};
Zt.write = function(e, n, o, c, f, l) {
  var p, s, d, w = l * 8 - f - 1, m = (1 << w) - 1, x = m >> 1, E = f === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, I = c ? 0 : l - 1, F = c ? 1 : -1, b = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (s = isNaN(n) ? 1 : 0, p = m) : (p = Math.floor(Math.log(n) / Math.LN2), n * (d = Math.pow(2, -p)) < 1 && (p--, d *= 2), p + x >= 1 ? n += E / d : n += E * Math.pow(2, 1 - x), n * d >= 2 && (p++, d /= 2), p + x >= m ? (s = 0, p = m) : p + x >= 1 ? (s = (n * d - 1) * Math.pow(2, f), p = p + x) : (s = n * Math.pow(2, x - 1) * Math.pow(2, f), p = 0)); f >= 8; e[o + I] = s & 255, I += F, s /= 256, f -= 8)
    ;
  for (p = p << f | s, w += f; w > 0; e[o + I] = p & 255, I += F, p /= 256, w -= 8)
    ;
  e[o + I - F] |= b * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(e) {
  const n = Ut, o = Zt, c = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  e.Buffer = s, e.SlowBuffer = H, e.INSPECT_MAX_BYTES = 50;
  const f = 2147483647;
  e.kMaxLength = f, s.TYPED_ARRAY_SUPPORT = l(), !s.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function l() {
    try {
      const i = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(i, t), i.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(s.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (!!s.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(s.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (!!s.isBuffer(this))
        return this.byteOffset;
    }
  });
  function p(i) {
    if (i > f)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const t = new Uint8Array(i);
    return Object.setPrototypeOf(t, s.prototype), t;
  }
  function s(i, t, r) {
    if (typeof i == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return x(i);
    }
    return d(i, t, r);
  }
  s.poolSize = 8192;
  function d(i, t, r) {
    if (typeof i == "string")
      return E(i, t);
    if (ArrayBuffer.isView(i))
      return F(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if (j(i, ArrayBuffer) || i && j(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (j(i, SharedArrayBuffer) || i && j(i.buffer, SharedArrayBuffer)))
      return b(i, t, r);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const u = i.valueOf && i.valueOf();
    if (u != null && u !== i)
      return s.from(u, t, r);
    const a = at(i);
    if (a)
      return a;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return s.from(i[Symbol.toPrimitive]("string"), t, r);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  s.from = function(i, t, r) {
    return d(i, t, r);
  }, Object.setPrototypeOf(s.prototype, Uint8Array.prototype), Object.setPrototypeOf(s, Uint8Array);
  function w(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function m(i, t, r) {
    return w(i), i <= 0 ? p(i) : t !== void 0 ? typeof r == "string" ? p(i).fill(t, r) : p(i).fill(t) : p(i);
  }
  s.alloc = function(i, t, r) {
    return m(i, t, r);
  };
  function x(i) {
    return w(i), p(i < 0 ? 0 : R(i) | 0);
  }
  s.allocUnsafe = function(i) {
    return x(i);
  }, s.allocUnsafeSlow = function(i) {
    return x(i);
  };
  function E(i, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !s.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    const r = Kt(i, t) | 0;
    let u = p(r);
    const a = u.write(i, t);
    return a !== r && (u = u.slice(0, a)), u;
  }
  function I(i) {
    const t = i.length < 0 ? 0 : R(i.length) | 0, r = p(t);
    for (let u = 0; u < t; u += 1)
      r[u] = i[u] & 255;
    return r;
  }
  function F(i) {
    if (j(i, Uint8Array)) {
      const t = new Uint8Array(i);
      return b(t.buffer, t.byteOffset, t.byteLength);
    }
    return I(i);
  }
  function b(i, t, r) {
    if (t < 0 || i.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < t + (r || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let u;
    return t === void 0 && r === void 0 ? u = new Uint8Array(i) : r === void 0 ? u = new Uint8Array(i, t) : u = new Uint8Array(i, t, r), Object.setPrototypeOf(u, s.prototype), u;
  }
  function at(i) {
    if (s.isBuffer(i)) {
      const t = R(i.length) | 0, r = p(t);
      return r.length === 0 || i.copy(r, 0, 0, t), r;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || _t(i.length) ? p(0) : I(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return I(i.data);
  }
  function R(i) {
    if (i >= f)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
    return i | 0;
  }
  function H(i) {
    return +i != i && (i = 0), s.alloc(+i);
  }
  s.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== s.prototype;
  }, s.compare = function(t, r) {
    if (j(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), j(r, Uint8Array) && (r = s.from(r, r.offset, r.byteLength)), !s.isBuffer(t) || !s.isBuffer(r))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === r)
      return 0;
    let u = t.length, a = r.length;
    for (let h = 0, y = Math.min(u, a); h < y; ++h)
      if (t[h] !== r[h]) {
        u = t[h], a = r[h];
        break;
      }
    return u < a ? -1 : a < u ? 1 : 0;
  }, s.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
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
  }, s.concat = function(t, r) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return s.alloc(0);
    let u;
    if (r === void 0)
      for (r = 0, u = 0; u < t.length; ++u)
        r += t[u].length;
    const a = s.allocUnsafe(r);
    let h = 0;
    for (u = 0; u < t.length; ++u) {
      let y = t[u];
      if (j(y, Uint8Array))
        h + y.length > a.length ? (s.isBuffer(y) || (y = s.from(y)), y.copy(a, h)) : Uint8Array.prototype.set.call(
          a,
          y,
          h
        );
      else if (s.isBuffer(y))
        y.copy(a, h);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      h += y.length;
    }
    return a;
  };
  function Kt(i, t) {
    if (s.isBuffer(i))
      return i.length;
    if (ArrayBuffer.isView(i) || j(i, ArrayBuffer))
      return i.byteLength;
    if (typeof i != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
      );
    const r = i.length, u = arguments.length > 2 && arguments[2] === !0;
    if (!u && r === 0)
      return 0;
    let a = !1;
    for (; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;
        case "utf8":
        case "utf-8":
          return Nt(i).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return r * 2;
        case "hex":
          return r >>> 1;
        case "base64":
          return lr(i).length;
        default:
          if (a)
            return u ? -1 : Nt(i).length;
          t = ("" + t).toLowerCase(), a = !0;
      }
  }
  s.byteLength = Kt;
  function jr(i, t, r) {
    let u = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t))
      return "";
    for (i || (i = "utf8"); ; )
      switch (i) {
        case "hex":
          return zr(this, t, r);
        case "utf8":
        case "utf-8":
          return er(this, t, r);
        case "ascii":
          return Gr(this, t, r);
        case "latin1":
        case "binary":
          return $r(this, t, r);
        case "base64":
          return Wr(this, t, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Zr(this, t, r);
        default:
          if (u)
            throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), u = !0;
      }
  }
  s.prototype._isBuffer = !0;
  function Z(i, t, r) {
    const u = i[t];
    i[t] = i[r], i[r] = u;
  }
  s.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let r = 0; r < t; r += 2)
      Z(this, r, r + 1);
    return this;
  }, s.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let r = 0; r < t; r += 4)
      Z(this, r, r + 3), Z(this, r + 1, r + 2);
    return this;
  }, s.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let r = 0; r < t; r += 8)
      Z(this, r, r + 7), Z(this, r + 1, r + 6), Z(this, r + 2, r + 5), Z(this, r + 3, r + 4);
    return this;
  }, s.prototype.toString = function() {
    const t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? er(this, 0, t) : jr.apply(this, arguments);
  }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(t) {
    if (!s.isBuffer(t))
      throw new TypeError("Argument must be a Buffer");
    return this === t ? !0 : s.compare(this, t) === 0;
  }, s.prototype.inspect = function() {
    let t = "";
    const r = e.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (t += " ... "), "<Buffer " + t + ">";
  }, c && (s.prototype[c] = s.prototype.inspect), s.prototype.compare = function(t, r, u, a, h) {
    if (j(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), !s.isBuffer(t))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (r === void 0 && (r = 0), u === void 0 && (u = t ? t.length : 0), a === void 0 && (a = 0), h === void 0 && (h = this.length), r < 0 || u > t.length || a < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (a >= h && r >= u)
      return 0;
    if (a >= h)
      return -1;
    if (r >= u)
      return 1;
    if (r >>>= 0, u >>>= 0, a >>>= 0, h >>>= 0, this === t)
      return 0;
    let y = h - a, g = u - r;
    const L = Math.min(y, g), B = this.slice(a, h), v = t.slice(r, u);
    for (let A = 0; A < L; ++A)
      if (B[A] !== v[A]) {
        y = B[A], g = v[A];
        break;
      }
    return y < g ? -1 : g < y ? 1 : 0;
  };
  function tr(i, t, r, u, a) {
    if (i.length === 0)
      return -1;
    if (typeof r == "string" ? (u = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, _t(r) && (r = a ? 0 : i.length - 1), r < 0 && (r = i.length + r), r >= i.length) {
      if (a)
        return -1;
      r = i.length - 1;
    } else if (r < 0)
      if (a)
        r = 0;
      else
        return -1;
    if (typeof t == "string" && (t = s.from(t, u)), s.isBuffer(t))
      return t.length === 0 ? -1 : rr(i, t, r, u, a);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? a ? Uint8Array.prototype.indexOf.call(i, t, r) : Uint8Array.prototype.lastIndexOf.call(i, t, r) : rr(i, [t], r, u, a);
    throw new TypeError("val must be string, number or Buffer");
  }
  function rr(i, t, r, u, a) {
    let h = 1, y = i.length, g = t.length;
    if (u !== void 0 && (u = String(u).toLowerCase(), u === "ucs2" || u === "ucs-2" || u === "utf16le" || u === "utf-16le")) {
      if (i.length < 2 || t.length < 2)
        return -1;
      h = 2, y /= 2, g /= 2, r /= 2;
    }
    function L(v, A) {
      return h === 1 ? v[A] : v.readUInt16BE(A * h);
    }
    let B;
    if (a) {
      let v = -1;
      for (B = r; B < y; B++)
        if (L(i, B) === L(t, v === -1 ? 0 : B - v)) {
          if (v === -1 && (v = B), B - v + 1 === g)
            return v * h;
        } else
          v !== -1 && (B -= B - v), v = -1;
    } else
      for (r + g > y && (r = y - g), B = r; B >= 0; B--) {
        let v = !0;
        for (let A = 0; A < g; A++)
          if (L(i, B + A) !== L(t, A)) {
            v = !1;
            break;
          }
        if (v)
          return B;
      }
    return -1;
  }
  s.prototype.includes = function(t, r, u) {
    return this.indexOf(t, r, u) !== -1;
  }, s.prototype.indexOf = function(t, r, u) {
    return tr(this, t, r, u, !0);
  }, s.prototype.lastIndexOf = function(t, r, u) {
    return tr(this, t, r, u, !1);
  };
  function Dr(i, t, r, u) {
    r = Number(r) || 0;
    const a = i.length - r;
    u ? (u = Number(u), u > a && (u = a)) : u = a;
    const h = t.length;
    u > h / 2 && (u = h / 2);
    let y;
    for (y = 0; y < u; ++y) {
      const g = parseInt(t.substr(y * 2, 2), 16);
      if (_t(g))
        return y;
      i[r + y] = g;
    }
    return y;
  }
  function Rr(i, t, r, u) {
    return ft(Nt(t, i.length - r), i, r, u);
  }
  function kr(i, t, r, u) {
    return ft(Xr(t), i, r, u);
  }
  function Or(i, t, r, u) {
    return ft(lr(t), i, r, u);
  }
  function Pr(i, t, r, u) {
    return ft(qr(t, i.length - r), i, r, u);
  }
  s.prototype.write = function(t, r, u, a) {
    if (r === void 0)
      a = "utf8", u = this.length, r = 0;
    else if (u === void 0 && typeof r == "string")
      a = r, u = this.length, r = 0;
    else if (isFinite(r))
      r = r >>> 0, isFinite(u) ? (u = u >>> 0, a === void 0 && (a = "utf8")) : (a = u, u = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - r;
    if ((u === void 0 || u > h) && (u = h), t.length > 0 && (u < 0 || r < 0) || r > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    a || (a = "utf8");
    let y = !1;
    for (; ; )
      switch (a) {
        case "hex":
          return Dr(this, t, r, u);
        case "utf8":
        case "utf-8":
          return Rr(this, t, r, u);
        case "ascii":
        case "latin1":
        case "binary":
          return kr(this, t, r, u);
        case "base64":
          return Or(this, t, r, u);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Pr(this, t, r, u);
        default:
          if (y)
            throw new TypeError("Unknown encoding: " + a);
          a = ("" + a).toLowerCase(), y = !0;
      }
  }, s.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Wr(i, t, r) {
    return t === 0 && r === i.length ? n.fromByteArray(i) : n.fromByteArray(i.slice(t, r));
  }
  function er(i, t, r) {
    r = Math.min(i.length, r);
    const u = [];
    let a = t;
    for (; a < r; ) {
      const h = i[a];
      let y = null, g = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (a + g <= r) {
        let L, B, v, A;
        switch (g) {
          case 1:
            h < 128 && (y = h);
            break;
          case 2:
            L = i[a + 1], (L & 192) === 128 && (A = (h & 31) << 6 | L & 63, A > 127 && (y = A));
            break;
          case 3:
            L = i[a + 1], B = i[a + 2], (L & 192) === 128 && (B & 192) === 128 && (A = (h & 15) << 12 | (L & 63) << 6 | B & 63, A > 2047 && (A < 55296 || A > 57343) && (y = A));
            break;
          case 4:
            L = i[a + 1], B = i[a + 2], v = i[a + 3], (L & 192) === 128 && (B & 192) === 128 && (v & 192) === 128 && (A = (h & 15) << 18 | (L & 63) << 12 | (B & 63) << 6 | v & 63, A > 65535 && A < 1114112 && (y = A));
        }
      }
      y === null ? (y = 65533, g = 1) : y > 65535 && (y -= 65536, u.push(y >>> 10 & 1023 | 55296), y = 56320 | y & 1023), u.push(y), a += g;
    }
    return Yr(u);
  }
  const nr = 4096;
  function Yr(i) {
    const t = i.length;
    if (t <= nr)
      return String.fromCharCode.apply(String, i);
    let r = "", u = 0;
    for (; u < t; )
      r += String.fromCharCode.apply(
        String,
        i.slice(u, u += nr)
      );
    return r;
  }
  function Gr(i, t, r) {
    let u = "";
    r = Math.min(i.length, r);
    for (let a = t; a < r; ++a)
      u += String.fromCharCode(i[a] & 127);
    return u;
  }
  function $r(i, t, r) {
    let u = "";
    r = Math.min(i.length, r);
    for (let a = t; a < r; ++a)
      u += String.fromCharCode(i[a]);
    return u;
  }
  function zr(i, t, r) {
    const u = i.length;
    (!t || t < 0) && (t = 0), (!r || r < 0 || r > u) && (r = u);
    let a = "";
    for (let h = t; h < r; ++h)
      a += Jr[i[h]];
    return a;
  }
  function Zr(i, t, r) {
    const u = i.slice(t, r);
    let a = "";
    for (let h = 0; h < u.length - 1; h += 2)
      a += String.fromCharCode(u[h] + u[h + 1] * 256);
    return a;
  }
  s.prototype.slice = function(t, r) {
    const u = this.length;
    t = ~~t, r = r === void 0 ? u : ~~r, t < 0 ? (t += u, t < 0 && (t = 0)) : t > u && (t = u), r < 0 ? (r += u, r < 0 && (r = 0)) : r > u && (r = u), r < t && (r = t);
    const a = this.subarray(t, r);
    return Object.setPrototypeOf(a, s.prototype), a;
  };
  function M(i, t, r) {
    if (i % 1 !== 0 || i < 0)
      throw new RangeError("offset is not uint");
    if (i + t > r)
      throw new RangeError("Trying to access beyond buffer length");
  }
  s.prototype.readUintLE = s.prototype.readUIntLE = function(t, r, u) {
    t = t >>> 0, r = r >>> 0, u || M(t, r, this.length);
    let a = this[t], h = 1, y = 0;
    for (; ++y < r && (h *= 256); )
      a += this[t + y] * h;
    return a;
  }, s.prototype.readUintBE = s.prototype.readUIntBE = function(t, r, u) {
    t = t >>> 0, r = r >>> 0, u || M(t, r, this.length);
    let a = this[t + --r], h = 1;
    for (; r > 0 && (h *= 256); )
      a += this[t + --r] * h;
    return a;
  }, s.prototype.readUint8 = s.prototype.readUInt8 = function(t, r) {
    return t = t >>> 0, r || M(t, 1, this.length), this[t];
  }, s.prototype.readUint16LE = s.prototype.readUInt16LE = function(t, r) {
    return t = t >>> 0, r || M(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, s.prototype.readUint16BE = s.prototype.readUInt16BE = function(t, r) {
    return t = t >>> 0, r || M(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, s.prototype.readUint32LE = s.prototype.readUInt32LE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, s.prototype.readUint32BE = s.prototype.readUInt32BE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, s.prototype.readBigUInt64LE = W(function(t) {
    t = t >>> 0, X(t, "offset");
    const r = this[t], u = this[t + 7];
    (r === void 0 || u === void 0) && nt(t, this.length - 8);
    const a = r + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, h = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + u * 2 ** 24;
    return BigInt(a) + (BigInt(h) << BigInt(32));
  }), s.prototype.readBigUInt64BE = W(function(t) {
    t = t >>> 0, X(t, "offset");
    const r = this[t], u = this[t + 7];
    (r === void 0 || u === void 0) && nt(t, this.length - 8);
    const a = r * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], h = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + u;
    return (BigInt(a) << BigInt(32)) + BigInt(h);
  }), s.prototype.readIntLE = function(t, r, u) {
    t = t >>> 0, r = r >>> 0, u || M(t, r, this.length);
    let a = this[t], h = 1, y = 0;
    for (; ++y < r && (h *= 256); )
      a += this[t + y] * h;
    return h *= 128, a >= h && (a -= Math.pow(2, 8 * r)), a;
  }, s.prototype.readIntBE = function(t, r, u) {
    t = t >>> 0, r = r >>> 0, u || M(t, r, this.length);
    let a = r, h = 1, y = this[t + --a];
    for (; a > 0 && (h *= 256); )
      y += this[t + --a] * h;
    return h *= 128, y >= h && (y -= Math.pow(2, 8 * r)), y;
  }, s.prototype.readInt8 = function(t, r) {
    return t = t >>> 0, r || M(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, s.prototype.readInt16LE = function(t, r) {
    t = t >>> 0, r || M(t, 2, this.length);
    const u = this[t] | this[t + 1] << 8;
    return u & 32768 ? u | 4294901760 : u;
  }, s.prototype.readInt16BE = function(t, r) {
    t = t >>> 0, r || M(t, 2, this.length);
    const u = this[t + 1] | this[t] << 8;
    return u & 32768 ? u | 4294901760 : u;
  }, s.prototype.readInt32LE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, s.prototype.readInt32BE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, s.prototype.readBigInt64LE = W(function(t) {
    t = t >>> 0, X(t, "offset");
    const r = this[t], u = this[t + 7];
    (r === void 0 || u === void 0) && nt(t, this.length - 8);
    const a = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (u << 24);
    return (BigInt(a) << BigInt(32)) + BigInt(r + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
  }), s.prototype.readBigInt64BE = W(function(t) {
    t = t >>> 0, X(t, "offset");
    const r = this[t], u = this[t + 7];
    (r === void 0 || u === void 0) && nt(t, this.length - 8);
    const a = (r << 24) + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
    return (BigInt(a) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + u);
  }), s.prototype.readFloatLE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), o.read(this, t, !0, 23, 4);
  }, s.prototype.readFloatBE = function(t, r) {
    return t = t >>> 0, r || M(t, 4, this.length), o.read(this, t, !1, 23, 4);
  }, s.prototype.readDoubleLE = function(t, r) {
    return t = t >>> 0, r || M(t, 8, this.length), o.read(this, t, !0, 52, 8);
  }, s.prototype.readDoubleBE = function(t, r) {
    return t = t >>> 0, r || M(t, 8, this.length), o.read(this, t, !1, 52, 8);
  };
  function N(i, t, r, u, a, h) {
    if (!s.isBuffer(i))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > a || t < h)
      throw new RangeError('"value" argument is out of bounds');
    if (r + u > i.length)
      throw new RangeError("Index out of range");
  }
  s.prototype.writeUintLE = s.prototype.writeUIntLE = function(t, r, u, a) {
    if (t = +t, r = r >>> 0, u = u >>> 0, !a) {
      const g = Math.pow(2, 8 * u) - 1;
      N(this, t, r, u, g, 0);
    }
    let h = 1, y = 0;
    for (this[r] = t & 255; ++y < u && (h *= 256); )
      this[r + y] = t / h & 255;
    return r + u;
  }, s.prototype.writeUintBE = s.prototype.writeUIntBE = function(t, r, u, a) {
    if (t = +t, r = r >>> 0, u = u >>> 0, !a) {
      const g = Math.pow(2, 8 * u) - 1;
      N(this, t, r, u, g, 0);
    }
    let h = u - 1, y = 1;
    for (this[r + h] = t & 255; --h >= 0 && (y *= 256); )
      this[r + h] = t / y & 255;
    return r + u;
  }, s.prototype.writeUint8 = s.prototype.writeUInt8 = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 1, 255, 0), this[r] = t & 255, r + 1;
  }, s.prototype.writeUint16LE = s.prototype.writeUInt16LE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 2, 65535, 0), this[r] = t & 255, this[r + 1] = t >>> 8, r + 2;
  }, s.prototype.writeUint16BE = s.prototype.writeUInt16BE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 2, 65535, 0), this[r] = t >>> 8, this[r + 1] = t & 255, r + 2;
  }, s.prototype.writeUint32LE = s.prototype.writeUInt32LE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 4, 4294967295, 0), this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = t & 255, r + 4;
  }, s.prototype.writeUint32BE = s.prototype.writeUInt32BE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 4, 4294967295, 0), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255, r + 4;
  };
  function ir(i, t, r, u, a) {
    fr(t, u, a, i, r, 7);
    let h = Number(t & BigInt(4294967295));
    i[r++] = h, h = h >> 8, i[r++] = h, h = h >> 8, i[r++] = h, h = h >> 8, i[r++] = h;
    let y = Number(t >> BigInt(32) & BigInt(4294967295));
    return i[r++] = y, y = y >> 8, i[r++] = y, y = y >> 8, i[r++] = y, y = y >> 8, i[r++] = y, r;
  }
  function or(i, t, r, u, a) {
    fr(t, u, a, i, r, 7);
    let h = Number(t & BigInt(4294967295));
    i[r + 7] = h, h = h >> 8, i[r + 6] = h, h = h >> 8, i[r + 5] = h, h = h >> 8, i[r + 4] = h;
    let y = Number(t >> BigInt(32) & BigInt(4294967295));
    return i[r + 3] = y, y = y >> 8, i[r + 2] = y, y = y >> 8, i[r + 1] = y, y = y >> 8, i[r] = y, r + 8;
  }
  s.prototype.writeBigUInt64LE = W(function(t, r = 0) {
    return ir(this, t, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), s.prototype.writeBigUInt64BE = W(function(t, r = 0) {
    return or(this, t, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), s.prototype.writeIntLE = function(t, r, u, a) {
    if (t = +t, r = r >>> 0, !a) {
      const L = Math.pow(2, 8 * u - 1);
      N(this, t, r, u, L - 1, -L);
    }
    let h = 0, y = 1, g = 0;
    for (this[r] = t & 255; ++h < u && (y *= 256); )
      t < 0 && g === 0 && this[r + h - 1] !== 0 && (g = 1), this[r + h] = (t / y >> 0) - g & 255;
    return r + u;
  }, s.prototype.writeIntBE = function(t, r, u, a) {
    if (t = +t, r = r >>> 0, !a) {
      const L = Math.pow(2, 8 * u - 1);
      N(this, t, r, u, L - 1, -L);
    }
    let h = u - 1, y = 1, g = 0;
    for (this[r + h] = t & 255; --h >= 0 && (y *= 256); )
      t < 0 && g === 0 && this[r + h + 1] !== 0 && (g = 1), this[r + h] = (t / y >> 0) - g & 255;
    return r + u;
  }, s.prototype.writeInt8 = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[r] = t & 255, r + 1;
  }, s.prototype.writeInt16LE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 2, 32767, -32768), this[r] = t & 255, this[r + 1] = t >>> 8, r + 2;
  }, s.prototype.writeInt16BE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 2, 32767, -32768), this[r] = t >>> 8, this[r + 1] = t & 255, r + 2;
  }, s.prototype.writeInt32LE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 4, 2147483647, -2147483648), this[r] = t & 255, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24, r + 4;
  }, s.prototype.writeInt32BE = function(t, r, u) {
    return t = +t, r = r >>> 0, u || N(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = t & 255, r + 4;
  }, s.prototype.writeBigInt64LE = W(function(t, r = 0) {
    return ir(this, t, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), s.prototype.writeBigInt64BE = W(function(t, r = 0) {
    return or(this, t, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ur(i, t, r, u, a, h) {
    if (r + u > i.length)
      throw new RangeError("Index out of range");
    if (r < 0)
      throw new RangeError("Index out of range");
  }
  function cr(i, t, r, u, a) {
    return t = +t, r = r >>> 0, a || ur(i, t, r, 4), o.write(i, t, r, u, 23, 4), r + 4;
  }
  s.prototype.writeFloatLE = function(t, r, u) {
    return cr(this, t, r, !0, u);
  }, s.prototype.writeFloatBE = function(t, r, u) {
    return cr(this, t, r, !1, u);
  };
  function sr(i, t, r, u, a) {
    return t = +t, r = r >>> 0, a || ur(i, t, r, 8), o.write(i, t, r, u, 52, 8), r + 8;
  }
  s.prototype.writeDoubleLE = function(t, r, u) {
    return sr(this, t, r, !0, u);
  }, s.prototype.writeDoubleBE = function(t, r, u) {
    return sr(this, t, r, !1, u);
  }, s.prototype.copy = function(t, r, u, a) {
    if (!s.isBuffer(t))
      throw new TypeError("argument should be a Buffer");
    if (u || (u = 0), !a && a !== 0 && (a = this.length), r >= t.length && (r = t.length), r || (r = 0), a > 0 && a < u && (a = u), a === u || t.length === 0 || this.length === 0)
      return 0;
    if (r < 0)
      throw new RangeError("targetStart out of bounds");
    if (u < 0 || u >= this.length)
      throw new RangeError("Index out of range");
    if (a < 0)
      throw new RangeError("sourceEnd out of bounds");
    a > this.length && (a = this.length), t.length - r < a - u && (a = t.length - r + u);
    const h = a - u;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(r, u, a) : Uint8Array.prototype.set.call(
      t,
      this.subarray(u, a),
      r
    ), h;
  }, s.prototype.fill = function(t, r, u, a) {
    if (typeof t == "string") {
      if (typeof r == "string" ? (a = r, r = 0, u = this.length) : typeof u == "string" && (a = u, u = this.length), a !== void 0 && typeof a != "string")
        throw new TypeError("encoding must be a string");
      if (typeof a == "string" && !s.isEncoding(a))
        throw new TypeError("Unknown encoding: " + a);
      if (t.length === 1) {
        const y = t.charCodeAt(0);
        (a === "utf8" && y < 128 || a === "latin1") && (t = y);
      }
    } else
      typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (r < 0 || this.length < r || this.length < u)
      throw new RangeError("Out of range index");
    if (u <= r)
      return this;
    r = r >>> 0, u = u === void 0 ? this.length : u >>> 0, t || (t = 0);
    let h;
    if (typeof t == "number")
      for (h = r; h < u; ++h)
        this[h] = t;
    else {
      const y = s.isBuffer(t) ? t : s.from(t, a), g = y.length;
      if (g === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (h = 0; h < u - r; ++h)
        this[h + r] = y[h % g];
    }
    return this;
  };
  const Q = {};
  function Ct(i, t, r) {
    Q[i] = class extends r {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: t.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${i}]`, this.stack, delete this.name;
      }
      get code() {
        return i;
      }
      set code(a) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: a,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${i}]: ${this.message}`;
      }
    };
  }
  Ct(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(i) {
      return i ? `${i} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Ct(
    "ERR_INVALID_ARG_TYPE",
    function(i, t) {
      return `The "${i}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  ), Ct(
    "ERR_OUT_OF_RANGE",
    function(i, t, r) {
      let u = `The value of "${i}" is out of range.`, a = r;
      return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? a = ar(String(r)) : typeof r == "bigint" && (a = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (a = ar(a)), a += "n"), u += ` It must be ${t}. Received ${a}`, u;
    },
    RangeError
  );
  function ar(i) {
    let t = "", r = i.length;
    const u = i[0] === "-" ? 1 : 0;
    for (; r >= u + 4; r -= 3)
      t = `_${i.slice(r - 3, r)}${t}`;
    return `${i.slice(0, r)}${t}`;
  }
  function Vr(i, t, r) {
    X(t, "offset"), (i[t] === void 0 || i[t + r] === void 0) && nt(t, i.length - (r + 1));
  }
  function fr(i, t, r, u, a, h) {
    if (i > r || i < t) {
      const y = typeof t == "bigint" ? "n" : "";
      let g;
      throw h > 3 ? t === 0 || t === BigInt(0) ? g = `>= 0${y} and < 2${y} ** ${(h + 1) * 8}${y}` : g = `>= -(2${y} ** ${(h + 1) * 8 - 1}${y}) and < 2 ** ${(h + 1) * 8 - 1}${y}` : g = `>= ${t}${y} and <= ${r}${y}`, new Q.ERR_OUT_OF_RANGE("value", g, i);
    }
    Vr(u, a, h);
  }
  function X(i, t) {
    if (typeof i != "number")
      throw new Q.ERR_INVALID_ARG_TYPE(t, "number", i);
  }
  function nt(i, t, r) {
    throw Math.floor(i) !== i ? (X(i, r), new Q.ERR_OUT_OF_RANGE(r || "offset", "an integer", i)) : t < 0 ? new Q.ERR_BUFFER_OUT_OF_BOUNDS() : new Q.ERR_OUT_OF_RANGE(
      r || "offset",
      `>= ${r ? 1 : 0} and <= ${t}`,
      i
    );
  }
  const Hr = /[^+/0-9A-Za-z-_]/g;
  function Qr(i) {
    if (i = i.split("=")[0], i = i.trim().replace(Hr, ""), i.length < 2)
      return "";
    for (; i.length % 4 !== 0; )
      i = i + "=";
    return i;
  }
  function Nt(i, t) {
    t = t || 1 / 0;
    let r;
    const u = i.length;
    let a = null;
    const h = [];
    for (let y = 0; y < u; ++y) {
      if (r = i.charCodeAt(y), r > 55295 && r < 57344) {
        if (!a) {
          if (r > 56319) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (y + 1 === u) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          a = r;
          continue;
        }
        if (r < 56320) {
          (t -= 3) > -1 && h.push(239, 191, 189), a = r;
          continue;
        }
        r = (a - 55296 << 10 | r - 56320) + 65536;
      } else
        a && (t -= 3) > -1 && h.push(239, 191, 189);
      if (a = null, r < 128) {
        if ((t -= 1) < 0)
          break;
        h.push(r);
      } else if (r < 2048) {
        if ((t -= 2) < 0)
          break;
        h.push(
          r >> 6 | 192,
          r & 63 | 128
        );
      } else if (r < 65536) {
        if ((t -= 3) < 0)
          break;
        h.push(
          r >> 12 | 224,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else if (r < 1114112) {
        if ((t -= 4) < 0)
          break;
        h.push(
          r >> 18 | 240,
          r >> 12 & 63 | 128,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return h;
  }
  function Xr(i) {
    const t = [];
    for (let r = 0; r < i.length; ++r)
      t.push(i.charCodeAt(r) & 255);
    return t;
  }
  function qr(i, t) {
    let r, u, a;
    const h = [];
    for (let y = 0; y < i.length && !((t -= 2) < 0); ++y)
      r = i.charCodeAt(y), u = r >> 8, a = r % 256, h.push(a), h.push(u);
    return h;
  }
  function lr(i) {
    return n.toByteArray(Qr(i));
  }
  function ft(i, t, r, u) {
    let a;
    for (a = 0; a < u && !(a + r >= t.length || a >= i.length); ++a)
      t[a + r] = i[a];
    return a;
  }
  function j(i, t) {
    return i instanceof t || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === t.name;
  }
  function _t(i) {
    return i !== i;
  }
  const Jr = function() {
    const i = "0123456789abcdef", t = new Array(256);
    for (let r = 0; r < 16; ++r) {
      const u = r * 16;
      for (let a = 0; a < 16; ++a)
        t[u + a] = i[r] + i[a];
    }
    return t;
  }();
  function W(i) {
    return typeof BigInt > "u" ? Kr : i;
  }
  function Kr() {
    throw new Error("BigInt not supported");
  }
})(zt);
var Pt = function(e, n) {
  return Pt = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(o, c) {
    o.__proto__ = c;
  } || function(o, c) {
    for (var f in c)
      Object.prototype.hasOwnProperty.call(c, f) && (o[f] = c[f]);
  }, Pt(e, n);
};
function Vt(e, n) {
  if (typeof n != "function" && n !== null)
    throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
  Pt(e, n);
  function o() {
    this.constructor = e;
  }
  e.prototype = n === null ? Object.create(n) : (o.prototype = n.prototype, new o());
}
function fe(e, n, o, c) {
  function f(l) {
    return l instanceof o ? l : new o(function(p) {
      p(l);
    });
  }
  return new (o || (o = Promise))(function(l, p) {
    function s(m) {
      try {
        w(c.next(m));
      } catch (x) {
        p(x);
      }
    }
    function d(m) {
      try {
        w(c.throw(m));
      } catch (x) {
        p(x);
      }
    }
    function w(m) {
      m.done ? l(m.value) : f(m.value).then(s, d);
    }
    w((c = c.apply(e, n || [])).next());
  });
}
function Ir(e, n) {
  var o = { label: 0, sent: function() {
    if (l[0] & 1)
      throw l[1];
    return l[1];
  }, trys: [], ops: [] }, c, f, l, p;
  return p = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (p[Symbol.iterator] = function() {
    return this;
  }), p;
  function s(w) {
    return function(m) {
      return d([w, m]);
    };
  }
  function d(w) {
    if (c)
      throw new TypeError("Generator is already executing.");
    for (; o; )
      try {
        if (c = 1, f && (l = w[0] & 2 ? f.return : w[0] ? f.throw || ((l = f.return) && l.call(f), 0) : f.next) && !(l = l.call(f, w[1])).done)
          return l;
        switch (f = 0, l && (w = [w[0] & 2, l.value]), w[0]) {
          case 0:
          case 1:
            l = w;
            break;
          case 4:
            return o.label++, { value: w[1], done: !1 };
          case 5:
            o.label++, f = w[1], w = [0];
            continue;
          case 7:
            w = o.ops.pop(), o.trys.pop();
            continue;
          default:
            if (l = o.trys, !(l = l.length > 0 && l[l.length - 1]) && (w[0] === 6 || w[0] === 2)) {
              o = 0;
              continue;
            }
            if (w[0] === 3 && (!l || w[1] > l[0] && w[1] < l[3])) {
              o.label = w[1];
              break;
            }
            if (w[0] === 6 && o.label < l[1]) {
              o.label = l[1], l = w;
              break;
            }
            if (l && o.label < l[2]) {
              o.label = l[2], o.ops.push(w);
              break;
            }
            l[2] && o.ops.pop(), o.trys.pop();
            continue;
        }
        w = n.call(e, o);
      } catch (m) {
        w = [6, m], f = 0;
      } finally {
        c = l = 0;
      }
    if (w[0] & 5)
      throw w[1];
    return { value: w[0] ? w[1] : void 0, done: !0 };
  }
}
function it(e) {
  var n = typeof Symbol == "function" && Symbol.iterator, o = n && e[n], c = 0;
  if (o)
    return o.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function() {
        return e && c >= e.length && (e = void 0), { value: e && e[c++], done: !e };
      }
    };
  throw new TypeError(n ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function et(e, n) {
  var o = typeof Symbol == "function" && e[Symbol.iterator];
  if (!o)
    return e;
  var c = o.call(e), f, l = [], p;
  try {
    for (; (n === void 0 || n-- > 0) && !(f = c.next()).done; )
      l.push(f.value);
  } catch (s) {
    p = { error: s };
  } finally {
    try {
      f && !f.done && (o = c.return) && o.call(c);
    } finally {
      if (p)
        throw p.error;
    }
  }
  return l;
}
function ot(e, n, o) {
  if (o || arguments.length === 2)
    for (var c = 0, f = n.length, l; c < f; c++)
      (l || !(c in n)) && (l || (l = Array.prototype.slice.call(n, 0, c)), l[c] = n[c]);
  return e.concat(l || Array.prototype.slice.call(n));
}
function tt(e) {
  return this instanceof tt ? (this.v = e, this) : new tt(e);
}
function le(e, n, o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var c = o.apply(e, n || []), f, l = [];
  return f = {}, p("next"), p("throw"), p("return"), f[Symbol.asyncIterator] = function() {
    return this;
  }, f;
  function p(E) {
    c[E] && (f[E] = function(I) {
      return new Promise(function(F, b) {
        l.push([E, I, F, b]) > 1 || s(E, I);
      });
    });
  }
  function s(E, I) {
    try {
      d(c[E](I));
    } catch (F) {
      x(l[0][3], F);
    }
  }
  function d(E) {
    E.value instanceof tt ? Promise.resolve(E.value.v).then(w, m) : x(l[0][2], E);
  }
  function w(E) {
    s("next", E);
  }
  function m(E) {
    s("throw", E);
  }
  function x(E, I) {
    E(I), l.shift(), l.length && s(l[0][0], l[0][1]);
  }
}
function he(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = e[Symbol.asyncIterator], o;
  return n ? n.call(e) : (e = typeof it == "function" ? it(e) : e[Symbol.iterator](), o = {}, c("next"), c("throw"), c("return"), o[Symbol.asyncIterator] = function() {
    return this;
  }, o);
  function c(l) {
    o[l] = e[l] && function(p) {
      return new Promise(function(s, d) {
        p = e[l](p), f(s, d, p.done, p.value);
      });
    };
  }
  function f(l, p, s, d) {
    Promise.resolve(d).then(function(w) {
      l({ value: w, done: s });
    }, p);
  }
}
function S(e) {
  return typeof e == "function";
}
function Ar(e) {
  var n = function(c) {
    Error.call(c), c.stack = new Error().stack;
  }, o = e(n);
  return o.prototype = Object.create(Error.prototype), o.prototype.constructor = o, o;
}
var Rt = Ar(function(e) {
  return function(o) {
    e(this), this.message = o ? o.length + ` errors occurred during unsubscription:
` + o.map(function(c, f) {
      return f + 1 + ") " + c.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = o;
  };
});
function hr(e, n) {
  if (e) {
    var o = e.indexOf(n);
    0 <= o && e.splice(o, 1);
  }
}
var Ht = function() {
  function e(n) {
    this.initialTeardown = n, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var n, o, c, f, l;
    if (!this.closed) {
      this.closed = !0;
      var p = this._parentage;
      if (p)
        if (this._parentage = null, Array.isArray(p))
          try {
            for (var s = it(p), d = s.next(); !d.done; d = s.next()) {
              var w = d.value;
              w.remove(this);
            }
          } catch (b) {
            n = { error: b };
          } finally {
            try {
              d && !d.done && (o = s.return) && o.call(s);
            } finally {
              if (n)
                throw n.error;
            }
          }
        else
          p.remove(this);
      var m = this.initialTeardown;
      if (S(m))
        try {
          m();
        } catch (b) {
          l = b instanceof Rt ? b.errors : [b];
        }
      var x = this._finalizers;
      if (x) {
        this._finalizers = null;
        try {
          for (var E = it(x), I = E.next(); !I.done; I = E.next()) {
            var F = I.value;
            try {
              pr(F);
            } catch (b) {
              l = l != null ? l : [], b instanceof Rt ? l = ot(ot([], et(l)), et(b.errors)) : l.push(b);
            }
          }
        } catch (b) {
          c = { error: b };
        } finally {
          try {
            I && !I.done && (f = E.return) && f.call(E);
          } finally {
            if (c)
              throw c.error;
          }
        }
      }
      if (l)
        throw new Rt(l);
    }
  }, e.prototype.add = function(n) {
    var o;
    if (n && n !== this)
      if (this.closed)
        pr(n);
      else {
        if (n instanceof e) {
          if (n.closed || n._hasParent(this))
            return;
          n._addParent(this);
        }
        (this._finalizers = (o = this._finalizers) !== null && o !== void 0 ? o : []).push(n);
      }
  }, e.prototype._hasParent = function(n) {
    var o = this._parentage;
    return o === n || Array.isArray(o) && o.includes(n);
  }, e.prototype._addParent = function(n) {
    var o = this._parentage;
    this._parentage = Array.isArray(o) ? (o.push(n), o) : o ? [o, n] : n;
  }, e.prototype._removeParent = function(n) {
    var o = this._parentage;
    o === n ? this._parentage = null : Array.isArray(o) && hr(o, n);
  }, e.prototype.remove = function(n) {
    var o = this._finalizers;
    o && hr(o, n), n instanceof e && n._removeParent(this);
  }, e.EMPTY = function() {
    var n = new e();
    return n.closed = !0, n;
  }(), e;
}();
Ht.EMPTY;
function br(e) {
  return e instanceof Ht || e && "closed" in e && S(e.remove) && S(e.add) && S(e.unsubscribe);
}
function pr(e) {
  S(e) ? e() : e.unsubscribe();
}
var Br = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, Wt = {
  setTimeout: function(e, n) {
    for (var o = [], c = 2; c < arguments.length; c++)
      o[c - 2] = arguments[c];
    var f = Wt.delegate;
    return f != null && f.setTimeout ? f.setTimeout.apply(f, ot([e, n], et(o))) : setTimeout.apply(void 0, ot([e, n], et(o)));
  },
  clearTimeout: function(e) {
    var n = Wt.delegate;
    return ((n == null ? void 0 : n.clearTimeout) || clearTimeout)(e);
  },
  delegate: void 0
};
function Sr(e) {
  Wt.setTimeout(function() {
    throw e;
  });
}
function yr() {
}
function pe(e) {
  e();
}
var Qt = function(e) {
  Vt(n, e);
  function n(o) {
    var c = e.call(this) || this;
    return c.isStopped = !1, o ? (c.destination = o, br(o) && o.add(c)) : c.destination = me, c;
  }
  return n.create = function(o, c, f) {
    return new Yt(o, c, f);
  }, n.prototype.next = function(o) {
    this.isStopped || this._next(o);
  }, n.prototype.error = function(o) {
    this.isStopped || (this.isStopped = !0, this._error(o));
  }, n.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, n.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
  }, n.prototype._next = function(o) {
    this.destination.next(o);
  }, n.prototype._error = function(o) {
    try {
      this.destination.error(o);
    } finally {
      this.unsubscribe();
    }
  }, n.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, n;
}(Ht), ye = Function.prototype.bind;
function kt(e, n) {
  return ye.call(e, n);
}
var de = function() {
  function e(n) {
    this.partialObserver = n;
  }
  return e.prototype.next = function(n) {
    var o = this.partialObserver;
    if (o.next)
      try {
        o.next(n);
      } catch (c) {
        lt(c);
      }
  }, e.prototype.error = function(n) {
    var o = this.partialObserver;
    if (o.error)
      try {
        o.error(n);
      } catch (c) {
        lt(c);
      }
    else
      lt(n);
  }, e.prototype.complete = function() {
    var n = this.partialObserver;
    if (n.complete)
      try {
        n.complete();
      } catch (o) {
        lt(o);
      }
  }, e;
}(), Yt = function(e) {
  Vt(n, e);
  function n(o, c, f) {
    var l = e.call(this) || this, p;
    if (S(o) || !o)
      p = {
        next: o != null ? o : void 0,
        error: c != null ? c : void 0,
        complete: f != null ? f : void 0
      };
    else {
      var s;
      l && Br.useDeprecatedNextContext ? (s = Object.create(o), s.unsubscribe = function() {
        return l.unsubscribe();
      }, p = {
        next: o.next && kt(o.next, s),
        error: o.error && kt(o.error, s),
        complete: o.complete && kt(o.complete, s)
      }) : p = o;
    }
    return l.destination = new de(p), l;
  }
  return n;
}(Qt);
function lt(e) {
  Sr(e);
}
function we(e) {
  throw e;
}
var me = {
  closed: !0,
  next: yr,
  error: we,
  complete: yr
}, Xt = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function ge(e) {
  return e;
}
function Ee(e) {
  return e.length === 0 ? ge : e.length === 1 ? e[0] : function(o) {
    return e.reduce(function(c, f) {
      return f(c);
    }, o);
  };
}
var z = function() {
  function e(n) {
    n && (this._subscribe = n);
  }
  return e.prototype.lift = function(n) {
    var o = new e();
    return o.source = this, o.operator = n, o;
  }, e.prototype.subscribe = function(n, o, c) {
    var f = this, l = Ie(n) ? n : new Yt(n, o, c);
    return pe(function() {
      var p = f, s = p.operator, d = p.source;
      l.add(s ? s.call(l, d) : d ? f._subscribe(l) : f._trySubscribe(l));
    }), l;
  }, e.prototype._trySubscribe = function(n) {
    try {
      return this._subscribe(n);
    } catch (o) {
      n.error(o);
    }
  }, e.prototype.forEach = function(n, o) {
    var c = this;
    return o = dr(o), new o(function(f, l) {
      var p = new Yt({
        next: function(s) {
          try {
            n(s);
          } catch (d) {
            l(d), p.unsubscribe();
          }
        },
        error: l,
        complete: f
      });
      c.subscribe(p);
    });
  }, e.prototype._subscribe = function(n) {
    var o;
    return (o = this.source) === null || o === void 0 ? void 0 : o.subscribe(n);
  }, e.prototype[Xt] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var n = [], o = 0; o < arguments.length; o++)
      n[o] = arguments[o];
    return Ee(n)(this);
  }, e.prototype.toPromise = function(n) {
    var o = this;
    return n = dr(n), new n(function(c, f) {
      var l;
      o.subscribe(function(p) {
        return l = p;
      }, function(p) {
        return f(p);
      }, function() {
        return c(l);
      });
    });
  }, e.create = function(n) {
    return new e(n);
  }, e;
}();
function dr(e) {
  var n;
  return (n = e != null ? e : Br.Promise) !== null && n !== void 0 ? n : Promise;
}
function xe(e) {
  return e && S(e.next) && S(e.error) && S(e.complete);
}
function Ie(e) {
  return e && e instanceof Qt || xe(e) && br(e);
}
function Ae(e) {
  return S(e == null ? void 0 : e.lift);
}
function Ft(e) {
  return function(n) {
    if (Ae(n))
      return n.lift(function(o) {
        try {
          return e(o, this);
        } catch (c) {
          this.error(c);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function ut(e, n, o, c, f) {
  return new be(e, n, o, c, f);
}
var be = function(e) {
  Vt(n, e);
  function n(o, c, f, l, p, s) {
    var d = e.call(this, o) || this;
    return d.onFinalize = p, d.shouldUnsubscribe = s, d._next = c ? function(w) {
      try {
        c(w);
      } catch (m) {
        o.error(m);
      }
    } : e.prototype._next, d._error = l ? function(w) {
      try {
        l(w);
      } catch (m) {
        o.error(m);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, d._complete = f ? function() {
      try {
        f();
      } catch (w) {
        o.error(w);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, d;
  }
  return n.prototype.unsubscribe = function() {
    var o;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var c = this.closed;
      e.prototype.unsubscribe.call(this), !c && ((o = this.onFinalize) === null || o === void 0 || o.call(this));
    }
  }, n;
}(Qt), Be = new z(function(e) {
  return e.complete();
}), Lr = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function Se(e) {
  return S(e == null ? void 0 : e.then);
}
function Le(e) {
  return S(e[Xt]);
}
function ve(e) {
  return Symbol.asyncIterator && S(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function Me(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Te() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Ue = Te();
function Fe(e) {
  return S(e == null ? void 0 : e[Ue]);
}
function Ce(e) {
  return le(this, arguments, function() {
    var o, c, f, l;
    return Ir(this, function(p) {
      switch (p.label) {
        case 0:
          o = e.getReader(), p.label = 1;
        case 1:
          p.trys.push([1, , 9, 10]), p.label = 2;
        case 2:
          return [4, tt(o.read())];
        case 3:
          return c = p.sent(), f = c.value, l = c.done, l ? [4, tt(void 0)] : [3, 5];
        case 4:
          return [2, p.sent()];
        case 5:
          return [4, tt(f)];
        case 6:
          return [4, p.sent()];
        case 7:
          return p.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return o.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function Ne(e) {
  return S(e == null ? void 0 : e.getReader);
}
function qt(e) {
  if (e instanceof z)
    return e;
  if (e != null) {
    if (Le(e))
      return _e(e);
    if (Lr(e))
      return je(e);
    if (Se(e))
      return De(e);
    if (ve(e))
      return vr(e);
    if (Fe(e))
      return Re(e);
    if (Ne(e))
      return ke(e);
  }
  throw Me(e);
}
function _e(e) {
  return new z(function(n) {
    var o = e[Xt]();
    if (S(o.subscribe))
      return o.subscribe(n);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function je(e) {
  return new z(function(n) {
    for (var o = 0; o < e.length && !n.closed; o++)
      n.next(e[o]);
    n.complete();
  });
}
function De(e) {
  return new z(function(n) {
    e.then(function(o) {
      n.closed || (n.next(o), n.complete());
    }, function(o) {
      return n.error(o);
    }).then(null, Sr);
  });
}
function Re(e) {
  return new z(function(n) {
    var o, c;
    try {
      for (var f = it(e), l = f.next(); !l.done; l = f.next()) {
        var p = l.value;
        if (n.next(p), n.closed)
          return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        l && !l.done && (c = f.return) && c.call(f);
      } finally {
        if (o)
          throw o.error;
      }
    }
    n.complete();
  });
}
function vr(e) {
  return new z(function(n) {
    Oe(e, n).catch(function(o) {
      return n.error(o);
    });
  });
}
function ke(e) {
  return vr(Ce(e));
}
function Oe(e, n) {
  var o, c, f, l;
  return fe(this, void 0, void 0, function() {
    var p, s;
    return Ir(this, function(d) {
      switch (d.label) {
        case 0:
          d.trys.push([0, 5, 6, 11]), o = he(e), d.label = 1;
        case 1:
          return [4, o.next()];
        case 2:
          if (c = d.sent(), !!c.done)
            return [3, 4];
          if (p = c.value, n.next(p), n.closed)
            return [2];
          d.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return s = d.sent(), f = { error: s }, [3, 11];
        case 6:
          return d.trys.push([6, , 9, 10]), c && !c.done && (l = o.return) ? [4, l.call(o)] : [3, 8];
        case 7:
          d.sent(), d.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (f)
            throw f.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return n.complete(), [2];
      }
    });
  });
}
function Pe(e, n, o, c, f) {
  c === void 0 && (c = 0), f === void 0 && (f = !1);
  var l = n.schedule(function() {
    o(), f ? e.add(this.schedule(null, c)) : this.unsubscribe();
  }, c);
  if (e.add(l), !f)
    return l;
}
var We = Ar(function(e) {
  return function() {
    e(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function Ye(e, n) {
  var o = typeof n == "object";
  return new Promise(function(c, f) {
    var l = !1, p;
    e.subscribe({
      next: function(s) {
        p = s, l = !0;
      },
      error: f,
      complete: function() {
        l ? c(p) : o ? c(n.defaultValue) : f(new We());
      }
    });
  });
}
function xt(e, n) {
  return Ft(function(o, c) {
    var f = 0;
    o.subscribe(ut(c, function(l) {
      c.next(e.call(n, l, f++));
    }));
  });
}
var Ge = Array.isArray;
function $e(e, n) {
  return Ge(n) ? e.apply(void 0, ot([], et(n))) : e(n);
}
function ze(e) {
  return xt(function(n) {
    return $e(e, n);
  });
}
function Ze(e, n, o, c, f, l, p, s) {
  var d = [], w = 0, m = 0, x = !1, E = function() {
    x && !d.length && !w && n.complete();
  }, I = function(b) {
    return w < c ? F(b) : d.push(b);
  }, F = function(b) {
    l && n.next(b), w++;
    var at = !1;
    qt(o(b, m++)).subscribe(ut(n, function(R) {
      f == null || f(R), l ? I(R) : n.next(R);
    }, function() {
      at = !0;
    }, void 0, function() {
      if (at)
        try {
          w--;
          for (var R = function() {
            var H = d.shift();
            p ? Pe(n, p, function() {
              return F(H);
            }) : F(H);
          }; d.length && w < c; )
            R();
          E();
        } catch (H) {
          n.error(H);
        }
    }));
  };
  return e.subscribe(ut(n, I, function() {
    x = !0, E();
  })), function() {
    s == null || s();
  };
}
function Mr(e, n, o) {
  return o === void 0 && (o = 1 / 0), S(n) ? Mr(function(c, f) {
    return xt(function(l, p) {
      return n(c, l, f, p);
    })(qt(e(c, f)));
  }, o) : (typeof n == "number" && (o = n), Ft(function(c, f) {
    return Ze(c, f, e, o);
  }));
}
var Ve = ["addListener", "removeListener"], He = ["addEventListener", "removeEventListener"], Qe = ["on", "off"];
function Gt(e, n, o, c) {
  if (S(o) && (c = o, o = void 0), c)
    return Gt(e, n, o).pipe(ze(c));
  var f = et(Je(e) ? He.map(function(s) {
    return function(d) {
      return e[s](n, d, o);
    };
  }) : Xe(e) ? Ve.map(wr(e, n)) : qe(e) ? Qe.map(wr(e, n)) : [], 2), l = f[0], p = f[1];
  if (!l && Lr(e))
    return Mr(function(s) {
      return Gt(s, n, o);
    })(qt(e));
  if (!l)
    throw new TypeError("Invalid event target");
  return new z(function(s) {
    var d = function() {
      for (var w = [], m = 0; m < arguments.length; m++)
        w[m] = arguments[m];
      return s.next(1 < w.length ? w : w[0]);
    };
    return l(d), function() {
      return p(d);
    };
  });
}
function wr(e, n) {
  return function(o) {
    return function(c) {
      return e[o](n, c);
    };
  };
}
function Xe(e) {
  return S(e.addListener) && S(e.removeListener);
}
function qe(e) {
  return S(e.on) && S(e.off);
}
function Je(e) {
  return S(e.addEventListener) && S(e.removeEventListener);
}
function mr(e, n) {
  return Ft(function(o, c) {
    var f = 0;
    o.subscribe(ut(c, function(l) {
      return e.call(n, l, f++) && c.next(l);
    }));
  });
}
function Ke(e) {
  return e <= 0 ? function() {
    return Be;
  } : Ft(function(n, o) {
    var c = 0;
    n.subscribe(ut(o, function(f) {
      ++c <= e && (o.next(f), e <= c && o.complete());
    }));
  });
}
class Tr {
  constructor(n, o) {
    Y(this, "msgObservable");
    Y(this, "source");
    Y(this, "target");
    if (n === o)
      throw new Error(
        "[WindowMessageStream] source and target must be different"
      );
    this.source = n, this.target = o, this.msgObservable = Gt(
      window,
      "message"
    ).pipe(
      mr(
        (c) => {
          var f;
          return c.source === window && ((f = c.data) == null ? void 0 : f.target) === this.source;
        }
      ),
      xt((c) => c.data)
    );
  }
  async post(n) {
    const o = {
      target: this.target,
      payload: n
    };
    return window.postMessage(o), await Ye(
      this.msgObservable.pipe(
        mr((c) => c.payload.id === n.id),
        xt((c) => c.payload),
        Ke(1)
      )
    );
  }
  subscribe(n) {
    this.msgObservable.subscribe(n);
  }
}
let ht;
const tn = new Uint8Array(16);
function rn() {
  if (!ht && (ht = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ht))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ht(tn);
}
const U = [];
for (let e = 0; e < 256; ++e)
  U.push((e + 256).toString(16).slice(1));
function en(e, n = 0) {
  return (U[e[n + 0]] + U[e[n + 1]] + U[e[n + 2]] + U[e[n + 3]] + "-" + U[e[n + 4]] + U[e[n + 5]] + "-" + U[e[n + 6]] + U[e[n + 7]] + "-" + U[e[n + 8]] + U[e[n + 9]] + "-" + U[e[n + 10]] + U[e[n + 11]] + U[e[n + 12]] + U[e[n + 13]] + U[e[n + 14]] + U[e[n + 15]]).toLowerCase();
}
const nn = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), gr = {
  randomUUID: nn
};
function on(e, n, o) {
  if (gr.randomUUID && !n && !e)
    return gr.randomUUID();
  e = e || {};
  const c = e.random || (e.rng || rn)();
  if (c[6] = c[6] & 15 | 64, c[8] = c[8] & 63 | 128, n) {
    o = o || 0;
    for (let f = 0; f < 16; ++f)
      n[o + f] = c[f];
    return n;
  }
  return en(c);
}
var ct = /* @__PURE__ */ ((e) => (e.DAPP = "DAPP", e.SUIET_CONTENT = "SUIET_CONTENT", e))(ct || {});
function G(e, n, o) {
  return {
    id: on(),
    funcName: e,
    payload: n,
    options: o
  };
}
function Er(e) {
  return `[SUIET_WALLET]: ${e}`;
}
var Ur = /* @__PURE__ */ ((e) => (e.MOVE_CALL = "moveCall", e.SERIALIZED_MOVE_CALL = "SERIALIZED_MOVE_CALL", e))(Ur || {});
function Ot(e) {
  return Uint8Array.from(e);
}
function un(e) {
  return Array.from(e);
}
class cn {
  constructor() {
    Y(this, "name");
    Y(this, "connected");
    Y(this, "connecting");
    Y(this, "windowMsgStream");
    this.name = "Suiet", this.connected = !1, this.connecting = !1, this.windowMsgStream = new Tr(
      ct.DAPP,
      ct.SUIET_CONTENT
    );
  }
  async connect(n) {
    return await this.windowMsgStream.post(G("handshake", null)), await this.windowMsgStream.post(
      G("dapp.connect", { permissions: n })
    );
  }
  async disconnect() {
    return await this.windowMsgStream.post(G("handwave", null));
  }
  async hasPermissions(n) {
    throw new Error("function not implemented yet");
  }
  async requestPermissions() {
    throw new Error("function not implemented yet");
  }
  async executeMoveCall(n) {
    return await this.windowMsgStream.post(
      G("dapp.requestTransaction", {
        type: Ur.MOVE_CALL,
        data: n
      })
    );
  }
  async executeSerializedMoveCall(n) {
    throw new Error("function not implemented yet");
  }
  async getAccounts() {
    return await this.windowMsgStream.post(
      G("dapp.getAccounts", null)
    );
  }
  async signMessage(n) {
    const o = {
      message: un(n.message)
    }, c = await this.windowMsgStream.post(
      G("dapp.signMessage", o)
    );
    if (c.error)
      return c;
    const f = {
      signature: Ot(c.data.signature),
      signedMessage: Ot(c.data.signedMessage)
    };
    return {
      ...c,
      data: f
    };
  }
  async getPublicKey() {
    const n = await this.windowMsgStream.post(
      G("dapp.getPublicKey", null)
    );
    return n.error ? n : {
      ...n,
      data: Ot(n.data)
    };
  }
}
var J = globalThis && globalThis.__classPrivateFieldSet || function(e, n, o, c, f) {
  if (c === "m")
    throw new TypeError("Private method is not writable");
  if (c === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof n == "function" ? e !== n || !f : !n.has(e))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return c === "a" ? f.call(e, o) : f ? f.value = o : n.set(e, o), o;
}, K = globalThis && globalThis.__classPrivateFieldGet || function(e, n, o, c) {
  if (o === "a" && !c)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof n == "function" ? e !== n || !c : !n.has(e))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return o === "m" ? c : o === "a" ? c.call(e) : c ? c.value : n.get(e);
}, pt, yt, dt, wt, mt, gt;
class Jt {
  constructor(n) {
    pt.set(this, void 0), yt.set(this, void 0), dt.set(this, void 0), wt.set(this, void 0), mt.set(this, void 0), gt.set(this, void 0), new.target === Jt && Object.freeze(this), J(this, pt, n.address, "f"), J(this, yt, n.publicKey, "f"), J(this, dt, n.chains, "f"), J(this, wt, n.features, "f"), J(this, mt, n.label, "f"), J(this, gt, n.icon, "f");
  }
  get address() {
    return K(this, pt, "f");
  }
  get publicKey() {
    return K(this, yt, "f").slice();
  }
  get chains() {
    return K(this, dt, "f").slice();
  }
  get features() {
    return K(this, wt, "f").slice();
  }
  get label() {
    return K(this, mt, "f");
  }
  get icon() {
    return K(this, gt, "f");
  }
}
pt = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap();
var Fr = "sui:devnet", sn = "sui:testnet", an = "sui:localnet", fn = [
  Fr,
  sn,
  an
];
const ln = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMjQiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8zMDVfMTI1MTYpIi8+PHBhdGggZD0iTTUxLjUgNDMuNmMtMy45IDAtNy42LTMuOS05LjUtNi40LTEuOSAyLjUtNS42IDYuNC05LjUgNi40LTQgMC03LjctMy45LTkuNS02LjQtMS44IDIuNS01LjUgNi40LTkuNSA2LjQtLjggMC0xLjUtLjYtMS41LTEuNSAwLS44LjctMS41IDEuNS0xLjUgMy4yIDAgNy4xLTUuMSA4LjItNi45LjMtLjQuOC0uNyAxLjMtLjdzMSAuMiAxLjMuN2MxLjEgMS44IDUgNi45IDguMiA2LjkgMy4xIDAgNy4xLTUuMSA4LjItNi45LjMtLjQuOC0uNyAxLjMtLjdzMSAuMiAxLjIuN2MxLjEgMS44IDUgNi45IDguMiA2LjkuOSAwIDEuNi43IDEuNiAxLjUgMCAuOS0uNiAxLjUtMS41IDEuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNTEuNSA1Mi4zYy0zLjkgMC03LjYtMy45LTkuNS02LjQtMS45IDIuNS01LjYgNi40LTkuNSA2LjQtNCAwLTcuNy0zLjktOS41LTYuNC0xLjggMi41LTUuNSA2LjQtOS41IDYuNC0uOCAwLTEuNS0uNi0xLjUtMS41IDAtLjguNy0xLjUgMS41LTEuNSAzLjIgMCA3LjEtNS4xIDguMi02LjkuMy0uNC44LS43IDEuMy0uN3MxIC4zIDEuMy43YzEuMSAxLjggNSA2LjkgOC4yIDYuOSAzLjEgMCA3LjEtNS4xIDguMi02LjkuMy0uNC44LS43IDEuMy0uN3MxIC4zIDEuMi43YzEuMSAxLjggNSA2LjkgOC4yIDYuOS45IDAgMS42LjcgMS42IDEuNSAwIC45LS42IDEuNS0xLjUgMS41ek0xNC42IDM2LjdjLS44IDAtMS40LS41LTEuNi0xLjNsLS4zLTMuNmMwLTEwLjkgOC45LTE5LjggMTkuOC0xOS44IDExIDAgMTkuOCA4LjkgMTkuOCAxOS44bC0uMyAzLjZjLS4xLjgtLjkgMS40LTEuNyAxLjItLjktLjEtMS41LS45LTEuMy0xLjhsLjMtM2MwLTkuMi03LjUtMTYuOC0xNi44LTE2LjgtOS4yIDAtMTYuNyA3LjUtMTYuNyAxNi44bC4yIDMuMWMuMi44LS4zIDEuNi0xLjEgMS44aC0uM3oiIGZpbGw9IiNmZmYiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMzA1XzEyNTE2IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDUyLjc1ODAzIDUxLjM1OCAtNTEuNDM5NDcgNTIuODQxNzIgMCA3LjQwNykiPjxzdG9wIHN0b3AtY29sb3I9IiMwMDU4REQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2N0M4RkYiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";
var $t = /* @__PURE__ */ ((e) => (e.VIEW_ACCOUNT = "viewAccount", e.SUGGEST_TX = "suggestTransactions", e))($t || {});
function hn(e) {
  return { all: e = e || /* @__PURE__ */ new Map(), on: function(n, o) {
    var c = e.get(n);
    c ? c.push(o) : e.set(n, [o]);
  }, off: function(n, o) {
    var c = e.get(n);
    c && (o ? c.splice(c.indexOf(o) >>> 0, 1) : e.set(n, []));
  }, emit: function(n, o) {
    var c = e.get(n);
    c && c.slice().map(function(f) {
      f(o);
    }), (c = e.get("*")) && c.slice().map(function(f) {
      f(n, o);
    });
  } };
}
var It, At, O, P, st, $, bt, Bt, St, Lt, vt, Cr, rt, Et, Mt, Nr, Tt, _r;
class pn {
  constructor() {
    C(this, vt);
    C(this, rt);
    C(this, Mt);
    C(this, Tt);
    C(this, It, "Suiet");
    C(this, At, "1.0.0");
    C(this, O, "disconnected");
    C(this, P, null);
    C(this, st, void 0);
    C(this, $, void 0);
    C(this, bt, (n, o) => (T(this, $).on(n, o), () => T(this, $).off(n, o)));
    C(this, Bt, async (n) => {
      if (T(this, O) === "connecting")
        throw new Error(
          "Existed connection is pending, please do not make duplicated calls"
        );
      if (T(this, O) === "disconnected") {
        k(this, O, "connecting");
        try {
          if (!await V(this, rt, Et).call(this, "dapp.connect", {
            permissions: [$t.SUGGEST_TX, $t.VIEW_ACCOUNT]
          }))
            throw new Error("User rejects approval");
          k(this, O, "connected");
        } catch (f) {
          throw k(this, O, "disconnected"), f;
        }
      }
      const [o] = await V(this, vt, Cr).call(this);
      if (T(this, P) && T(this, P).address === o.address)
        return { accounts: this.accounts };
      const c = o.publicKey.slice(2);
      return k(this, P, new Jt({
        address: o.address,
        publicKey: zt.Buffer.from(c, "hex"),
        chains: fn,
        features: [
          "standard:connect",
          "sui:signAndExecuteTransaction"
        ]
      })), T(this, $).emit("change", { accounts: this.accounts }), { accounts: this.accounts };
    });
    C(this, St, async () => {
      k(this, O, "disconnected"), k(this, P, null), T(this, $).all.clear();
    });
    C(this, Lt, async (n) => {
      const o = "dapp.signAndExecuteTransaction";
      return await V(this, rt, Et).call(this, o, {
        transaction: n.transaction
      });
    });
    k(this, $, hn()), k(this, st, new Tr(
      ct.DAPP,
      ct.SUIET_CONTENT
    ));
  }
  get version() {
    return T(this, At);
  }
  get name() {
    return T(this, It);
  }
  get icon() {
    return ln;
  }
  get chains() {
    return [Fr];
  }
  get accounts() {
    return T(this, P) ? [T(this, P)] : [];
  }
  get features() {
    return {
      ["standard:connect"]: {
        version: "1.0.0",
        connect: T(this, Bt)
      },
      ["standard:disconnect"]: {
        version: "1.0.0",
        disconnect: T(this, St)
      },
      ["standard:events"]: {
        version: "1.0.0",
        on: T(this, bt)
      },
      ["sui:signAndExecuteTransaction"]: {
        version: "1.0.0",
        signAndExecuteTransaction: T(this, Lt)
      }
    };
  }
}
It = new WeakMap(), At = new WeakMap(), O = new WeakMap(), P = new WeakMap(), st = new WeakMap(), $ = new WeakMap(), bt = new WeakMap(), Bt = new WeakMap(), St = new WeakMap(), Lt = new WeakMap(), vt = new WeakSet(), Cr = async function() {
  const n = "dapp.getAccountsInfo";
  return await V(this, rt, Et).call(this, n, null);
}, rt = new WeakSet(), Et = async function(n, o, c = {
  nullable: !1
}) {
  const f = await T(this, st).post(G(n, o));
  return V(this, Mt, Nr).call(this, f, n), c != null && c.nullable || V(this, Tt, _r).call(this, f, n), f.data;
}, Mt = new WeakSet(), Nr = function(n, o) {
  var c, f;
  if (n.error) {
    const l = (f = (c = n.error) == null ? void 0 : c.msg) != null ? f : "Unknown Error";
    throw console.error(Er(`${o} failed`), l), new Error(l);
  }
}, Tt = new WeakSet(), _r = function(n, o) {
  if (n.data === null) {
    const c = "Response data is null";
    throw console.error(Er(`${o} failed`), c), new Error(c);
  }
};
function yn(e) {
  e.Buffer = zt.Buffer;
}
function dn(e) {
  var n;
  e.navigator.wallets = (n = e.navigator.wallets) != null ? n : [], e.navigator.wallets.push(({ register: o }) => {
    o(new pn());
  });
}
yn(window);
Object.defineProperty(window, "__suiet__", {
  enumerable: !1,
  configurable: !1,
  value: new cn()
});
dn(window);
