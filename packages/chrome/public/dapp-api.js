var ce = Object.defineProperty;
var ae = (e, t, r) => t in e ? ce(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var b = (e, t, r) => (ae(e, typeof t != "symbol" ? t + "" : t, r), r);
let _;
const se = new Uint8Array(16);
function le() {
  if (!_ && (_ = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !_))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return _(se);
}
const y = [];
for (let e = 0; e < 256; ++e)
  y.push((e + 256).toString(16).slice(1));
function fe(e, t = 0) {
  return (y[e[t + 0]] + y[e[t + 1]] + y[e[t + 2]] + y[e[t + 3]] + "-" + y[e[t + 4]] + y[e[t + 5]] + "-" + y[e[t + 6]] + y[e[t + 7]] + "-" + y[e[t + 8]] + y[e[t + 9]] + "-" + y[e[t + 10]] + y[e[t + 11]] + y[e[t + 12]] + y[e[t + 13]] + y[e[t + 14]] + y[e[t + 15]]).toLowerCase();
}
const de = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Z = {
  randomUUID: de
};
function he(e, t, r) {
  if (Z.randomUUID && !t && !e)
    return Z.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || le)();
  if (n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, t) {
    r = r || 0;
    for (let o = 0; o < 16; ++o)
      t[r + o] = n[o];
    return t;
  }
  return fe(n);
}
var k = /* @__PURE__ */ ((e) => (e.DAPP = "DAPP", e.SUIET_CONTENT = "SUIET_CONTENT", e))(k || {});
function g(e, t) {
  return {
    id: he(),
    funcName: e,
    payload: t
  };
}
var D = function(e, t) {
  return D = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (r[o] = n[o]);
  }, D(e, t);
};
function q(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  D(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
function ye(e, t, r, n) {
  function o(i) {
    return i instanceof r ? i : new r(function(u) {
      u(i);
    });
  }
  return new (r || (r = Promise))(function(i, u) {
    function a(l) {
      try {
        c(n.next(l));
      } catch (v) {
        u(v);
      }
    }
    function s(l) {
      try {
        c(n.throw(l));
      } catch (v) {
        u(v);
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, s);
    }
    c((n = n.apply(e, t || [])).next());
  });
}
function z(e, t) {
  var r = { label: 0, sent: function() {
    if (i[0] & 1)
      throw i[1];
    return i[1];
  }, trys: [], ops: [] }, n, o, i, u;
  return u = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (u[Symbol.iterator] = function() {
    return this;
  }), u;
  function a(c) {
    return function(l) {
      return s([c, l]);
    };
  }
  function s(c) {
    if (n)
      throw new TypeError("Generator is already executing.");
    for (; r; )
      try {
        if (n = 1, o && (i = c[0] & 2 ? o.return : c[0] ? o.throw || ((i = o.return) && i.call(o), 0) : o.next) && !(i = i.call(o, c[1])).done)
          return i;
        switch (o = 0, i && (c = [c[0] & 2, i.value]), c[0]) {
          case 0:
          case 1:
            i = c;
            break;
          case 4:
            return r.label++, { value: c[1], done: !1 };
          case 5:
            r.label++, o = c[1], c = [0];
            continue;
          case 7:
            c = r.ops.pop(), r.trys.pop();
            continue;
          default:
            if (i = r.trys, !(i = i.length > 0 && i[i.length - 1]) && (c[0] === 6 || c[0] === 2)) {
              r = 0;
              continue;
            }
            if (c[0] === 3 && (!i || c[1] > i[0] && c[1] < i[3])) {
              r.label = c[1];
              break;
            }
            if (c[0] === 6 && r.label < i[1]) {
              r.label = i[1], i = c;
              break;
            }
            if (i && r.label < i[2]) {
              r.label = i[2], r.ops.push(c);
              break;
            }
            i[2] && r.ops.pop(), r.trys.pop();
            continue;
        }
        c = t.call(e, r);
      } catch (l) {
        c = [6, l], o = 0;
      } finally {
        n = i = 0;
      }
    if (c[0] & 5)
      throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}
function A(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, r = t && e[t], n = 0;
  if (r)
    return r.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function() {
        return e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function E(e, t) {
  var r = typeof Symbol == "function" && e[Symbol.iterator];
  if (!r)
    return e;
  var n = r.call(e), o, i = [], u;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = n.next()).done; )
      i.push(o.value);
  } catch (a) {
    u = { error: a };
  } finally {
    try {
      o && !o.done && (r = n.return) && r.call(n);
    } finally {
      if (u)
        throw u.error;
    }
  }
  return i;
}
function I(e, t, r) {
  if (r || arguments.length === 2)
    for (var n = 0, o = t.length, i; n < o; n++)
      (i || !(n in t)) && (i || (i = Array.prototype.slice.call(t, 0, n)), i[n] = t[n]);
  return e.concat(i || Array.prototype.slice.call(t));
}
function S(e) {
  return this instanceof S ? (this.v = e, this) : new S(e);
}
function pe(e, t, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(e, t || []), o, i = [];
  return o = {}, u("next"), u("throw"), u("return"), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function u(f) {
    n[f] && (o[f] = function(p) {
      return new Promise(function(m, h) {
        i.push([f, p, m, h]) > 1 || a(f, p);
      });
    });
  }
  function a(f, p) {
    try {
      s(n[f](p));
    } catch (m) {
      v(i[0][3], m);
    }
  }
  function s(f) {
    f.value instanceof S ? Promise.resolve(f.value.v).then(c, l) : v(i[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function v(f, p) {
    f(p), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function ve(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator], r;
  return t ? t.call(e) : (e = typeof A == "function" ? A(e) : e[Symbol.iterator](), r = {}, n("next"), n("throw"), n("return"), r[Symbol.asyncIterator] = function() {
    return this;
  }, r);
  function n(i) {
    r[i] = e[i] && function(u) {
      return new Promise(function(a, s) {
        u = e[i](u), o(a, s, u.done, u.value);
      });
    };
  }
  function o(i, u, a, s) {
    Promise.resolve(s).then(function(c) {
      i({ value: c, done: a });
    }, u);
  }
}
function d(e) {
  return typeof e == "function";
}
function N(e) {
  var t = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, r = e(t);
  return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
}
var U = N(function(e) {
  return function(r) {
    e(this), this.message = r ? r.length + ` errors occurred during unsubscription:
` + r.map(function(n, o) {
      return o + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = r;
  };
});
function J(e, t) {
  if (e) {
    var r = e.indexOf(t);
    0 <= r && e.splice(r, 1);
  }
}
var F = function() {
  function e(t) {
    this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return e.prototype.unsubscribe = function() {
    var t, r, n, o, i;
    if (!this.closed) {
      this.closed = !0;
      var u = this._parentage;
      if (u)
        if (this._parentage = null, Array.isArray(u))
          try {
            for (var a = A(u), s = a.next(); !s.done; s = a.next()) {
              var c = s.value;
              c.remove(this);
            }
          } catch (h) {
            t = { error: h };
          } finally {
            try {
              s && !s.done && (r = a.return) && r.call(a);
            } finally {
              if (t)
                throw t.error;
            }
          }
        else
          u.remove(this);
      var l = this.initialTeardown;
      if (d(l))
        try {
          l();
        } catch (h) {
          i = h instanceof U ? h.errors : [h];
        }
      var v = this._finalizers;
      if (v) {
        this._finalizers = null;
        try {
          for (var f = A(v), p = f.next(); !p.done; p = f.next()) {
            var m = p.value;
            try {
              Q(m);
            } catch (h) {
              i = i != null ? i : [], h instanceof U ? i = I(I([], E(i)), E(h.errors)) : i.push(h);
            }
          }
        } catch (h) {
          n = { error: h };
        } finally {
          try {
            p && !p.done && (o = f.return) && o.call(f);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (i)
        throw new U(i);
    }
  }, e.prototype.add = function(t) {
    var r;
    if (t && t !== this)
      if (this.closed)
        Q(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this))
            return;
          t._addParent(this);
        }
        (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(t);
      }
  }, e.prototype._hasParent = function(t) {
    var r = this._parentage;
    return r === t || Array.isArray(r) && r.includes(t);
  }, e.prototype._addParent = function(t) {
    var r = this._parentage;
    this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
  }, e.prototype._removeParent = function(t) {
    var r = this._parentage;
    r === t ? this._parentage = null : Array.isArray(r) && J(r, t);
  }, e.prototype.remove = function(t) {
    var r = this._finalizers;
    r && J(r, t), t instanceof e && t._removeParent(this);
  }, e.EMPTY = function() {
    var t = new e();
    return t.closed = !0, t;
  }(), e;
}();
F.EMPTY;
function ee(e) {
  return e instanceof F || e && "closed" in e && d(e.remove) && d(e.add) && d(e.unsubscribe);
}
function Q(e) {
  d(e) ? e() : e.unsubscribe();
}
var te = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, R = {
  setTimeout: function(e, t) {
    for (var r = [], n = 2; n < arguments.length; n++)
      r[n - 2] = arguments[n];
    var o = R.delegate;
    return o != null && o.setTimeout ? o.setTimeout.apply(o, I([e, t], E(r))) : setTimeout.apply(void 0, I([e, t], E(r)));
  },
  clearTimeout: function(e) {
    var t = R.delegate;
    return ((t == null ? void 0 : t.clearTimeout) || clearTimeout)(e);
  },
  delegate: void 0
};
function re(e) {
  R.setTimeout(function() {
    throw e;
  });
}
function B() {
}
function me(e) {
  e();
}
var Y = function(e) {
  q(t, e);
  function t(r) {
    var n = e.call(this) || this;
    return n.isStopped = !1, r ? (n.destination = r, ee(r) && r.add(n)) : n.destination = Se, n;
  }
  return t.create = function(r, n, o) {
    return new V(r, n, o);
  }, t.prototype.next = function(r) {
    this.isStopped || this._next(r);
  }, t.prototype.error = function(r) {
    this.isStopped || (this.isStopped = !0, this._error(r));
  }, t.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, t.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
  }, t.prototype._next = function(r) {
    this.destination.next(r);
  }, t.prototype._error = function(r) {
    try {
      this.destination.error(r);
    } finally {
      this.unsubscribe();
    }
  }, t.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, t;
}(F), be = Function.prototype.bind;
function C(e, t) {
  return be.call(e, t);
}
var we = function() {
  function e(t) {
    this.partialObserver = t;
  }
  return e.prototype.next = function(t) {
    var r = this.partialObserver;
    if (r.next)
      try {
        r.next(t);
      } catch (n) {
        O(n);
      }
  }, e.prototype.error = function(t) {
    var r = this.partialObserver;
    if (r.error)
      try {
        r.error(t);
      } catch (n) {
        O(n);
      }
    else
      O(t);
  }, e.prototype.complete = function() {
    var t = this.partialObserver;
    if (t.complete)
      try {
        t.complete();
      } catch (r) {
        O(r);
      }
  }, e;
}(), V = function(e) {
  q(t, e);
  function t(r, n, o) {
    var i = e.call(this) || this, u;
    if (d(r) || !r)
      u = {
        next: r != null ? r : void 0,
        error: n != null ? n : void 0,
        complete: o != null ? o : void 0
      };
    else {
      var a;
      i && te.useDeprecatedNextContext ? (a = Object.create(r), a.unsubscribe = function() {
        return i.unsubscribe();
      }, u = {
        next: r.next && C(r.next, a),
        error: r.error && C(r.error, a),
        complete: r.complete && C(r.complete, a)
      }) : u = r;
    }
    return i.destination = new we(u), i;
  }
  return t;
}(Y);
function O(e) {
  re(e);
}
function ge(e) {
  throw e;
}
var Se = {
  closed: !0,
  next: B,
  error: ge,
  complete: B
}, G = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function Ee(e) {
  return e;
}
function xe(e) {
  return e.length === 0 ? Ee : e.length === 1 ? e[0] : function(r) {
    return e.reduce(function(n, o) {
      return o(n);
    }, r);
  };
}
var w = function() {
  function e(t) {
    t && (this._subscribe = t);
  }
  return e.prototype.lift = function(t) {
    var r = new e();
    return r.source = this, r.operator = t, r;
  }, e.prototype.subscribe = function(t, r, n) {
    var o = this, i = Ie(t) ? t : new V(t, r, n);
    return me(function() {
      var u = o, a = u.operator, s = u.source;
      i.add(a ? a.call(i, s) : s ? o._subscribe(i) : o._trySubscribe(i));
    }), i;
  }, e.prototype._trySubscribe = function(t) {
    try {
      return this._subscribe(t);
    } catch (r) {
      t.error(r);
    }
  }, e.prototype.forEach = function(t, r) {
    var n = this;
    return r = K(r), new r(function(o, i) {
      var u = new V({
        next: function(a) {
          try {
            t(a);
          } catch (s) {
            i(s), u.unsubscribe();
          }
        },
        error: i,
        complete: o
      });
      n.subscribe(u);
    });
  }, e.prototype._subscribe = function(t) {
    var r;
    return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(t);
  }, e.prototype[G] = function() {
    return this;
  }, e.prototype.pipe = function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    return xe(t)(this);
  }, e.prototype.toPromise = function(t) {
    var r = this;
    return t = K(t), new t(function(n, o) {
      var i;
      r.subscribe(function(u) {
        return i = u;
      }, function(u) {
        return o(u);
      }, function() {
        return n(i);
      });
    });
  }, e.create = function(t) {
    return new e(t);
  }, e;
}();
function K(e) {
  var t;
  return (t = e != null ? e : te.Promise) !== null && t !== void 0 ? t : Promise;
}
function Ae(e) {
  return e && d(e.next) && d(e.error) && d(e.complete);
}
function Ie(e) {
  return e && e instanceof Y || Ae(e) && ee(e);
}
function Pe(e) {
  return d(e == null ? void 0 : e.lift);
}
function M(e) {
  return function(t) {
    if (Pe(t))
      return t.lift(function(r) {
        try {
          return e(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function P(e, t, r, n, o) {
  return new Te(e, t, r, n, o);
}
var Te = function(e) {
  q(t, e);
  function t(r, n, o, i, u, a) {
    var s = e.call(this, r) || this;
    return s.onFinalize = u, s.shouldUnsubscribe = a, s._next = n ? function(c) {
      try {
        n(c);
      } catch (l) {
        r.error(l);
      }
    } : e.prototype._next, s._error = i ? function(c) {
      try {
        i(c);
      } catch (l) {
        r.error(l);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._error, s._complete = o ? function() {
      try {
        o();
      } catch (c) {
        r.error(c);
      } finally {
        this.unsubscribe();
      }
    } : e.prototype._complete, s;
  }
  return t.prototype.unsubscribe = function() {
    var r;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var n = this.closed;
      e.prototype.unsubscribe.call(this), !n && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
    }
  }, t;
}(Y), _e = new w(function(e) {
  return e.complete();
}), ne = function(e) {
  return e && typeof e.length == "number" && typeof e != "function";
};
function Oe(e) {
  return d(e == null ? void 0 : e.then);
}
function Le(e) {
  return d(e[G]);
}
function Me(e) {
  return Symbol.asyncIterator && d(e == null ? void 0 : e[Symbol.asyncIterator]);
}
function Ue(e) {
  return new TypeError("You provided " + (e !== null && typeof e == "object" ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function Ce() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var ke = Ce();
function De(e) {
  return d(e == null ? void 0 : e[ke]);
}
function Re(e) {
  return pe(this, arguments, function() {
    var r, n, o, i;
    return z(this, function(u) {
      switch (u.label) {
        case 0:
          r = e.getReader(), u.label = 1;
        case 1:
          u.trys.push([1, , 9, 10]), u.label = 2;
        case 2:
          return [4, S(r.read())];
        case 3:
          return n = u.sent(), o = n.value, i = n.done, i ? [4, S(void 0)] : [3, 5];
        case 4:
          return [2, u.sent()];
        case 5:
          return [4, S(o)];
        case 6:
          return [4, u.sent()];
        case 7:
          return u.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return r.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function Ve(e) {
  return d(e == null ? void 0 : e.getReader);
}
function H(e) {
  if (e instanceof w)
    return e;
  if (e != null) {
    if (Le(e))
      return je(e);
    if (ne(e))
      return qe(e);
    if (Oe(e))
      return Fe(e);
    if (Me(e))
      return ie(e);
    if (De(e))
      return Ye(e);
    if (Ve(e))
      return Ge(e);
  }
  throw Ue(e);
}
function je(e) {
  return new w(function(t) {
    var r = e[G]();
    if (d(r.subscribe))
      return r.subscribe(t);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function qe(e) {
  return new w(function(t) {
    for (var r = 0; r < e.length && !t.closed; r++)
      t.next(e[r]);
    t.complete();
  });
}
function Fe(e) {
  return new w(function(t) {
    e.then(function(r) {
      t.closed || (t.next(r), t.complete());
    }, function(r) {
      return t.error(r);
    }).then(null, re);
  });
}
function Ye(e) {
  return new w(function(t) {
    var r, n;
    try {
      for (var o = A(e), i = o.next(); !i.done; i = o.next()) {
        var u = i.value;
        if (t.next(u), t.closed)
          return;
      }
    } catch (a) {
      r = { error: a };
    } finally {
      try {
        i && !i.done && (n = o.return) && n.call(o);
      } finally {
        if (r)
          throw r.error;
      }
    }
    t.complete();
  });
}
function ie(e) {
  return new w(function(t) {
    He(e, t).catch(function(r) {
      return t.error(r);
    });
  });
}
function Ge(e) {
  return ie(Re(e));
}
function He(e, t) {
  var r, n, o, i;
  return ye(this, void 0, void 0, function() {
    var u, a;
    return z(this, function(s) {
      switch (s.label) {
        case 0:
          s.trys.push([0, 5, 6, 11]), r = ve(e), s.label = 1;
        case 1:
          return [4, r.next()];
        case 2:
          if (n = s.sent(), !!n.done)
            return [3, 4];
          if (u = n.value, t.next(u), t.closed)
            return [2];
          s.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return a = s.sent(), o = { error: a }, [3, 11];
        case 6:
          return s.trys.push([6, , 9, 10]), n && !n.done && (i = r.return) ? [4, i.call(r)] : [3, 8];
        case 7:
          s.sent(), s.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (o)
            throw o.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return t.complete(), [2];
      }
    });
  });
}
function We(e, t, r, n, o) {
  n === void 0 && (n = 0), o === void 0 && (o = !1);
  var i = t.schedule(function() {
    r(), o ? e.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if (e.add(i), !o)
    return i;
}
var Ze = N(function(e) {
  return function() {
    e(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function Je(e, t) {
  var r = typeof t == "object";
  return new Promise(function(n, o) {
    var i = !1, u;
    e.subscribe({
      next: function(a) {
        u = a, i = !0;
      },
      error: o,
      complete: function() {
        i ? n(u) : r ? n(t.defaultValue) : o(new Ze());
      }
    });
  });
}
function L(e, t) {
  return M(function(r, n) {
    var o = 0;
    r.subscribe(P(n, function(i) {
      n.next(e.call(t, i, o++));
    }));
  });
}
var Qe = Array.isArray;
function Be(e, t) {
  return Qe(t) ? e.apply(void 0, I([], E(t))) : e(t);
}
function Ke(e) {
  return L(function(t) {
    return Be(e, t);
  });
}
function Xe(e, t, r, n, o, i, u, a) {
  var s = [], c = 0, l = 0, v = !1, f = function() {
    v && !s.length && !c && t.complete();
  }, p = function(h) {
    return c < n ? m(h) : s.push(h);
  }, m = function(h) {
    i && t.next(h), c++;
    var W = !1;
    H(r(h, l++)).subscribe(P(t, function(x) {
      o == null || o(x), i ? p(x) : t.next(x);
    }, function() {
      W = !0;
    }, void 0, function() {
      if (W)
        try {
          c--;
          for (var x = function() {
            var T = s.shift();
            u ? We(t, u, function() {
              return m(T);
            }) : m(T);
          }; s.length && c < n; )
            x();
          f();
        } catch (T) {
          t.error(T);
        }
    }));
  };
  return e.subscribe(P(t, p, function() {
    v = !0, f();
  })), function() {
    a == null || a();
  };
}
function oe(e, t, r) {
  return r === void 0 && (r = 1 / 0), d(t) ? oe(function(n, o) {
    return L(function(i, u) {
      return t(n, i, o, u);
    })(H(e(n, o)));
  }, r) : (typeof t == "number" && (r = t), M(function(n, o) {
    return Xe(n, o, e, r);
  }));
}
var $e = ["addListener", "removeListener"], ze = ["addEventListener", "removeEventListener"], Ne = ["on", "off"];
function j(e, t, r, n) {
  if (d(r) && (n = r, r = void 0), n)
    return j(e, t, r).pipe(Ke(n));
  var o = E(rt(e) ? ze.map(function(a) {
    return function(s) {
      return e[a](t, s, r);
    };
  }) : et(e) ? $e.map(X(e, t)) : tt(e) ? Ne.map(X(e, t)) : [], 2), i = o[0], u = o[1];
  if (!i && ne(e))
    return oe(function(a) {
      return j(a, t, r);
    })(H(e));
  if (!i)
    throw new TypeError("Invalid event target");
  return new w(function(a) {
    var s = function() {
      for (var c = [], l = 0; l < arguments.length; l++)
        c[l] = arguments[l];
      return a.next(1 < c.length ? c : c[0]);
    };
    return i(s), function() {
      return u(s);
    };
  });
}
function X(e, t) {
  return function(r) {
    return function(n) {
      return e[r](t, n);
    };
  };
}
function et(e) {
  return d(e.addListener) && d(e.removeListener);
}
function tt(e) {
  return d(e.on) && d(e.off);
}
function rt(e) {
  return d(e.addEventListener) && d(e.removeEventListener);
}
function $(e, t) {
  return M(function(r, n) {
    var o = 0;
    r.subscribe(P(n, function(i) {
      return e.call(t, i, o++) && n.next(i);
    }));
  });
}
function nt(e) {
  return e <= 0 ? function() {
    return _e;
  } : M(function(t, r) {
    var n = 0;
    t.subscribe(P(r, function(o) {
      ++n <= e && (r.next(o), e <= n && r.complete());
    }));
  });
}
class it {
  constructor(t, r) {
    b(this, "msgObservable");
    b(this, "source");
    b(this, "target");
    if (t === r)
      throw new Error(
        "[WindowMessageStream] source and target must be different"
      );
    this.source = t, this.target = r, this.msgObservable = j(
      window,
      "message"
    ).pipe(
      $(
        (n) => {
          var o;
          return n.source === window && ((o = n.data) == null ? void 0 : o.target) === this.source;
        }
      ),
      L((n) => n.data)
    );
  }
  async post(t) {
    const r = {
      target: this.target,
      payload: t
    };
    return console.log("[WindowMsgStream] postMessage", r), window.postMessage(r), await Je(
      this.msgObservable.pipe(
        $((n) => n.payload.id === t.id),
        L((n) => n.payload),
        nt(1)
      )
    );
  }
  subscribe(t) {
    this.msgObservable.subscribe(t);
  }
}
var ue = /* @__PURE__ */ ((e) => (e.MOVE_CALL = "MOVE_CALL", e.SERIALIZED_MOVE_CALL = "SERIALIZED_MOVE_CALL", e))(ue || {});
class ot {
  constructor() {
    b(this, "name");
    b(this, "connected");
    b(this, "connecting");
    b(this, "windowMsgStream");
    this.name = "Suiet", this.connected = !1, this.connecting = !1, this.windowMsgStream = new it(
      k.DAPP,
      k.SUIET_CONTENT
    );
  }
  async connect(t) {
    return await this.windowMsgStream.post(g("handshake", null)), await this.windowMsgStream.post(
      g("dapp.connect", { permissions: t })
    );
  }
  async disconnect() {
    return await this.windowMsgStream.post(g("handwave", null));
  }
  async hasPermissions(t) {
    return console.log("permissions", t), !0;
  }
  async requestPermissions() {
    return await this.windowMsgStream.post(g("requestPermissions", null));
  }
  async executeMoveCall(t) {
    return console.log("content script", t), await this.windowMsgStream.post(
      g("dapp.requestTransaction", {
        type: ue.MOVE_CALL,
        data: t
      })
    );
  }
  async executeSerializedMoveCall(t) {
    return await Promise.resolve(void 0);
  }
  async getAccounts() {
    return await this.windowMsgStream.post(
      g("dapp.getAccounts", null)
    );
  }
}
Object.defineProperty(window, "__suiet__", {
  enumerable: !1,
  configurable: !1,
  value: new ot()
});
export {
  ot as DAppInterface
};
