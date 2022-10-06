var Pe = Object.defineProperty;
var Ne = (n, o, u) => o in n ? Pe(n, o, { enumerable: !0, configurable: !0, writable: !0, value: u }) : n[o] = u;
var Vt = (n, o, u) => (Ne(n, typeof o != "symbol" ? o + "" : o, u), u);
let ur;
const $e = new Uint8Array(16);
function ze() {
  if (!ur && (ur = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !ur))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ur($e);
}
const It = [];
for (let n = 0; n < 256; ++n)
  It.push((n + 256).toString(16).slice(1));
function qe(n, o = 0) {
  return (It[n[o + 0]] + It[n[o + 1]] + It[n[o + 2]] + It[n[o + 3]] + "-" + It[n[o + 4]] + It[n[o + 5]] + "-" + It[n[o + 6]] + It[n[o + 7]] + "-" + It[n[o + 8]] + It[n[o + 9]] + "-" + It[n[o + 10]] + It[n[o + 11]] + It[n[o + 12]] + It[n[o + 13]] + It[n[o + 14]] + It[n[o + 15]]).toLowerCase();
}
const Ze = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), de = {
  randomUUID: Ze
};
function Ve(n, o, u) {
  if (de.randomUUID && !o && !n)
    return de.randomUUID();
  n = n || {};
  const h = n.random || (n.rng || ze)();
  if (h[6] = h[6] & 15 | 64, h[8] = h[8] & 63 | 128, o) {
    u = u || 0;
    for (let m = 0; m < 16; ++m)
      o[u + m] = h[m];
    return o;
  }
  return qe(h);
}
var Zr = /* @__PURE__ */ ((n) => (n.DAPP = "DAPP", n.SUIET_CONTENT = "SUIET_CONTENT", n))(Zr || {});
function Kt(n, o, u) {
  return {
    id: Ve(),
    funcName: n,
    payload: o,
    options: u
  };
}
var Vr = function(n, o) {
  return Vr = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(u, h) {
    u.__proto__ = h;
  } || function(u, h) {
    for (var m in h)
      Object.prototype.hasOwnProperty.call(h, m) && (u[m] = h[m]);
  }, Vr(n, o);
};
function Hr(n, o) {
  if (typeof o != "function" && o !== null)
    throw new TypeError("Class extends value " + String(o) + " is not a constructor or null");
  Vr(n, o);
  function u() {
    this.constructor = n;
  }
  n.prototype = o === null ? Object.create(o) : (u.prototype = o.prototype, new u());
}
function Ge(n, o, u, h) {
  function m(f) {
    return f instanceof u ? f : new u(function(x) {
      x(f);
    });
  }
  return new (u || (u = Promise))(function(f, x) {
    function w(S) {
      try {
        F(h.next(S));
      } catch (P) {
        x(P);
      }
    }
    function A(S) {
      try {
        F(h.throw(S));
      } catch (P) {
        x(P);
      }
    }
    function F(S) {
      S.done ? f(S.value) : m(S.value).then(w, A);
    }
    F((h = h.apply(n, o || [])).next());
  });
}
function xe(n, o) {
  var u = { label: 0, sent: function() {
    if (f[0] & 1)
      throw f[1];
    return f[1];
  }, trys: [], ops: [] }, h, m, f, x;
  return x = { next: w(0), throw: w(1), return: w(2) }, typeof Symbol == "function" && (x[Symbol.iterator] = function() {
    return this;
  }), x;
  function w(F) {
    return function(S) {
      return A([F, S]);
    };
  }
  function A(F) {
    if (h)
      throw new TypeError("Generator is already executing.");
    for (; u; )
      try {
        if (h = 1, m && (f = F[0] & 2 ? m.return : F[0] ? m.throw || ((f = m.return) && f.call(m), 0) : m.next) && !(f = f.call(m, F[1])).done)
          return f;
        switch (m = 0, f && (F = [F[0] & 2, f.value]), F[0]) {
          case 0:
          case 1:
            f = F;
            break;
          case 4:
            return u.label++, { value: F[1], done: !1 };
          case 5:
            u.label++, m = F[1], F = [0];
            continue;
          case 7:
            F = u.ops.pop(), u.trys.pop();
            continue;
          default:
            if (f = u.trys, !(f = f.length > 0 && f[f.length - 1]) && (F[0] === 6 || F[0] === 2)) {
              u = 0;
              continue;
            }
            if (F[0] === 3 && (!f || F[1] > f[0] && F[1] < f[3])) {
              u.label = F[1];
              break;
            }
            if (F[0] === 6 && u.label < f[1]) {
              u.label = f[1], f = F;
              break;
            }
            if (f && u.label < f[2]) {
              u.label = f[2], u.ops.push(F);
              break;
            }
            f[2] && u.ops.pop(), u.trys.pop();
            continue;
        }
        F = o.call(n, u);
      } catch (S) {
        F = [6, S], m = 0;
      } finally {
        h = f = 0;
      }
    if (F[0] & 5)
      throw F[1];
    return { value: F[0] ? F[1] : void 0, done: !0 };
  }
}
function er(n) {
  var o = typeof Symbol == "function" && Symbol.iterator, u = o && n[o], h = 0;
  if (u)
    return u.call(n);
  if (n && typeof n.length == "number")
    return {
      next: function() {
        return n && h >= n.length && (n = void 0), { value: n && n[h++], done: !n };
      }
    };
  throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function Xt(n, o) {
  var u = typeof Symbol == "function" && n[Symbol.iterator];
  if (!u)
    return n;
  var h = u.call(n), m, f = [], x;
  try {
    for (; (o === void 0 || o-- > 0) && !(m = h.next()).done; )
      f.push(m.value);
  } catch (w) {
    x = { error: w };
  } finally {
    try {
      m && !m.done && (u = h.return) && u.call(h);
    } finally {
      if (x)
        throw x.error;
    }
  }
  return f;
}
function ir(n, o, u) {
  if (u || arguments.length === 2)
    for (var h = 0, m = o.length, f; h < m; h++)
      (f || !(h in o)) && (f || (f = Array.prototype.slice.call(o, 0, h)), f[h] = o[h]);
  return n.concat(f || Array.prototype.slice.call(o));
}
function Jt(n) {
  return this instanceof Jt ? (this.v = n, this) : new Jt(n);
}
function Ye(n, o, u) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var h = u.apply(n, o || []), m, f = [];
  return m = {}, x("next"), x("throw"), x("return"), m[Symbol.asyncIterator] = function() {
    return this;
  }, m;
  function x(D) {
    h[D] && (m[D] = function(I) {
      return new Promise(function(z, N) {
        f.push([D, I, z, N]) > 1 || w(D, I);
      });
    });
  }
  function w(D, I) {
    try {
      A(h[D](I));
    } catch (z) {
      P(f[0][3], z);
    }
  }
  function A(D) {
    D.value instanceof Jt ? Promise.resolve(D.value.v).then(F, S) : P(f[0][2], D);
  }
  function F(D) {
    w("next", D);
  }
  function S(D) {
    w("throw", D);
  }
  function P(D, I) {
    D(I), f.shift(), f.length && w(f[0][0], f[0][1]);
  }
}
function Ke(n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var o = n[Symbol.asyncIterator], u;
  return o ? o.call(n) : (n = typeof er == "function" ? er(n) : n[Symbol.iterator](), u = {}, h("next"), h("throw"), h("return"), u[Symbol.asyncIterator] = function() {
    return this;
  }, u);
  function h(f) {
    u[f] = n[f] && function(x) {
      return new Promise(function(w, A) {
        x = n[f](x), m(w, A, x.done, x.value);
      });
    };
  }
  function m(f, x, w, A) {
    Promise.resolve(A).then(function(F) {
      f({ value: F, done: w });
    }, x);
  }
}
function j(n) {
  return typeof n == "function";
}
function Me(n) {
  var o = function(h) {
    Error.call(h), h.stack = new Error().stack;
  }, u = n(o);
  return u.prototype = Object.create(Error.prototype), u.prototype.constructor = u, u;
}
var Pr = Me(function(n) {
  return function(u) {
    n(this), this.message = u ? u.length + ` errors occurred during unsubscription:
` + u.map(function(h, m) {
      return m + 1 + ") " + h.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = u;
  };
});
function pe(n, o) {
  if (n) {
    var u = n.indexOf(o);
    0 <= u && n.splice(u, 1);
  }
}
var Jr = function() {
  function n(o) {
    this.initialTeardown = o, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return n.prototype.unsubscribe = function() {
    var o, u, h, m, f;
    if (!this.closed) {
      this.closed = !0;
      var x = this._parentage;
      if (x)
        if (this._parentage = null, Array.isArray(x))
          try {
            for (var w = er(x), A = w.next(); !A.done; A = w.next()) {
              var F = A.value;
              F.remove(this);
            }
          } catch (N) {
            o = { error: N };
          } finally {
            try {
              A && !A.done && (u = w.return) && u.call(w);
            } finally {
              if (o)
                throw o.error;
            }
          }
        else
          x.remove(this);
      var S = this.initialTeardown;
      if (j(S))
        try {
          S();
        } catch (N) {
          f = N instanceof Pr ? N.errors : [N];
        }
      var P = this._finalizers;
      if (P) {
        this._finalizers = null;
        try {
          for (var D = er(P), I = D.next(); !I.done; I = D.next()) {
            var z = I.value;
            try {
              me(z);
            } catch (N) {
              f = f != null ? f : [], N instanceof Pr ? f = ir(ir([], Xt(f)), Xt(N.errors)) : f.push(N);
            }
          }
        } catch (N) {
          h = { error: N };
        } finally {
          try {
            I && !I.done && (m = D.return) && m.call(D);
          } finally {
            if (h)
              throw h.error;
          }
        }
      }
      if (f)
        throw new Pr(f);
    }
  }, n.prototype.add = function(o) {
    var u;
    if (o && o !== this)
      if (this.closed)
        me(o);
      else {
        if (o instanceof n) {
          if (o.closed || o._hasParent(this))
            return;
          o._addParent(this);
        }
        (this._finalizers = (u = this._finalizers) !== null && u !== void 0 ? u : []).push(o);
      }
  }, n.prototype._hasParent = function(o) {
    var u = this._parentage;
    return u === o || Array.isArray(u) && u.includes(o);
  }, n.prototype._addParent = function(o) {
    var u = this._parentage;
    this._parentage = Array.isArray(u) ? (u.push(o), u) : u ? [u, o] : o;
  }, n.prototype._removeParent = function(o) {
    var u = this._parentage;
    u === o ? this._parentage = null : Array.isArray(u) && pe(u, o);
  }, n.prototype.remove = function(o) {
    var u = this._finalizers;
    u && pe(u, o), o instanceof n && o._removeParent(this);
  }, n.EMPTY = function() {
    var o = new n();
    return o.closed = !0, o;
  }(), n;
}();
Jr.EMPTY;
function be(n) {
  return n instanceof Jr || n && "closed" in n && j(n.remove) && j(n.add) && j(n.unsubscribe);
}
function me(n) {
  j(n) ? n() : n.unsubscribe();
}
var Ee = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, Gr = {
  setTimeout: function(n, o) {
    for (var u = [], h = 2; h < arguments.length; h++)
      u[h - 2] = arguments[h];
    var m = Gr.delegate;
    return m != null && m.setTimeout ? m.setTimeout.apply(m, ir([n, o], Xt(u))) : setTimeout.apply(void 0, ir([n, o], Xt(u)));
  },
  clearTimeout: function(n) {
    var o = Gr.delegate;
    return ((o == null ? void 0 : o.clearTimeout) || clearTimeout)(n);
  },
  delegate: void 0
};
function Be(n) {
  Gr.setTimeout(function() {
    throw n;
  });
}
function ye() {
}
function We(n) {
  n();
}
var Xr = function(n) {
  Hr(o, n);
  function o(u) {
    var h = n.call(this) || this;
    return h.isStopped = !1, u ? (h.destination = u, be(u) && u.add(h)) : h.destination = Xe, h;
  }
  return o.create = function(u, h, m) {
    return new Yr(u, h, m);
  }, o.prototype.next = function(u) {
    this.isStopped || this._next(u);
  }, o.prototype.error = function(u) {
    this.isStopped || (this.isStopped = !0, this._error(u));
  }, o.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, o.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, n.prototype.unsubscribe.call(this), this.destination = null);
  }, o.prototype._next = function(u) {
    this.destination.next(u);
  }, o.prototype._error = function(u) {
    try {
      this.destination.error(u);
    } finally {
      this.unsubscribe();
    }
  }, o.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, o;
}(Jr), je = Function.prototype.bind;
function Nr(n, o) {
  return je.call(n, o);
}
var He = function() {
  function n(o) {
    this.partialObserver = o;
  }
  return n.prototype.next = function(o) {
    var u = this.partialObserver;
    if (u.next)
      try {
        u.next(o);
      } catch (h) {
        hr(h);
      }
  }, n.prototype.error = function(o) {
    var u = this.partialObserver;
    if (u.error)
      try {
        u.error(o);
      } catch (h) {
        hr(h);
      }
    else
      hr(o);
  }, n.prototype.complete = function() {
    var o = this.partialObserver;
    if (o.complete)
      try {
        o.complete();
      } catch (u) {
        hr(u);
      }
  }, n;
}(), Yr = function(n) {
  Hr(o, n);
  function o(u, h, m) {
    var f = n.call(this) || this, x;
    if (j(u) || !u)
      x = {
        next: u != null ? u : void 0,
        error: h != null ? h : void 0,
        complete: m != null ? m : void 0
      };
    else {
      var w;
      f && Ee.useDeprecatedNextContext ? (w = Object.create(u), w.unsubscribe = function() {
        return f.unsubscribe();
      }, x = {
        next: u.next && Nr(u.next, w),
        error: u.error && Nr(u.error, w),
        complete: u.complete && Nr(u.complete, w)
      }) : x = u;
    }
    return f.destination = new He(x), f;
  }
  return o;
}(Xr);
function hr(n) {
  Be(n);
}
function Je(n) {
  throw n;
}
var Xe = {
  closed: !0,
  next: ye,
  error: Je,
  complete: ye
}, Qr = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function Qe(n) {
  return n;
}
function ti(n) {
  return n.length === 0 ? Qe : n.length === 1 ? n[0] : function(u) {
    return n.reduce(function(h, m) {
      return m(h);
    }, u);
  };
}
var Yt = function() {
  function n(o) {
    o && (this._subscribe = o);
  }
  return n.prototype.lift = function(o) {
    var u = new n();
    return u.source = this, u.operator = o, u;
  }, n.prototype.subscribe = function(o, u, h) {
    var m = this, f = ei(o) ? o : new Yr(o, u, h);
    return We(function() {
      var x = m, w = x.operator, A = x.source;
      f.add(w ? w.call(f, A) : A ? m._subscribe(f) : m._trySubscribe(f));
    }), f;
  }, n.prototype._trySubscribe = function(o) {
    try {
      return this._subscribe(o);
    } catch (u) {
      o.error(u);
    }
  }, n.prototype.forEach = function(o, u) {
    var h = this;
    return u = ve(u), new u(function(m, f) {
      var x = new Yr({
        next: function(w) {
          try {
            o(w);
          } catch (A) {
            f(A), x.unsubscribe();
          }
        },
        error: f,
        complete: m
      });
      h.subscribe(x);
    });
  }, n.prototype._subscribe = function(o) {
    var u;
    return (u = this.source) === null || u === void 0 ? void 0 : u.subscribe(o);
  }, n.prototype[Qr] = function() {
    return this;
  }, n.prototype.pipe = function() {
    for (var o = [], u = 0; u < arguments.length; u++)
      o[u] = arguments[u];
    return ti(o)(this);
  }, n.prototype.toPromise = function(o) {
    var u = this;
    return o = ve(o), new o(function(h, m) {
      var f;
      u.subscribe(function(x) {
        return f = x;
      }, function(x) {
        return m(x);
      }, function() {
        return h(f);
      });
    });
  }, n.create = function(o) {
    return new n(o);
  }, n;
}();
function ve(n) {
  var o;
  return (o = n != null ? n : Ee.Promise) !== null && o !== void 0 ? o : Promise;
}
function ri(n) {
  return n && j(n.next) && j(n.error) && j(n.complete);
}
function ei(n) {
  return n && n instanceof Xr || ri(n) && be(n);
}
function ii(n) {
  return j(n == null ? void 0 : n.lift);
}
function yr(n) {
  return function(o) {
    if (ii(o))
      return o.lift(function(u) {
        try {
          return n(u, this);
        } catch (h) {
          this.error(h);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function nr(n, o, u, h, m) {
  return new ni(n, o, u, h, m);
}
var ni = function(n) {
  Hr(o, n);
  function o(u, h, m, f, x, w) {
    var A = n.call(this, u) || this;
    return A.onFinalize = x, A.shouldUnsubscribe = w, A._next = h ? function(F) {
      try {
        h(F);
      } catch (S) {
        u.error(S);
      }
    } : n.prototype._next, A._error = f ? function(F) {
      try {
        f(F);
      } catch (S) {
        u.error(S);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._error, A._complete = m ? function() {
      try {
        m();
      } catch (F) {
        u.error(F);
      } finally {
        this.unsubscribe();
      }
    } : n.prototype._complete, A;
  }
  return o.prototype.unsubscribe = function() {
    var u;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var h = this.closed;
      n.prototype.unsubscribe.call(this), !h && ((u = this.onFinalize) === null || u === void 0 || u.call(this));
    }
  }, o;
}(Xr), oi = new Yt(function(n) {
  return n.complete();
}), _e = function(n) {
  return n && typeof n.length == "number" && typeof n != "function";
};
function fi(n) {
  return j(n == null ? void 0 : n.then);
}
function si(n) {
  return j(n[Qr]);
}
function ui(n) {
  return Symbol.asyncIterator && j(n == null ? void 0 : n[Symbol.asyncIterator]);
}
function hi(n) {
  return new TypeError("You provided " + (n !== null && typeof n == "object" ? "an invalid object" : "'" + n + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function ai() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var li = ai();
function ci(n) {
  return j(n == null ? void 0 : n[li]);
}
function di(n) {
  return Ye(this, arguments, function() {
    var u, h, m, f;
    return xe(this, function(x) {
      switch (x.label) {
        case 0:
          u = n.getReader(), x.label = 1;
        case 1:
          x.trys.push([1, , 9, 10]), x.label = 2;
        case 2:
          return [4, Jt(u.read())];
        case 3:
          return h = x.sent(), m = h.value, f = h.done, f ? [4, Jt(void 0)] : [3, 5];
        case 4:
          return [2, x.sent()];
        case 5:
          return [4, Jt(m)];
        case 6:
          return [4, x.sent()];
        case 7:
          return x.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return u.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function pi(n) {
  return j(n == null ? void 0 : n.getReader);
}
function te(n) {
  if (n instanceof Yt)
    return n;
  if (n != null) {
    if (si(n))
      return mi(n);
    if (_e(n))
      return yi(n);
    if (fi(n))
      return vi(n);
    if (ui(n))
      return Ae(n);
    if (ci(n))
      return wi(n);
    if (pi(n))
      return gi(n);
  }
  throw hi(n);
}
function mi(n) {
  return new Yt(function(o) {
    var u = n[Qr]();
    if (j(u.subscribe))
      return u.subscribe(o);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function yi(n) {
  return new Yt(function(o) {
    for (var u = 0; u < n.length && !o.closed; u++)
      o.next(n[u]);
    o.complete();
  });
}
function vi(n) {
  return new Yt(function(o) {
    n.then(function(u) {
      o.closed || (o.next(u), o.complete());
    }, function(u) {
      return o.error(u);
    }).then(null, Be);
  });
}
function wi(n) {
  return new Yt(function(o) {
    var u, h;
    try {
      for (var m = er(n), f = m.next(); !f.done; f = m.next()) {
        var x = f.value;
        if (o.next(x), o.closed)
          return;
      }
    } catch (w) {
      u = { error: w };
    } finally {
      try {
        f && !f.done && (h = m.return) && h.call(m);
      } finally {
        if (u)
          throw u.error;
      }
    }
    o.complete();
  });
}
function Ae(n) {
  return new Yt(function(o) {
    xi(n, o).catch(function(u) {
      return o.error(u);
    });
  });
}
function gi(n) {
  return Ae(di(n));
}
function xi(n, o) {
  var u, h, m, f;
  return Ge(this, void 0, void 0, function() {
    var x, w;
    return xe(this, function(A) {
      switch (A.label) {
        case 0:
          A.trys.push([0, 5, 6, 11]), u = Ke(n), A.label = 1;
        case 1:
          return [4, u.next()];
        case 2:
          if (h = A.sent(), !!h.done)
            return [3, 4];
          if (x = h.value, o.next(x), o.closed)
            return [2];
          A.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return w = A.sent(), m = { error: w }, [3, 11];
        case 6:
          return A.trys.push([6, , 9, 10]), h && !h.done && (f = u.return) ? [4, f.call(u)] : [3, 8];
        case 7:
          A.sent(), A.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (m)
            throw m.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return o.complete(), [2];
      }
    });
  });
}
function Mi(n, o, u, h, m) {
  h === void 0 && (h = 0), m === void 0 && (m = !1);
  var f = o.schedule(function() {
    u(), m ? n.add(this.schedule(null, h)) : this.unsubscribe();
  }, h);
  if (n.add(f), !m)
    return f;
}
var bi = Me(function(n) {
  return function() {
    n(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function Ei(n, o) {
  var u = typeof o == "object";
  return new Promise(function(h, m) {
    var f = !1, x;
    n.subscribe({
      next: function(w) {
        x = w, f = !0;
      },
      error: m,
      complete: function() {
        f ? h(x) : u ? h(o.defaultValue) : m(new bi());
      }
    });
  });
}
function lr(n, o) {
  return yr(function(u, h) {
    var m = 0;
    u.subscribe(nr(h, function(f) {
      h.next(n.call(o, f, m++));
    }));
  });
}
var Bi = Array.isArray;
function _i(n, o) {
  return Bi(o) ? n.apply(void 0, ir([], Xt(o))) : n(o);
}
function Ai(n) {
  return lr(function(o) {
    return _i(n, o);
  });
}
function Fi(n, o, u, h, m, f, x, w) {
  var A = [], F = 0, S = 0, P = !1, D = function() {
    P && !A.length && !F && o.complete();
  }, I = function(N) {
    return F < h ? z(N) : A.push(N);
  }, z = function(N) {
    f && o.next(N), F++;
    var _t = !1;
    te(u(N, S++)).subscribe(nr(o, function(H) {
      m == null || m(H), f ? I(H) : o.next(H);
    }, function() {
      _t = !0;
    }, void 0, function() {
      if (_t)
        try {
          F--;
          for (var H = function() {
            var ot = A.shift();
            x ? Mi(o, x, function() {
              return z(ot);
            }) : z(ot);
          }; A.length && F < h; )
            H();
          D();
        } catch (ot) {
          o.error(ot);
        }
    }));
  };
  return n.subscribe(nr(o, I, function() {
    P = !0, D();
  })), function() {
    w == null || w();
  };
}
function Fe(n, o, u) {
  return u === void 0 && (u = 1 / 0), j(o) ? Fe(function(h, m) {
    return lr(function(f, x) {
      return o(h, f, m, x);
    })(te(n(h, m)));
  }, u) : (typeof o == "number" && (u = o), yr(function(h, m) {
    return Fi(h, m, n, u);
  }));
}
var Ii = ["addListener", "removeListener"], Si = ["addEventListener", "removeEventListener"], Ui = ["on", "off"];
function Kr(n, o, u, h) {
  if (j(u) && (h = u, u = void 0), h)
    return Kr(n, o, u).pipe(Ai(h));
  var m = Xt(Oi(n) ? Si.map(function(w) {
    return function(A) {
      return n[w](o, A, u);
    };
  }) : Ri(n) ? Ii.map(we(n, o)) : Ti(n) ? Ui.map(we(n, o)) : [], 2), f = m[0], x = m[1];
  if (!f && _e(n))
    return Fe(function(w) {
      return Kr(w, o, u);
    })(te(n));
  if (!f)
    throw new TypeError("Invalid event target");
  return new Yt(function(w) {
    var A = function() {
      for (var F = [], S = 0; S < arguments.length; S++)
        F[S] = arguments[S];
      return w.next(1 < F.length ? F : F[0]);
    };
    return f(A), function() {
      return x(A);
    };
  });
}
function we(n, o) {
  return function(u) {
    return function(h) {
      return n[u](o, h);
    };
  };
}
function Ri(n) {
  return j(n.addListener) && j(n.removeListener);
}
function Ti(n) {
  return j(n.on) && j(n.off);
}
function Oi(n) {
  return j(n.addEventListener) && j(n.removeEventListener);
}
function ge(n, o) {
  return yr(function(u, h) {
    var m = 0;
    u.subscribe(nr(h, function(f) {
      return n.call(o, f, m++) && h.next(f);
    }));
  });
}
function Li(n) {
  return n <= 0 ? function() {
    return oi;
  } : yr(function(o, u) {
    var h = 0;
    o.subscribe(nr(u, function(m) {
      ++h <= n && (u.next(m), n <= h && u.complete());
    }));
  });
}
class ki {
  constructor(o, u) {
    Vt(this, "msgObservable");
    Vt(this, "source");
    Vt(this, "target");
    if (o === u)
      throw new Error(
        "[WindowMessageStream] source and target must be different"
      );
    this.source = o, this.target = u, this.msgObservable = Kr(
      window,
      "message"
    ).pipe(
      ge(
        (h) => {
          var m;
          return h.source === window && ((m = h.data) == null ? void 0 : m.target) === this.source;
        }
      ),
      lr((h) => h.data)
    );
  }
  async post(o) {
    const u = {
      target: this.target,
      payload: o
    };
    return window.postMessage(u), await Ei(
      this.msgObservable.pipe(
        ge((h) => h.payload.id === o.id),
        lr((h) => h.payload),
        Li(1)
      )
    );
  }
  subscribe(o) {
    this.msgObservable.subscribe(o);
  }
}
var Ie = /* @__PURE__ */ ((n) => (n.MOVE_CALL = "MOVE_CALL", n.SERIALIZED_MOVE_CALL = "SERIALIZED_MOVE_CALL", n))(Ie || {}), Ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Se(n) {
  var o = n.default;
  if (typeof o == "function") {
    var u = function() {
      return o.apply(this, arguments);
    };
    u.prototype = o.prototype;
  } else
    u = {};
  return Object.defineProperty(u, "__esModule", { value: !0 }), Object.keys(n).forEach(function(h) {
    var m = Object.getOwnPropertyDescriptor(n, h);
    Object.defineProperty(u, h, m.get ? m : {
      enumerable: !0,
      get: function() {
        return n[h];
      }
    });
  }), u;
}
var St = {}, Ue = { exports: {} };
const Ci = {}, Di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ci
}, Symbol.toStringTag, { value: "Module" })), Pi = /* @__PURE__ */ Se(Di);
(function(n) {
  (function(o, u) {
    function h(g, t) {
      if (!g)
        throw new Error(t || "Assertion failed");
    }
    function m(g, t) {
      g.super_ = t;
      var s = function() {
      };
      s.prototype = t.prototype, g.prototype = new s(), g.prototype.constructor = g;
    }
    function f(g, t, s) {
      if (f.isBN(g))
        return g;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, g !== null && ((t === "le" || t === "be") && (s = t, t = 10), this._init(g || 0, t || 10, s || "be"));
    }
    typeof o == "object" ? o.exports = f : u.BN = f, f.BN = f, f.wordSize = 26;
    var x;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? x = window.Buffer : x = Pi.Buffer;
    } catch {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, s) {
      return t.cmp(s) > 0 ? t : s;
    }, f.min = function(t, s) {
      return t.cmp(s) < 0 ? t : s;
    }, f.prototype._init = function(t, s, l) {
      if (typeof t == "number")
        return this._initNumber(t, s, l);
      if (typeof t == "object")
        return this._initArray(t, s, l);
      s === "hex" && (s = 16), h(s === (s | 0) && s >= 2 && s <= 36), t = t.toString().replace(/\s+/g, "");
      var p = 0;
      t[0] === "-" && (p++, this.negative = 1), p < t.length && (s === 16 ? this._parseHex(t, p, l) : (this._parseBase(t, s, p), l === "le" && this._initArray(this.toArray(), s, l)));
    }, f.prototype._initNumber = function(t, s, l) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (h(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), l === "le" && this._initArray(this.toArray(), s, l);
    }, f.prototype._initArray = function(t, s, l) {
      if (h(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var p = 0; p < this.length; p++)
        this.words[p] = 0;
      var v, b, B = 0;
      if (l === "be")
        for (p = t.length - 1, v = 0; p >= 0; p -= 3)
          b = t[p] | t[p - 1] << 8 | t[p - 2] << 16, this.words[v] |= b << B & 67108863, this.words[v + 1] = b >>> 26 - B & 67108863, B += 24, B >= 26 && (B -= 26, v++);
      else if (l === "le")
        for (p = 0, v = 0; p < t.length; p += 3)
          b = t[p] | t[p + 1] << 8 | t[p + 2] << 16, this.words[v] |= b << B & 67108863, this.words[v + 1] = b >>> 26 - B & 67108863, B += 24, B >= 26 && (B -= 26, v++);
      return this._strip();
    };
    function w(g, t) {
      var s = g.charCodeAt(t);
      if (s >= 48 && s <= 57)
        return s - 48;
      if (s >= 65 && s <= 70)
        return s - 55;
      if (s >= 97 && s <= 102)
        return s - 87;
      h(!1, "Invalid character in " + g);
    }
    function A(g, t, s) {
      var l = w(g, s);
      return s - 1 >= t && (l |= w(g, s - 1) << 4), l;
    }
    f.prototype._parseHex = function(t, s, l) {
      this.length = Math.ceil((t.length - s) / 6), this.words = new Array(this.length);
      for (var p = 0; p < this.length; p++)
        this.words[p] = 0;
      var v = 0, b = 0, B;
      if (l === "be")
        for (p = t.length - 1; p >= s; p -= 2)
          B = A(t, s, p) << v, this.words[b] |= B & 67108863, v >= 18 ? (v -= 18, b += 1, this.words[b] |= B >>> 26) : v += 8;
      else {
        var d = t.length - s;
        for (p = d % 2 === 0 ? s + 1 : s; p < t.length; p += 2)
          B = A(t, s, p) << v, this.words[b] |= B & 67108863, v >= 18 ? (v -= 18, b += 1, this.words[b] |= B >>> 26) : v += 8;
      }
      this._strip();
    };
    function F(g, t, s, l) {
      for (var p = 0, v = 0, b = Math.min(g.length, s), B = t; B < b; B++) {
        var d = g.charCodeAt(B) - 48;
        p *= l, d >= 49 ? v = d - 49 + 10 : d >= 17 ? v = d - 17 + 10 : v = d, h(d >= 0 && v < l, "Invalid character"), p += v;
      }
      return p;
    }
    f.prototype._parseBase = function(t, s, l) {
      this.words = [0], this.length = 1;
      for (var p = 0, v = 1; v <= 67108863; v *= s)
        p++;
      p--, v = v / s | 0;
      for (var b = t.length - l, B = b % p, d = Math.min(b, b - B) + l, i = 0, y = l; y < d; y += p)
        i = F(t, y, y + p, s), this.imuln(v), this.words[0] + i < 67108864 ? this.words[0] += i : this._iaddn(i);
      if (B !== 0) {
        var R = 1;
        for (i = F(t, y, t.length, s), y = 0; y < B; y++)
          R *= s;
        this.imuln(R), this.words[0] + i < 67108864 ? this.words[0] += i : this._iaddn(i);
      }
      this._strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var s = 0; s < this.length; s++)
        t.words[s] = this.words[s];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    };
    function S(g, t) {
      g.words = t.words, g.length = t.length, g.negative = t.negative, g.red = t.red;
    }
    if (f.prototype._move = function(t) {
      S(t, this);
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
        f.prototype[Symbol.for("nodejs.util.inspect.custom")] = P;
      } catch {
        f.prototype.inspect = P;
      }
    else
      f.prototype.inspect = P;
    function P() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var D = [
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
    ], I = [
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
    f.prototype.toString = function(t, s) {
      t = t || 10, s = s | 0 || 1;
      var l;
      if (t === 16 || t === "hex") {
        l = "";
        for (var p = 0, v = 0, b = 0; b < this.length; b++) {
          var B = this.words[b], d = ((B << p | v) & 16777215).toString(16);
          v = B >>> 24 - p & 16777215, p += 2, p >= 26 && (p -= 26, b--), v !== 0 || b !== this.length - 1 ? l = D[6 - d.length] + d + l : l = d + l;
        }
        for (v !== 0 && (l = v.toString(16) + l); l.length % s !== 0; )
          l = "0" + l;
        return this.negative !== 0 && (l = "-" + l), l;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var i = I[t], y = z[t];
        l = "";
        var R = this.clone();
        for (R.negative = 0; !R.isZero(); ) {
          var U = R.modrn(y).toString(t);
          R = R.idivn(y), R.isZero() ? l = U + l : l = D[i - U.length] + U + l;
        }
        for (this.isZero() && (l = "0" + l); l.length % s !== 0; )
          l = "0" + l;
        return this.negative !== 0 && (l = "-" + l), l;
      }
      h(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && h(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, x && (f.prototype.toBuffer = function(t, s) {
      return this.toArrayLike(x, t, s);
    }), f.prototype.toArray = function(t, s) {
      return this.toArrayLike(Array, t, s);
    };
    var N = function(t, s) {
      return t.allocUnsafe ? t.allocUnsafe(s) : new t(s);
    };
    f.prototype.toArrayLike = function(t, s, l) {
      this._strip();
      var p = this.byteLength(), v = l || Math.max(1, p);
      h(p <= v, "byte array longer than desired length"), h(v > 0, "Requested array length <= 0");
      var b = N(t, v), B = s === "le" ? "LE" : "BE";
      return this["_toArrayLike" + B](b, p), b;
    }, f.prototype._toArrayLikeLE = function(t, s) {
      for (var l = 0, p = 0, v = 0, b = 0; v < this.length; v++) {
        var B = this.words[v] << b | p;
        t[l++] = B & 255, l < t.length && (t[l++] = B >> 8 & 255), l < t.length && (t[l++] = B >> 16 & 255), b === 6 ? (l < t.length && (t[l++] = B >> 24 & 255), p = 0, b = 0) : (p = B >>> 24, b += 2);
      }
      if (l < t.length)
        for (t[l++] = p; l < t.length; )
          t[l++] = 0;
    }, f.prototype._toArrayLikeBE = function(t, s) {
      for (var l = t.length - 1, p = 0, v = 0, b = 0; v < this.length; v++) {
        var B = this.words[v] << b | p;
        t[l--] = B & 255, l >= 0 && (t[l--] = B >> 8 & 255), l >= 0 && (t[l--] = B >> 16 & 255), b === 6 ? (l >= 0 && (t[l--] = B >> 24 & 255), p = 0, b = 0) : (p = B >>> 24, b += 2);
      }
      if (l >= 0)
        for (t[l--] = p; l >= 0; )
          t[l--] = 0;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var s = t, l = 0;
      return s >= 4096 && (l += 13, s >>>= 13), s >= 64 && (l += 7, s >>>= 7), s >= 8 && (l += 4, s >>>= 4), s >= 2 && (l += 2, s >>>= 2), l + s;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var s = t, l = 0;
      return (s & 8191) === 0 && (l += 13, s >>>= 13), (s & 127) === 0 && (l += 7, s >>>= 7), (s & 15) === 0 && (l += 4, s >>>= 4), (s & 3) === 0 && (l += 2, s >>>= 2), (s & 1) === 0 && l++, l;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], s = this._countBits(t);
      return (this.length - 1) * 26 + s;
    };
    function _t(g) {
      for (var t = new Array(g.bitLength()), s = 0; s < t.length; s++) {
        var l = s / 26 | 0, p = s % 26;
        t[s] = g.words[l] >>> p & 1;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, s = 0; s < this.length; s++) {
        var l = this._zeroBits(this.words[s]);
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
      for (var s = 0; s < t.length; s++)
        this.words[s] = this.words[s] | t.words[s];
      return this._strip();
    }, f.prototype.ior = function(t) {
      return h((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var s;
      this.length > t.length ? s = t : s = this;
      for (var l = 0; l < s.length; l++)
        this.words[l] = this.words[l] & t.words[l];
      return this.length = s.length, this._strip();
    }, f.prototype.iand = function(t) {
      return h((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var s, l;
      this.length > t.length ? (s = this, l = t) : (s = t, l = this);
      for (var p = 0; p < l.length; p++)
        this.words[p] = s.words[p] ^ l.words[p];
      if (this !== s)
        for (; p < s.length; p++)
          this.words[p] = s.words[p];
      return this.length = s.length, this._strip();
    }, f.prototype.ixor = function(t) {
      return h((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      h(typeof t == "number" && t >= 0);
      var s = Math.ceil(t / 26) | 0, l = t % 26;
      this._expand(s), l > 0 && s--;
      for (var p = 0; p < s; p++)
        this.words[p] = ~this.words[p] & 67108863;
      return l > 0 && (this.words[p] = ~this.words[p] & 67108863 >> 26 - l), this._strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, s) {
      h(typeof t == "number" && t >= 0);
      var l = t / 26 | 0, p = t % 26;
      return this._expand(l + 1), s ? this.words[l] = this.words[l] | 1 << p : this.words[l] = this.words[l] & ~(1 << p), this._strip();
    }, f.prototype.iadd = function(t) {
      var s;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, s = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, s = this.isub(t), t.negative = 1, s._normSign();
      var l, p;
      this.length > t.length ? (l = this, p = t) : (l = t, p = this);
      for (var v = 0, b = 0; b < p.length; b++)
        s = (l.words[b] | 0) + (p.words[b] | 0) + v, this.words[b] = s & 67108863, v = s >>> 26;
      for (; v !== 0 && b < l.length; b++)
        s = (l.words[b] | 0) + v, this.words[b] = s & 67108863, v = s >>> 26;
      if (this.length = l.length, v !== 0)
        this.words[this.length] = v, this.length++;
      else if (l !== this)
        for (; b < l.length; b++)
          this.words[b] = l.words[b];
      return this;
    }, f.prototype.add = function(t) {
      var s;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, s = this.sub(t), t.negative ^= 1, s) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, s = t.sub(this), this.negative = 1, s) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var s = this.iadd(t);
        return t.negative = 1, s._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var l = this.cmp(t);
      if (l === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var p, v;
      l > 0 ? (p = this, v = t) : (p = t, v = this);
      for (var b = 0, B = 0; B < v.length; B++)
        s = (p.words[B] | 0) - (v.words[B] | 0) + b, b = s >> 26, this.words[B] = s & 67108863;
      for (; b !== 0 && B < p.length; B++)
        s = (p.words[B] | 0) + b, b = s >> 26, this.words[B] = s & 67108863;
      if (b === 0 && B < p.length && p !== this)
        for (; B < p.length; B++)
          this.words[B] = p.words[B];
      return this.length = Math.max(this.length, B), p !== this && (this.negative = 1), this._strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function H(g, t, s) {
      s.negative = t.negative ^ g.negative;
      var l = g.length + t.length | 0;
      s.length = l, l = l - 1 | 0;
      var p = g.words[0] | 0, v = t.words[0] | 0, b = p * v, B = b & 67108863, d = b / 67108864 | 0;
      s.words[0] = B;
      for (var i = 1; i < l; i++) {
        for (var y = d >>> 26, R = d & 67108863, U = Math.min(i, t.length - 1), O = Math.max(0, i - g.length + 1); O <= U; O++) {
          var Bt = i - O | 0;
          p = g.words[Bt] | 0, v = t.words[O] | 0, b = p * v + R, y += b / 67108864 | 0, R = b & 67108863;
        }
        s.words[i] = R | 0, d = y | 0;
      }
      return d !== 0 ? s.words[i] = d | 0 : s.length--, s._strip();
    }
    var ot = function(t, s, l) {
      var p = t.words, v = s.words, b = l.words, B = 0, d, i, y, R = p[0] | 0, U = R & 8191, O = R >>> 13, Bt = p[1] | 0, $ = Bt & 8191, Z = Bt >>> 13, rr = p[2] | 0, tt = rr & 8191, X = rr >>> 13, qt = p[3] | 0, V = qt & 8191, rt = qt >>> 13, fr = p[4] | 0, K = fr & 8191, et = fr >>> 13, sr = p[5] | 0, Q = sr & 8191, G = sr >>> 13, Tt = p[6] | 0, W = Tt & 8191, it = Tt >>> 13, kt = p[7] | 0, nt = kt & 8191, a = kt >>> 13, r = p[8] | 0, e = r & 8191, c = r >>> 13, M = p[9] | 0, E = M & 8191, _ = M >>> 13, C = v[0] | 0, k = C & 8191, L = C >>> 13, Y = v[1] | 0, T = Y & 8191, st = Y >>> 13, oe = v[2] | 0, ut = oe & 8191, ht = oe >>> 13, fe = v[3] | 0, at = fe & 8191, lt = fe >>> 13, se = v[4] | 0, ct = se & 8191, dt = se >>> 13, ue = v[5] | 0, pt = ue & 8191, mt = ue >>> 13, he = v[6] | 0, yt = he & 8191, vt = he >>> 13, ae = v[7] | 0, wt = ae & 8191, gt = ae >>> 13, le = v[8] | 0, xt = le & 8191, Mt = le >>> 13, ce = v[9] | 0, bt = ce & 8191, Et = ce >>> 13;
      l.negative = t.negative ^ s.negative, l.length = 19, d = Math.imul(U, k), i = Math.imul(U, L), i = i + Math.imul(O, k) | 0, y = Math.imul(O, L);
      var gr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (gr >>> 26) | 0, gr &= 67108863, d = Math.imul($, k), i = Math.imul($, L), i = i + Math.imul(Z, k) | 0, y = Math.imul(Z, L), d = d + Math.imul(U, T) | 0, i = i + Math.imul(U, st) | 0, i = i + Math.imul(O, T) | 0, y = y + Math.imul(O, st) | 0;
      var xr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (xr >>> 26) | 0, xr &= 67108863, d = Math.imul(tt, k), i = Math.imul(tt, L), i = i + Math.imul(X, k) | 0, y = Math.imul(X, L), d = d + Math.imul($, T) | 0, i = i + Math.imul($, st) | 0, i = i + Math.imul(Z, T) | 0, y = y + Math.imul(Z, st) | 0, d = d + Math.imul(U, ut) | 0, i = i + Math.imul(U, ht) | 0, i = i + Math.imul(O, ut) | 0, y = y + Math.imul(O, ht) | 0;
      var Mr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Mr >>> 26) | 0, Mr &= 67108863, d = Math.imul(V, k), i = Math.imul(V, L), i = i + Math.imul(rt, k) | 0, y = Math.imul(rt, L), d = d + Math.imul(tt, T) | 0, i = i + Math.imul(tt, st) | 0, i = i + Math.imul(X, T) | 0, y = y + Math.imul(X, st) | 0, d = d + Math.imul($, ut) | 0, i = i + Math.imul($, ht) | 0, i = i + Math.imul(Z, ut) | 0, y = y + Math.imul(Z, ht) | 0, d = d + Math.imul(U, at) | 0, i = i + Math.imul(U, lt) | 0, i = i + Math.imul(O, at) | 0, y = y + Math.imul(O, lt) | 0;
      var br = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (br >>> 26) | 0, br &= 67108863, d = Math.imul(K, k), i = Math.imul(K, L), i = i + Math.imul(et, k) | 0, y = Math.imul(et, L), d = d + Math.imul(V, T) | 0, i = i + Math.imul(V, st) | 0, i = i + Math.imul(rt, T) | 0, y = y + Math.imul(rt, st) | 0, d = d + Math.imul(tt, ut) | 0, i = i + Math.imul(tt, ht) | 0, i = i + Math.imul(X, ut) | 0, y = y + Math.imul(X, ht) | 0, d = d + Math.imul($, at) | 0, i = i + Math.imul($, lt) | 0, i = i + Math.imul(Z, at) | 0, y = y + Math.imul(Z, lt) | 0, d = d + Math.imul(U, ct) | 0, i = i + Math.imul(U, dt) | 0, i = i + Math.imul(O, ct) | 0, y = y + Math.imul(O, dt) | 0;
      var Er = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Er >>> 26) | 0, Er &= 67108863, d = Math.imul(Q, k), i = Math.imul(Q, L), i = i + Math.imul(G, k) | 0, y = Math.imul(G, L), d = d + Math.imul(K, T) | 0, i = i + Math.imul(K, st) | 0, i = i + Math.imul(et, T) | 0, y = y + Math.imul(et, st) | 0, d = d + Math.imul(V, ut) | 0, i = i + Math.imul(V, ht) | 0, i = i + Math.imul(rt, ut) | 0, y = y + Math.imul(rt, ht) | 0, d = d + Math.imul(tt, at) | 0, i = i + Math.imul(tt, lt) | 0, i = i + Math.imul(X, at) | 0, y = y + Math.imul(X, lt) | 0, d = d + Math.imul($, ct) | 0, i = i + Math.imul($, dt) | 0, i = i + Math.imul(Z, ct) | 0, y = y + Math.imul(Z, dt) | 0, d = d + Math.imul(U, pt) | 0, i = i + Math.imul(U, mt) | 0, i = i + Math.imul(O, pt) | 0, y = y + Math.imul(O, mt) | 0;
      var Br = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Br >>> 26) | 0, Br &= 67108863, d = Math.imul(W, k), i = Math.imul(W, L), i = i + Math.imul(it, k) | 0, y = Math.imul(it, L), d = d + Math.imul(Q, T) | 0, i = i + Math.imul(Q, st) | 0, i = i + Math.imul(G, T) | 0, y = y + Math.imul(G, st) | 0, d = d + Math.imul(K, ut) | 0, i = i + Math.imul(K, ht) | 0, i = i + Math.imul(et, ut) | 0, y = y + Math.imul(et, ht) | 0, d = d + Math.imul(V, at) | 0, i = i + Math.imul(V, lt) | 0, i = i + Math.imul(rt, at) | 0, y = y + Math.imul(rt, lt) | 0, d = d + Math.imul(tt, ct) | 0, i = i + Math.imul(tt, dt) | 0, i = i + Math.imul(X, ct) | 0, y = y + Math.imul(X, dt) | 0, d = d + Math.imul($, pt) | 0, i = i + Math.imul($, mt) | 0, i = i + Math.imul(Z, pt) | 0, y = y + Math.imul(Z, mt) | 0, d = d + Math.imul(U, yt) | 0, i = i + Math.imul(U, vt) | 0, i = i + Math.imul(O, yt) | 0, y = y + Math.imul(O, vt) | 0;
      var _r = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (_r >>> 26) | 0, _r &= 67108863, d = Math.imul(nt, k), i = Math.imul(nt, L), i = i + Math.imul(a, k) | 0, y = Math.imul(a, L), d = d + Math.imul(W, T) | 0, i = i + Math.imul(W, st) | 0, i = i + Math.imul(it, T) | 0, y = y + Math.imul(it, st) | 0, d = d + Math.imul(Q, ut) | 0, i = i + Math.imul(Q, ht) | 0, i = i + Math.imul(G, ut) | 0, y = y + Math.imul(G, ht) | 0, d = d + Math.imul(K, at) | 0, i = i + Math.imul(K, lt) | 0, i = i + Math.imul(et, at) | 0, y = y + Math.imul(et, lt) | 0, d = d + Math.imul(V, ct) | 0, i = i + Math.imul(V, dt) | 0, i = i + Math.imul(rt, ct) | 0, y = y + Math.imul(rt, dt) | 0, d = d + Math.imul(tt, pt) | 0, i = i + Math.imul(tt, mt) | 0, i = i + Math.imul(X, pt) | 0, y = y + Math.imul(X, mt) | 0, d = d + Math.imul($, yt) | 0, i = i + Math.imul($, vt) | 0, i = i + Math.imul(Z, yt) | 0, y = y + Math.imul(Z, vt) | 0, d = d + Math.imul(U, wt) | 0, i = i + Math.imul(U, gt) | 0, i = i + Math.imul(O, wt) | 0, y = y + Math.imul(O, gt) | 0;
      var Ar = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Ar >>> 26) | 0, Ar &= 67108863, d = Math.imul(e, k), i = Math.imul(e, L), i = i + Math.imul(c, k) | 0, y = Math.imul(c, L), d = d + Math.imul(nt, T) | 0, i = i + Math.imul(nt, st) | 0, i = i + Math.imul(a, T) | 0, y = y + Math.imul(a, st) | 0, d = d + Math.imul(W, ut) | 0, i = i + Math.imul(W, ht) | 0, i = i + Math.imul(it, ut) | 0, y = y + Math.imul(it, ht) | 0, d = d + Math.imul(Q, at) | 0, i = i + Math.imul(Q, lt) | 0, i = i + Math.imul(G, at) | 0, y = y + Math.imul(G, lt) | 0, d = d + Math.imul(K, ct) | 0, i = i + Math.imul(K, dt) | 0, i = i + Math.imul(et, ct) | 0, y = y + Math.imul(et, dt) | 0, d = d + Math.imul(V, pt) | 0, i = i + Math.imul(V, mt) | 0, i = i + Math.imul(rt, pt) | 0, y = y + Math.imul(rt, mt) | 0, d = d + Math.imul(tt, yt) | 0, i = i + Math.imul(tt, vt) | 0, i = i + Math.imul(X, yt) | 0, y = y + Math.imul(X, vt) | 0, d = d + Math.imul($, wt) | 0, i = i + Math.imul($, gt) | 0, i = i + Math.imul(Z, wt) | 0, y = y + Math.imul(Z, gt) | 0, d = d + Math.imul(U, xt) | 0, i = i + Math.imul(U, Mt) | 0, i = i + Math.imul(O, xt) | 0, y = y + Math.imul(O, Mt) | 0;
      var Fr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Fr >>> 26) | 0, Fr &= 67108863, d = Math.imul(E, k), i = Math.imul(E, L), i = i + Math.imul(_, k) | 0, y = Math.imul(_, L), d = d + Math.imul(e, T) | 0, i = i + Math.imul(e, st) | 0, i = i + Math.imul(c, T) | 0, y = y + Math.imul(c, st) | 0, d = d + Math.imul(nt, ut) | 0, i = i + Math.imul(nt, ht) | 0, i = i + Math.imul(a, ut) | 0, y = y + Math.imul(a, ht) | 0, d = d + Math.imul(W, at) | 0, i = i + Math.imul(W, lt) | 0, i = i + Math.imul(it, at) | 0, y = y + Math.imul(it, lt) | 0, d = d + Math.imul(Q, ct) | 0, i = i + Math.imul(Q, dt) | 0, i = i + Math.imul(G, ct) | 0, y = y + Math.imul(G, dt) | 0, d = d + Math.imul(K, pt) | 0, i = i + Math.imul(K, mt) | 0, i = i + Math.imul(et, pt) | 0, y = y + Math.imul(et, mt) | 0, d = d + Math.imul(V, yt) | 0, i = i + Math.imul(V, vt) | 0, i = i + Math.imul(rt, yt) | 0, y = y + Math.imul(rt, vt) | 0, d = d + Math.imul(tt, wt) | 0, i = i + Math.imul(tt, gt) | 0, i = i + Math.imul(X, wt) | 0, y = y + Math.imul(X, gt) | 0, d = d + Math.imul($, xt) | 0, i = i + Math.imul($, Mt) | 0, i = i + Math.imul(Z, xt) | 0, y = y + Math.imul(Z, Mt) | 0, d = d + Math.imul(U, bt) | 0, i = i + Math.imul(U, Et) | 0, i = i + Math.imul(O, bt) | 0, y = y + Math.imul(O, Et) | 0;
      var Ir = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Ir >>> 26) | 0, Ir &= 67108863, d = Math.imul(E, T), i = Math.imul(E, st), i = i + Math.imul(_, T) | 0, y = Math.imul(_, st), d = d + Math.imul(e, ut) | 0, i = i + Math.imul(e, ht) | 0, i = i + Math.imul(c, ut) | 0, y = y + Math.imul(c, ht) | 0, d = d + Math.imul(nt, at) | 0, i = i + Math.imul(nt, lt) | 0, i = i + Math.imul(a, at) | 0, y = y + Math.imul(a, lt) | 0, d = d + Math.imul(W, ct) | 0, i = i + Math.imul(W, dt) | 0, i = i + Math.imul(it, ct) | 0, y = y + Math.imul(it, dt) | 0, d = d + Math.imul(Q, pt) | 0, i = i + Math.imul(Q, mt) | 0, i = i + Math.imul(G, pt) | 0, y = y + Math.imul(G, mt) | 0, d = d + Math.imul(K, yt) | 0, i = i + Math.imul(K, vt) | 0, i = i + Math.imul(et, yt) | 0, y = y + Math.imul(et, vt) | 0, d = d + Math.imul(V, wt) | 0, i = i + Math.imul(V, gt) | 0, i = i + Math.imul(rt, wt) | 0, y = y + Math.imul(rt, gt) | 0, d = d + Math.imul(tt, xt) | 0, i = i + Math.imul(tt, Mt) | 0, i = i + Math.imul(X, xt) | 0, y = y + Math.imul(X, Mt) | 0, d = d + Math.imul($, bt) | 0, i = i + Math.imul($, Et) | 0, i = i + Math.imul(Z, bt) | 0, y = y + Math.imul(Z, Et) | 0;
      var Sr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Sr >>> 26) | 0, Sr &= 67108863, d = Math.imul(E, ut), i = Math.imul(E, ht), i = i + Math.imul(_, ut) | 0, y = Math.imul(_, ht), d = d + Math.imul(e, at) | 0, i = i + Math.imul(e, lt) | 0, i = i + Math.imul(c, at) | 0, y = y + Math.imul(c, lt) | 0, d = d + Math.imul(nt, ct) | 0, i = i + Math.imul(nt, dt) | 0, i = i + Math.imul(a, ct) | 0, y = y + Math.imul(a, dt) | 0, d = d + Math.imul(W, pt) | 0, i = i + Math.imul(W, mt) | 0, i = i + Math.imul(it, pt) | 0, y = y + Math.imul(it, mt) | 0, d = d + Math.imul(Q, yt) | 0, i = i + Math.imul(Q, vt) | 0, i = i + Math.imul(G, yt) | 0, y = y + Math.imul(G, vt) | 0, d = d + Math.imul(K, wt) | 0, i = i + Math.imul(K, gt) | 0, i = i + Math.imul(et, wt) | 0, y = y + Math.imul(et, gt) | 0, d = d + Math.imul(V, xt) | 0, i = i + Math.imul(V, Mt) | 0, i = i + Math.imul(rt, xt) | 0, y = y + Math.imul(rt, Mt) | 0, d = d + Math.imul(tt, bt) | 0, i = i + Math.imul(tt, Et) | 0, i = i + Math.imul(X, bt) | 0, y = y + Math.imul(X, Et) | 0;
      var Ur = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Ur >>> 26) | 0, Ur &= 67108863, d = Math.imul(E, at), i = Math.imul(E, lt), i = i + Math.imul(_, at) | 0, y = Math.imul(_, lt), d = d + Math.imul(e, ct) | 0, i = i + Math.imul(e, dt) | 0, i = i + Math.imul(c, ct) | 0, y = y + Math.imul(c, dt) | 0, d = d + Math.imul(nt, pt) | 0, i = i + Math.imul(nt, mt) | 0, i = i + Math.imul(a, pt) | 0, y = y + Math.imul(a, mt) | 0, d = d + Math.imul(W, yt) | 0, i = i + Math.imul(W, vt) | 0, i = i + Math.imul(it, yt) | 0, y = y + Math.imul(it, vt) | 0, d = d + Math.imul(Q, wt) | 0, i = i + Math.imul(Q, gt) | 0, i = i + Math.imul(G, wt) | 0, y = y + Math.imul(G, gt) | 0, d = d + Math.imul(K, xt) | 0, i = i + Math.imul(K, Mt) | 0, i = i + Math.imul(et, xt) | 0, y = y + Math.imul(et, Mt) | 0, d = d + Math.imul(V, bt) | 0, i = i + Math.imul(V, Et) | 0, i = i + Math.imul(rt, bt) | 0, y = y + Math.imul(rt, Et) | 0;
      var Rr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Rr >>> 26) | 0, Rr &= 67108863, d = Math.imul(E, ct), i = Math.imul(E, dt), i = i + Math.imul(_, ct) | 0, y = Math.imul(_, dt), d = d + Math.imul(e, pt) | 0, i = i + Math.imul(e, mt) | 0, i = i + Math.imul(c, pt) | 0, y = y + Math.imul(c, mt) | 0, d = d + Math.imul(nt, yt) | 0, i = i + Math.imul(nt, vt) | 0, i = i + Math.imul(a, yt) | 0, y = y + Math.imul(a, vt) | 0, d = d + Math.imul(W, wt) | 0, i = i + Math.imul(W, gt) | 0, i = i + Math.imul(it, wt) | 0, y = y + Math.imul(it, gt) | 0, d = d + Math.imul(Q, xt) | 0, i = i + Math.imul(Q, Mt) | 0, i = i + Math.imul(G, xt) | 0, y = y + Math.imul(G, Mt) | 0, d = d + Math.imul(K, bt) | 0, i = i + Math.imul(K, Et) | 0, i = i + Math.imul(et, bt) | 0, y = y + Math.imul(et, Et) | 0;
      var Tr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Tr >>> 26) | 0, Tr &= 67108863, d = Math.imul(E, pt), i = Math.imul(E, mt), i = i + Math.imul(_, pt) | 0, y = Math.imul(_, mt), d = d + Math.imul(e, yt) | 0, i = i + Math.imul(e, vt) | 0, i = i + Math.imul(c, yt) | 0, y = y + Math.imul(c, vt) | 0, d = d + Math.imul(nt, wt) | 0, i = i + Math.imul(nt, gt) | 0, i = i + Math.imul(a, wt) | 0, y = y + Math.imul(a, gt) | 0, d = d + Math.imul(W, xt) | 0, i = i + Math.imul(W, Mt) | 0, i = i + Math.imul(it, xt) | 0, y = y + Math.imul(it, Mt) | 0, d = d + Math.imul(Q, bt) | 0, i = i + Math.imul(Q, Et) | 0, i = i + Math.imul(G, bt) | 0, y = y + Math.imul(G, Et) | 0;
      var Or = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Or >>> 26) | 0, Or &= 67108863, d = Math.imul(E, yt), i = Math.imul(E, vt), i = i + Math.imul(_, yt) | 0, y = Math.imul(_, vt), d = d + Math.imul(e, wt) | 0, i = i + Math.imul(e, gt) | 0, i = i + Math.imul(c, wt) | 0, y = y + Math.imul(c, gt) | 0, d = d + Math.imul(nt, xt) | 0, i = i + Math.imul(nt, Mt) | 0, i = i + Math.imul(a, xt) | 0, y = y + Math.imul(a, Mt) | 0, d = d + Math.imul(W, bt) | 0, i = i + Math.imul(W, Et) | 0, i = i + Math.imul(it, bt) | 0, y = y + Math.imul(it, Et) | 0;
      var Lr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Lr >>> 26) | 0, Lr &= 67108863, d = Math.imul(E, wt), i = Math.imul(E, gt), i = i + Math.imul(_, wt) | 0, y = Math.imul(_, gt), d = d + Math.imul(e, xt) | 0, i = i + Math.imul(e, Mt) | 0, i = i + Math.imul(c, xt) | 0, y = y + Math.imul(c, Mt) | 0, d = d + Math.imul(nt, bt) | 0, i = i + Math.imul(nt, Et) | 0, i = i + Math.imul(a, bt) | 0, y = y + Math.imul(a, Et) | 0;
      var kr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (kr >>> 26) | 0, kr &= 67108863, d = Math.imul(E, xt), i = Math.imul(E, Mt), i = i + Math.imul(_, xt) | 0, y = Math.imul(_, Mt), d = d + Math.imul(e, bt) | 0, i = i + Math.imul(e, Et) | 0, i = i + Math.imul(c, bt) | 0, y = y + Math.imul(c, Et) | 0;
      var Cr = (B + d | 0) + ((i & 8191) << 13) | 0;
      B = (y + (i >>> 13) | 0) + (Cr >>> 26) | 0, Cr &= 67108863, d = Math.imul(E, bt), i = Math.imul(E, Et), i = i + Math.imul(_, bt) | 0, y = Math.imul(_, Et);
      var Dr = (B + d | 0) + ((i & 8191) << 13) | 0;
      return B = (y + (i >>> 13) | 0) + (Dr >>> 26) | 0, Dr &= 67108863, b[0] = gr, b[1] = xr, b[2] = Mr, b[3] = br, b[4] = Er, b[5] = Br, b[6] = _r, b[7] = Ar, b[8] = Fr, b[9] = Ir, b[10] = Sr, b[11] = Ur, b[12] = Rr, b[13] = Tr, b[14] = Or, b[15] = Lr, b[16] = kr, b[17] = Cr, b[18] = Dr, B !== 0 && (b[19] = B, l.length++), l;
    };
    Math.imul || (ot = H);
    function At(g, t, s) {
      s.negative = t.negative ^ g.negative, s.length = g.length + t.length;
      for (var l = 0, p = 0, v = 0; v < s.length - 1; v++) {
        var b = p;
        p = 0;
        for (var B = l & 67108863, d = Math.min(v, t.length - 1), i = Math.max(0, v - g.length + 1); i <= d; i++) {
          var y = v - i, R = g.words[y] | 0, U = t.words[i] | 0, O = R * U, Bt = O & 67108863;
          b = b + (O / 67108864 | 0) | 0, Bt = Bt + B | 0, B = Bt & 67108863, b = b + (Bt >>> 26) | 0, p += b >>> 26, b &= 67108863;
        }
        s.words[v] = B, l = b, b = p;
      }
      return l !== 0 ? s.words[v] = l : s.length--, s._strip();
    }
    function Ut(g, t, s) {
      return At(g, t, s);
    }
    f.prototype.mulTo = function(t, s) {
      var l, p = this.length + t.length;
      return this.length === 10 && t.length === 10 ? l = ot(this, t, s) : p < 63 ? l = H(this, t, s) : p < 1024 ? l = At(this, t, s) : l = Ut(this, t, s), l;
    }, f.prototype.mul = function(t) {
      var s = new f(null);
      return s.words = new Array(this.length + t.length), this.mulTo(t, s);
    }, f.prototype.mulf = function(t) {
      var s = new f(null);
      return s.words = new Array(this.length + t.length), Ut(this, t, s);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      var s = t < 0;
      s && (t = -t), h(typeof t == "number"), h(t < 67108864);
      for (var l = 0, p = 0; p < this.length; p++) {
        var v = (this.words[p] | 0) * t, b = (v & 67108863) + (l & 67108863);
        l >>= 26, l += v / 67108864 | 0, l += b >>> 26, this.words[p] = b & 67108863;
      }
      return l !== 0 && (this.words[p] = l, this.length++), s ? this.ineg() : this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var s = _t(t);
      if (s.length === 0)
        return new f(1);
      for (var l = this, p = 0; p < s.length && s[p] === 0; p++, l = l.sqr())
        ;
      if (++p < s.length)
        for (var v = l.sqr(); p < s.length; p++, v = v.sqr())
          s[p] !== 0 && (l = l.mul(v));
      return l;
    }, f.prototype.iushln = function(t) {
      h(typeof t == "number" && t >= 0);
      var s = t % 26, l = (t - s) / 26, p = 67108863 >>> 26 - s << 26 - s, v;
      if (s !== 0) {
        var b = 0;
        for (v = 0; v < this.length; v++) {
          var B = this.words[v] & p, d = (this.words[v] | 0) - B << s;
          this.words[v] = d | b, b = B >>> 26 - s;
        }
        b && (this.words[v] = b, this.length++);
      }
      if (l !== 0) {
        for (v = this.length - 1; v >= 0; v--)
          this.words[v + l] = this.words[v];
        for (v = 0; v < l; v++)
          this.words[v] = 0;
        this.length += l;
      }
      return this._strip();
    }, f.prototype.ishln = function(t) {
      return h(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, s, l) {
      h(typeof t == "number" && t >= 0);
      var p;
      s ? p = (s - s % 26) / 26 : p = 0;
      var v = t % 26, b = Math.min((t - v) / 26, this.length), B = 67108863 ^ 67108863 >>> v << v, d = l;
      if (p -= b, p = Math.max(0, p), d) {
        for (var i = 0; i < b; i++)
          d.words[i] = this.words[i];
        d.length = b;
      }
      if (b !== 0)
        if (this.length > b)
          for (this.length -= b, i = 0; i < this.length; i++)
            this.words[i] = this.words[i + b];
        else
          this.words[0] = 0, this.length = 1;
      var y = 0;
      for (i = this.length - 1; i >= 0 && (y !== 0 || i >= p); i--) {
        var R = this.words[i] | 0;
        this.words[i] = y << 26 - v | R >>> v, y = R & B;
      }
      return d && y !== 0 && (d.words[d.length++] = y), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, f.prototype.ishrn = function(t, s, l) {
      return h(this.negative === 0), this.iushrn(t, s, l);
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
      var s = t % 26, l = (t - s) / 26, p = 1 << s;
      if (this.length <= l)
        return !1;
      var v = this.words[l];
      return !!(v & p);
    }, f.prototype.imaskn = function(t) {
      h(typeof t == "number" && t >= 0);
      var s = t % 26, l = (t - s) / 26;
      if (h(this.negative === 0, "imaskn works only with positive numbers"), this.length <= l)
        return this;
      if (s !== 0 && l++, this.length = Math.min(l, this.length), s !== 0) {
        var p = 67108863 ^ 67108863 >>> s << s;
        this.words[this.length - 1] &= p;
      }
      return this._strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return h(typeof t == "number"), h(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var s = 0; s < this.length && this.words[s] >= 67108864; s++)
        this.words[s] -= 67108864, s === this.length - 1 ? this.words[s + 1] = 1 : this.words[s + 1]++;
      return this.length = Math.max(this.length, s + 1), this;
    }, f.prototype.isubn = function(t) {
      if (h(typeof t == "number"), h(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var s = 0; s < this.length && this.words[s] < 0; s++)
          this.words[s] += 67108864, this.words[s + 1] -= 1;
      return this._strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, s, l) {
      var p = t.length + l, v;
      this._expand(p);
      var b, B = 0;
      for (v = 0; v < t.length; v++) {
        b = (this.words[v + l] | 0) + B;
        var d = (t.words[v] | 0) * s;
        b -= d & 67108863, B = (b >> 26) - (d / 67108864 | 0), this.words[v + l] = b & 67108863;
      }
      for (; v < this.length - l; v++)
        b = (this.words[v + l] | 0) + B, B = b >> 26, this.words[v + l] = b & 67108863;
      if (B === 0)
        return this._strip();
      for (h(B === -1), B = 0, v = 0; v < this.length; v++)
        b = -(this.words[v] | 0) + B, B = b >> 26, this.words[v] = b & 67108863;
      return this.negative = 1, this._strip();
    }, f.prototype._wordDiv = function(t, s) {
      var l = this.length - t.length, p = this.clone(), v = t, b = v.words[v.length - 1] | 0, B = this._countBits(b);
      l = 26 - B, l !== 0 && (v = v.ushln(l), p.iushln(l), b = v.words[v.length - 1] | 0);
      var d = p.length - v.length, i;
      if (s !== "mod") {
        i = new f(null), i.length = d + 1, i.words = new Array(i.length);
        for (var y = 0; y < i.length; y++)
          i.words[y] = 0;
      }
      var R = p.clone()._ishlnsubmul(v, 1, d);
      R.negative === 0 && (p = R, i && (i.words[d] = 1));
      for (var U = d - 1; U >= 0; U--) {
        var O = (p.words[v.length + U] | 0) * 67108864 + (p.words[v.length + U - 1] | 0);
        for (O = Math.min(O / b | 0, 67108863), p._ishlnsubmul(v, O, U); p.negative !== 0; )
          O--, p.negative = 0, p._ishlnsubmul(v, 1, U), p.isZero() || (p.negative ^= 1);
        i && (i.words[U] = O);
      }
      return i && i._strip(), p._strip(), s !== "div" && l !== 0 && p.iushrn(l), {
        div: i || null,
        mod: p
      };
    }, f.prototype.divmod = function(t, s, l) {
      if (h(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var p, v, b;
      return this.negative !== 0 && t.negative === 0 ? (b = this.neg().divmod(t, s), s !== "mod" && (p = b.div.neg()), s !== "div" && (v = b.mod.neg(), l && v.negative !== 0 && v.iadd(t)), {
        div: p,
        mod: v
      }) : this.negative === 0 && t.negative !== 0 ? (b = this.divmod(t.neg(), s), s !== "mod" && (p = b.div.neg()), {
        div: p,
        mod: b.mod
      }) : (this.negative & t.negative) !== 0 ? (b = this.neg().divmod(t.neg(), s), s !== "div" && (v = b.mod.neg(), l && v.negative !== 0 && v.isub(t)), {
        div: b.div,
        mod: v
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? s === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : s === "mod" ? {
        div: null,
        mod: new f(this.modrn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modrn(t.words[0]))
      } : this._wordDiv(t, s);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var s = this.divmod(t);
      if (s.mod.isZero())
        return s.div;
      var l = s.div.negative !== 0 ? s.mod.isub(t) : s.mod, p = t.ushrn(1), v = t.andln(1), b = l.cmp(p);
      return b < 0 || v === 1 && b === 0 ? s.div : s.div.negative !== 0 ? s.div.isubn(1) : s.div.iaddn(1);
    }, f.prototype.modrn = function(t) {
      var s = t < 0;
      s && (t = -t), h(t <= 67108863);
      for (var l = (1 << 26) % t, p = 0, v = this.length - 1; v >= 0; v--)
        p = (l * p + (this.words[v] | 0)) % t;
      return s ? -p : p;
    }, f.prototype.modn = function(t) {
      return this.modrn(t);
    }, f.prototype.idivn = function(t) {
      var s = t < 0;
      s && (t = -t), h(t <= 67108863);
      for (var l = 0, p = this.length - 1; p >= 0; p--) {
        var v = (this.words[p] | 0) + l * 67108864;
        this.words[p] = v / t | 0, l = v % t;
      }
      return this._strip(), s ? this.ineg() : this;
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      h(t.negative === 0), h(!t.isZero());
      var s = this, l = t.clone();
      s.negative !== 0 ? s = s.umod(t) : s = s.clone();
      for (var p = new f(1), v = new f(0), b = new f(0), B = new f(1), d = 0; s.isEven() && l.isEven(); )
        s.iushrn(1), l.iushrn(1), ++d;
      for (var i = l.clone(), y = s.clone(); !s.isZero(); ) {
        for (var R = 0, U = 1; (s.words[0] & U) === 0 && R < 26; ++R, U <<= 1)
          ;
        if (R > 0)
          for (s.iushrn(R); R-- > 0; )
            (p.isOdd() || v.isOdd()) && (p.iadd(i), v.isub(y)), p.iushrn(1), v.iushrn(1);
        for (var O = 0, Bt = 1; (l.words[0] & Bt) === 0 && O < 26; ++O, Bt <<= 1)
          ;
        if (O > 0)
          for (l.iushrn(O); O-- > 0; )
            (b.isOdd() || B.isOdd()) && (b.iadd(i), B.isub(y)), b.iushrn(1), B.iushrn(1);
        s.cmp(l) >= 0 ? (s.isub(l), p.isub(b), v.isub(B)) : (l.isub(s), b.isub(p), B.isub(v));
      }
      return {
        a: b,
        b: B,
        gcd: l.iushln(d)
      };
    }, f.prototype._invmp = function(t) {
      h(t.negative === 0), h(!t.isZero());
      var s = this, l = t.clone();
      s.negative !== 0 ? s = s.umod(t) : s = s.clone();
      for (var p = new f(1), v = new f(0), b = l.clone(); s.cmpn(1) > 0 && l.cmpn(1) > 0; ) {
        for (var B = 0, d = 1; (s.words[0] & d) === 0 && B < 26; ++B, d <<= 1)
          ;
        if (B > 0)
          for (s.iushrn(B); B-- > 0; )
            p.isOdd() && p.iadd(b), p.iushrn(1);
        for (var i = 0, y = 1; (l.words[0] & y) === 0 && i < 26; ++i, y <<= 1)
          ;
        if (i > 0)
          for (l.iushrn(i); i-- > 0; )
            v.isOdd() && v.iadd(b), v.iushrn(1);
        s.cmp(l) >= 0 ? (s.isub(l), p.isub(v)) : (l.isub(s), v.isub(p));
      }
      var R;
      return s.cmpn(1) === 0 ? R = p : R = v, R.cmpn(0) < 0 && R.iadd(t), R;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var s = this.clone(), l = t.clone();
      s.negative = 0, l.negative = 0;
      for (var p = 0; s.isEven() && l.isEven(); p++)
        s.iushrn(1), l.iushrn(1);
      do {
        for (; s.isEven(); )
          s.iushrn(1);
        for (; l.isEven(); )
          l.iushrn(1);
        var v = s.cmp(l);
        if (v < 0) {
          var b = s;
          s = l, l = b;
        } else if (v === 0 || l.cmpn(1) === 0)
          break;
        s.isub(l);
      } while (!0);
      return l.iushln(p);
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
      var s = t % 26, l = (t - s) / 26, p = 1 << s;
      if (this.length <= l)
        return this._expand(l + 1), this.words[l] |= p, this;
      for (var v = p, b = l; v !== 0 && b < this.length; b++) {
        var B = this.words[b] | 0;
        B += v, v = B >>> 26, B &= 67108863, this.words[b] = B;
      }
      return v !== 0 && (this.words[b] = v, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var s = t < 0;
      if (this.negative !== 0 && !s)
        return -1;
      if (this.negative === 0 && s)
        return 1;
      this._strip();
      var l;
      if (this.length > 1)
        l = 1;
      else {
        s && (t = -t), h(t <= 67108863, "Number is too big");
        var p = this.words[0] | 0;
        l = p === t ? 0 : p < t ? -1 : 1;
      }
      return this.negative !== 0 ? -l | 0 : l;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var s = this.ucmp(t);
      return this.negative !== 0 ? -s | 0 : s;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var s = 0, l = this.length - 1; l >= 0; l--) {
        var p = this.words[l] | 0, v = t.words[l] | 0;
        if (p !== v) {
          p < v ? s = -1 : p > v && (s = 1);
          break;
        }
      }
      return s;
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
      return new J(t);
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
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function q(g, t) {
      this.name = g, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    q.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, q.prototype.ireduce = function(t) {
      var s = t, l;
      do
        this.split(s, this.tmp), s = this.imulK(s), s = s.iadd(this.tmp), l = s.bitLength();
      while (l > this.n);
      var p = l < this.n ? -1 : s.ucmp(this.p);
      return p === 0 ? (s.words[0] = 0, s.length = 1) : p > 0 ? s.isub(this.p) : s.strip !== void 0 ? s.strip() : s._strip(), s;
    }, q.prototype.split = function(t, s) {
      t.iushrn(this.n, 0, s);
    }, q.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function Ft() {
      q.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(Ft, q), Ft.prototype.split = function(t, s) {
      for (var l = 4194303, p = Math.min(t.length, 9), v = 0; v < p; v++)
        s.words[v] = t.words[v];
      if (s.length = p, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var b = t.words[9];
      for (s.words[s.length++] = b & l, v = 10; v < t.length; v++) {
        var B = t.words[v] | 0;
        t.words[v - 10] = (B & l) << 4 | b >>> 22, b = B;
      }
      b >>>= 22, t.words[v - 10] = b, b === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, Ft.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var s = 0, l = 0; l < t.length; l++) {
        var p = t.words[l] | 0;
        s += p * 977, t.words[l] = s & 67108863, s = p * 64 + (s / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function $t() {
      q.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m($t, q);
    function or() {
      q.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(or, q);
    function tr() {
      q.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(tr, q), tr.prototype.imulK = function(t) {
      for (var s = 0, l = 0; l < t.length; l++) {
        var p = (t.words[l] | 0) * 19 + s, v = p & 67108863;
        p >>>= 26, t.words[l] = v, s = p;
      }
      return s !== 0 && (t.words[t.length++] = s), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var s;
      if (t === "k256")
        s = new Ft();
      else if (t === "p224")
        s = new $t();
      else if (t === "p192")
        s = new or();
      else if (t === "p25519")
        s = new tr();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = s, s;
    };
    function J(g) {
      if (typeof g == "string") {
        var t = f._prime(g);
        this.m = t.p, this.prime = t;
      } else
        h(g.gtn(1), "modulus must be greater than 1"), this.m = g, this.prime = null;
    }
    J.prototype._verify1 = function(t) {
      h(t.negative === 0, "red works only with positives"), h(t.red, "red works only with red numbers");
    }, J.prototype._verify2 = function(t, s) {
      h((t.negative | s.negative) === 0, "red works only with positives"), h(
        t.red && t.red === s.red,
        "red works only with red numbers"
      );
    }, J.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : (S(t, t.umod(this.m)._forceRed(this)), t);
    }, J.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, J.prototype.add = function(t, s) {
      this._verify2(t, s);
      var l = t.add(s);
      return l.cmp(this.m) >= 0 && l.isub(this.m), l._forceRed(this);
    }, J.prototype.iadd = function(t, s) {
      this._verify2(t, s);
      var l = t.iadd(s);
      return l.cmp(this.m) >= 0 && l.isub(this.m), l;
    }, J.prototype.sub = function(t, s) {
      this._verify2(t, s);
      var l = t.sub(s);
      return l.cmpn(0) < 0 && l.iadd(this.m), l._forceRed(this);
    }, J.prototype.isub = function(t, s) {
      this._verify2(t, s);
      var l = t.isub(s);
      return l.cmpn(0) < 0 && l.iadd(this.m), l;
    }, J.prototype.shl = function(t, s) {
      return this._verify1(t), this.imod(t.ushln(s));
    }, J.prototype.imul = function(t, s) {
      return this._verify2(t, s), this.imod(t.imul(s));
    }, J.prototype.mul = function(t, s) {
      return this._verify2(t, s), this.imod(t.mul(s));
    }, J.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, J.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, J.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var s = this.m.andln(3);
      if (h(s % 2 === 1), s === 3) {
        var l = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, l);
      }
      for (var p = this.m.subn(1), v = 0; !p.isZero() && p.andln(1) === 0; )
        v++, p.iushrn(1);
      h(!p.isZero());
      var b = new f(1).toRed(this), B = b.redNeg(), d = this.m.subn(1).iushrn(1), i = this.m.bitLength();
      for (i = new f(2 * i * i).toRed(this); this.pow(i, d).cmp(B) !== 0; )
        i.redIAdd(B);
      for (var y = this.pow(i, p), R = this.pow(t, p.addn(1).iushrn(1)), U = this.pow(t, p), O = v; U.cmp(b) !== 0; ) {
        for (var Bt = U, $ = 0; Bt.cmp(b) !== 0; $++)
          Bt = Bt.redSqr();
        h($ < O);
        var Z = this.pow(y, new f(1).iushln(O - $ - 1));
        R = R.redMul(Z), y = Z.redSqr(), U = U.redMul(y), O = $;
      }
      return R;
    }, J.prototype.invm = function(t) {
      var s = t._invmp(this.m);
      return s.negative !== 0 ? (s.negative = 0, this.imod(s).redNeg()) : this.imod(s);
    }, J.prototype.pow = function(t, s) {
      if (s.isZero())
        return new f(1).toRed(this);
      if (s.cmpn(1) === 0)
        return t.clone();
      var l = 4, p = new Array(1 << l);
      p[0] = new f(1).toRed(this), p[1] = t;
      for (var v = 2; v < p.length; v++)
        p[v] = this.mul(p[v - 1], t);
      var b = p[0], B = 0, d = 0, i = s.bitLength() % 26;
      for (i === 0 && (i = 26), v = s.length - 1; v >= 0; v--) {
        for (var y = s.words[v], R = i - 1; R >= 0; R--) {
          var U = y >> R & 1;
          if (b !== p[0] && (b = this.sqr(b)), U === 0 && B === 0) {
            d = 0;
            continue;
          }
          B <<= 1, B |= U, d++, !(d !== l && (v !== 0 || R !== 0)) && (b = this.mul(b, p[B]), d = 0, B = 0);
        }
        i = 26;
      }
      return b;
    }, J.prototype.convertTo = function(t) {
      var s = t.umod(this.m);
      return s === t ? s.clone() : s;
    }, J.prototype.convertFrom = function(t) {
      var s = t.clone();
      return s.red = null, s;
    }, f.mont = function(t) {
      return new zt(t);
    };
    function zt(g) {
      J.call(this, g), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(zt, J), zt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, zt.prototype.convertFrom = function(t) {
      var s = this.imod(t.mul(this.rinv));
      return s.red = null, s;
    }, zt.prototype.imul = function(t, s) {
      if (t.isZero() || s.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var l = t.imul(s), p = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = l.isub(p).iushrn(this.shift), b = v;
      return v.cmp(this.m) >= 0 ? b = v.isub(this.m) : v.cmpn(0) < 0 && (b = v.iadd(this.m)), b._forceRed(this);
    }, zt.prototype.mul = function(t, s) {
      if (t.isZero() || s.isZero())
        return new f(0)._forceRed(this);
      var l = t.mul(s), p = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = l.isub(p).iushrn(this.shift), b = v;
      return v.cmp(this.m) >= 0 ? b = v.isub(this.m) : v.cmpn(0) < 0 && (b = v.iadd(this.m)), b._forceRed(this);
    }, zt.prototype.invm = function(t) {
      var s = this.imod(t._invmp(this.m).mul(this.r2));
      return s._forceRed(this);
    };
  })(n, Ct);
})(Ue);
var Wr = { exports: {} }, re = {}, vr = {};
vr.byteLength = zi;
vr.toByteArray = Zi;
vr.fromByteArray = Yi;
var Dt = [], Lt = [], Ni = typeof Uint8Array < "u" ? Uint8Array : Array, $r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ht = 0, $i = $r.length; Ht < $i; ++Ht)
  Dt[Ht] = $r[Ht], Lt[$r.charCodeAt(Ht)] = Ht;
Lt["-".charCodeAt(0)] = 62;
Lt["_".charCodeAt(0)] = 63;
function Re(n) {
  var o = n.length;
  if (o % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var u = n.indexOf("=");
  u === -1 && (u = o);
  var h = u === o ? 0 : 4 - u % 4;
  return [u, h];
}
function zi(n) {
  var o = Re(n), u = o[0], h = o[1];
  return (u + h) * 3 / 4 - h;
}
function qi(n, o, u) {
  return (o + u) * 3 / 4 - u;
}
function Zi(n) {
  var o, u = Re(n), h = u[0], m = u[1], f = new Ni(qi(n, h, m)), x = 0, w = m > 0 ? h - 4 : h, A;
  for (A = 0; A < w; A += 4)
    o = Lt[n.charCodeAt(A)] << 18 | Lt[n.charCodeAt(A + 1)] << 12 | Lt[n.charCodeAt(A + 2)] << 6 | Lt[n.charCodeAt(A + 3)], f[x++] = o >> 16 & 255, f[x++] = o >> 8 & 255, f[x++] = o & 255;
  return m === 2 && (o = Lt[n.charCodeAt(A)] << 2 | Lt[n.charCodeAt(A + 1)] >> 4, f[x++] = o & 255), m === 1 && (o = Lt[n.charCodeAt(A)] << 10 | Lt[n.charCodeAt(A + 1)] << 4 | Lt[n.charCodeAt(A + 2)] >> 2, f[x++] = o >> 8 & 255, f[x++] = o & 255), f;
}
function Vi(n) {
  return Dt[n >> 18 & 63] + Dt[n >> 12 & 63] + Dt[n >> 6 & 63] + Dt[n & 63];
}
function Gi(n, o, u) {
  for (var h, m = [], f = o; f < u; f += 3)
    h = (n[f] << 16 & 16711680) + (n[f + 1] << 8 & 65280) + (n[f + 2] & 255), m.push(Vi(h));
  return m.join("");
}
function Yi(n) {
  for (var o, u = n.length, h = u % 3, m = [], f = 16383, x = 0, w = u - h; x < w; x += f)
    m.push(Gi(n, x, x + f > w ? w : x + f));
  return h === 1 ? (o = n[u - 1], m.push(
    Dt[o >> 2] + Dt[o << 4 & 63] + "=="
  )) : h === 2 && (o = (n[u - 2] << 8) + n[u - 1], m.push(
    Dt[o >> 10] + Dt[o >> 4 & 63] + Dt[o << 2 & 63] + "="
  )), m.join("");
}
var ee = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ee.read = function(n, o, u, h, m) {
  var f, x, w = m * 8 - h - 1, A = (1 << w) - 1, F = A >> 1, S = -7, P = u ? m - 1 : 0, D = u ? -1 : 1, I = n[o + P];
  for (P += D, f = I & (1 << -S) - 1, I >>= -S, S += w; S > 0; f = f * 256 + n[o + P], P += D, S -= 8)
    ;
  for (x = f & (1 << -S) - 1, f >>= -S, S += h; S > 0; x = x * 256 + n[o + P], P += D, S -= 8)
    ;
  if (f === 0)
    f = 1 - F;
  else {
    if (f === A)
      return x ? NaN : (I ? -1 : 1) * (1 / 0);
    x = x + Math.pow(2, h), f = f - F;
  }
  return (I ? -1 : 1) * x * Math.pow(2, f - h);
};
ee.write = function(n, o, u, h, m, f) {
  var x, w, A, F = f * 8 - m - 1, S = (1 << F) - 1, P = S >> 1, D = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, I = h ? 0 : f - 1, z = h ? 1 : -1, N = o < 0 || o === 0 && 1 / o < 0 ? 1 : 0;
  for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, x = S) : (x = Math.floor(Math.log(o) / Math.LN2), o * (A = Math.pow(2, -x)) < 1 && (x--, A *= 2), x + P >= 1 ? o += D / A : o += D * Math.pow(2, 1 - P), o * A >= 2 && (x++, A /= 2), x + P >= S ? (w = 0, x = S) : x + P >= 1 ? (w = (o * A - 1) * Math.pow(2, m), x = x + P) : (w = o * Math.pow(2, P - 1) * Math.pow(2, m), x = 0)); m >= 8; n[u + I] = w & 255, I += z, w /= 256, m -= 8)
    ;
  for (x = x << m | w, F += m; F > 0; n[u + I] = x & 255, I += z, x /= 256, F -= 8)
    ;
  n[u + I - z] |= N * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(n) {
  const o = vr, u = ee, h = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = w, n.SlowBuffer = ot, n.INSPECT_MAX_BYTES = 50;
  const m = 2147483647;
  n.kMaxLength = m, w.TYPED_ARRAY_SUPPORT = f(), !w.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
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
  Object.defineProperty(w.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (!!w.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(w.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (!!w.isBuffer(this))
        return this.byteOffset;
    }
  });
  function x(a) {
    if (a > m)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
    const r = new Uint8Array(a);
    return Object.setPrototypeOf(r, w.prototype), r;
  }
  function w(a, r, e) {
    if (typeof a == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return P(a);
    }
    return A(a, r, e);
  }
  w.poolSize = 8192;
  function A(a, r, e) {
    if (typeof a == "string")
      return D(a, r);
    if (ArrayBuffer.isView(a))
      return z(a);
    if (a == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
      );
    if (Tt(a, ArrayBuffer) || a && Tt(a.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Tt(a, SharedArrayBuffer) || a && Tt(a.buffer, SharedArrayBuffer)))
      return N(a, r, e);
    if (typeof a == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const c = a.valueOf && a.valueOf();
    if (c != null && c !== a)
      return w.from(c, r, e);
    const M = _t(a);
    if (M)
      return M;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof a[Symbol.toPrimitive] == "function")
      return w.from(a[Symbol.toPrimitive]("string"), r, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
    );
  }
  w.from = function(a, r, e) {
    return A(a, r, e);
  }, Object.setPrototypeOf(w.prototype, Uint8Array.prototype), Object.setPrototypeOf(w, Uint8Array);
  function F(a) {
    if (typeof a != "number")
      throw new TypeError('"size" argument must be of type number');
    if (a < 0)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
  }
  function S(a, r, e) {
    return F(a), a <= 0 ? x(a) : r !== void 0 ? typeof e == "string" ? x(a).fill(r, e) : x(a).fill(r) : x(a);
  }
  w.alloc = function(a, r, e) {
    return S(a, r, e);
  };
  function P(a) {
    return F(a), x(a < 0 ? 0 : H(a) | 0);
  }
  w.allocUnsafe = function(a) {
    return P(a);
  }, w.allocUnsafeSlow = function(a) {
    return P(a);
  };
  function D(a, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !w.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const e = At(a, r) | 0;
    let c = x(e);
    const M = c.write(a, r);
    return M !== e && (c = c.slice(0, M)), c;
  }
  function I(a) {
    const r = a.length < 0 ? 0 : H(a.length) | 0, e = x(r);
    for (let c = 0; c < r; c += 1)
      e[c] = a[c] & 255;
    return e;
  }
  function z(a) {
    if (Tt(a, Uint8Array)) {
      const r = new Uint8Array(a);
      return N(r.buffer, r.byteOffset, r.byteLength);
    }
    return I(a);
  }
  function N(a, r, e) {
    if (r < 0 || a.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (a.byteLength < r + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let c;
    return r === void 0 && e === void 0 ? c = new Uint8Array(a) : e === void 0 ? c = new Uint8Array(a, r) : c = new Uint8Array(a, r, e), Object.setPrototypeOf(c, w.prototype), c;
  }
  function _t(a) {
    if (w.isBuffer(a)) {
      const r = H(a.length) | 0, e = x(r);
      return e.length === 0 || a.copy(e, 0, 0, r), e;
    }
    if (a.length !== void 0)
      return typeof a.length != "number" || W(a.length) ? x(0) : I(a);
    if (a.type === "Buffer" && Array.isArray(a.data))
      return I(a.data);
  }
  function H(a) {
    if (a >= m)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + m.toString(16) + " bytes");
    return a | 0;
  }
  function ot(a) {
    return +a != a && (a = 0), w.alloc(+a);
  }
  w.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== w.prototype;
  }, w.compare = function(r, e) {
    if (Tt(r, Uint8Array) && (r = w.from(r, r.offset, r.byteLength)), Tt(e, Uint8Array) && (e = w.from(e, e.offset, e.byteLength)), !w.isBuffer(r) || !w.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === e)
      return 0;
    let c = r.length, M = e.length;
    for (let E = 0, _ = Math.min(c, M); E < _; ++E)
      if (r[E] !== e[E]) {
        c = r[E], M = e[E];
        break;
      }
    return c < M ? -1 : M < c ? 1 : 0;
  }, w.isEncoding = function(r) {
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
  }, w.concat = function(r, e) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return w.alloc(0);
    let c;
    if (e === void 0)
      for (e = 0, c = 0; c < r.length; ++c)
        e += r[c].length;
    const M = w.allocUnsafe(e);
    let E = 0;
    for (c = 0; c < r.length; ++c) {
      let _ = r[c];
      if (Tt(_, Uint8Array))
        E + _.length > M.length ? (w.isBuffer(_) || (_ = w.from(_)), _.copy(M, E)) : Uint8Array.prototype.set.call(
          M,
          _,
          E
        );
      else if (w.isBuffer(_))
        _.copy(M, E);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      E += _.length;
    }
    return M;
  };
  function At(a, r) {
    if (w.isBuffer(a))
      return a.length;
    if (ArrayBuffer.isView(a) || Tt(a, ArrayBuffer))
      return a.byteLength;
    if (typeof a != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof a
      );
    const e = a.length, c = arguments.length > 2 && arguments[2] === !0;
    if (!c && e === 0)
      return 0;
    let M = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return K(a).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return Q(a).length;
        default:
          if (M)
            return c ? -1 : K(a).length;
          r = ("" + r).toLowerCase(), M = !0;
      }
  }
  w.byteLength = At;
  function Ut(a, r, e) {
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
          return p(this, r, e);
        case "latin1":
        case "binary":
          return v(this, r, e);
        case "base64":
          return g(this, r, e);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return B(this, r, e);
        default:
          if (c)
            throw new TypeError("Unknown encoding: " + a);
          a = (a + "").toLowerCase(), c = !0;
      }
  }
  w.prototype._isBuffer = !0;
  function ft(a, r, e) {
    const c = a[r];
    a[r] = a[e], a[e] = c;
  }
  w.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < r; e += 2)
      ft(this, e, e + 1);
    return this;
  }, w.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < r; e += 4)
      ft(this, e, e + 3), ft(this, e + 1, e + 2);
    return this;
  }, w.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < r; e += 8)
      ft(this, e, e + 7), ft(this, e + 1, e + 6), ft(this, e + 2, e + 5), ft(this, e + 3, e + 4);
    return this;
  }, w.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? t(this, 0, r) : Ut.apply(this, arguments);
  }, w.prototype.toLocaleString = w.prototype.toString, w.prototype.equals = function(r) {
    if (!w.isBuffer(r))
      throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : w.compare(this, r) === 0;
  }, w.prototype.inspect = function() {
    let r = "";
    const e = n.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
  }, h && (w.prototype[h] = w.prototype.inspect), w.prototype.compare = function(r, e, c, M, E) {
    if (Tt(r, Uint8Array) && (r = w.from(r, r.offset, r.byteLength)), !w.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (e === void 0 && (e = 0), c === void 0 && (c = r ? r.length : 0), M === void 0 && (M = 0), E === void 0 && (E = this.length), e < 0 || c > r.length || M < 0 || E > this.length)
      throw new RangeError("out of range index");
    if (M >= E && e >= c)
      return 0;
    if (M >= E)
      return -1;
    if (e >= c)
      return 1;
    if (e >>>= 0, c >>>= 0, M >>>= 0, E >>>= 0, this === r)
      return 0;
    let _ = E - M, C = c - e;
    const k = Math.min(_, C), L = this.slice(M, E), Y = r.slice(e, c);
    for (let T = 0; T < k; ++T)
      if (L[T] !== Y[T]) {
        _ = L[T], C = Y[T];
        break;
      }
    return _ < C ? -1 : C < _ ? 1 : 0;
  };
  function q(a, r, e, c, M) {
    if (a.length === 0)
      return -1;
    if (typeof e == "string" ? (c = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, W(e) && (e = M ? 0 : a.length - 1), e < 0 && (e = a.length + e), e >= a.length) {
      if (M)
        return -1;
      e = a.length - 1;
    } else if (e < 0)
      if (M)
        e = 0;
      else
        return -1;
    if (typeof r == "string" && (r = w.from(r, c)), w.isBuffer(r))
      return r.length === 0 ? -1 : Ft(a, r, e, c, M);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? M ? Uint8Array.prototype.indexOf.call(a, r, e) : Uint8Array.prototype.lastIndexOf.call(a, r, e) : Ft(a, [r], e, c, M);
    throw new TypeError("val must be string, number or Buffer");
  }
  function Ft(a, r, e, c, M) {
    let E = 1, _ = a.length, C = r.length;
    if (c !== void 0 && (c = String(c).toLowerCase(), c === "ucs2" || c === "ucs-2" || c === "utf16le" || c === "utf-16le")) {
      if (a.length < 2 || r.length < 2)
        return -1;
      E = 2, _ /= 2, C /= 2, e /= 2;
    }
    function k(Y, T) {
      return E === 1 ? Y[T] : Y.readUInt16BE(T * E);
    }
    let L;
    if (M) {
      let Y = -1;
      for (L = e; L < _; L++)
        if (k(a, L) === k(r, Y === -1 ? 0 : L - Y)) {
          if (Y === -1 && (Y = L), L - Y + 1 === C)
            return Y * E;
        } else
          Y !== -1 && (L -= L - Y), Y = -1;
    } else
      for (e + C > _ && (e = _ - C), L = e; L >= 0; L--) {
        let Y = !0;
        for (let T = 0; T < C; T++)
          if (k(a, L + T) !== k(r, T)) {
            Y = !1;
            break;
          }
        if (Y)
          return L;
      }
    return -1;
  }
  w.prototype.includes = function(r, e, c) {
    return this.indexOf(r, e, c) !== -1;
  }, w.prototype.indexOf = function(r, e, c) {
    return q(this, r, e, c, !0);
  }, w.prototype.lastIndexOf = function(r, e, c) {
    return q(this, r, e, c, !1);
  };
  function $t(a, r, e, c) {
    e = Number(e) || 0;
    const M = a.length - e;
    c ? (c = Number(c), c > M && (c = M)) : c = M;
    const E = r.length;
    c > E / 2 && (c = E / 2);
    let _;
    for (_ = 0; _ < c; ++_) {
      const C = parseInt(r.substr(_ * 2, 2), 16);
      if (W(C))
        return _;
      a[e + _] = C;
    }
    return _;
  }
  function or(a, r, e, c) {
    return G(K(r, a.length - e), a, e, c);
  }
  function tr(a, r, e, c) {
    return G(et(r), a, e, c);
  }
  function J(a, r, e, c) {
    return G(Q(r), a, e, c);
  }
  function zt(a, r, e, c) {
    return G(sr(r, a.length - e), a, e, c);
  }
  w.prototype.write = function(r, e, c, M) {
    if (e === void 0)
      M = "utf8", c = this.length, e = 0;
    else if (c === void 0 && typeof e == "string")
      M = e, c = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(c) ? (c = c >>> 0, M === void 0 && (M = "utf8")) : (M = c, c = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const E = this.length - e;
    if ((c === void 0 || c > E) && (c = E), r.length > 0 && (c < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    M || (M = "utf8");
    let _ = !1;
    for (; ; )
      switch (M) {
        case "hex":
          return $t(this, r, e, c);
        case "utf8":
        case "utf-8":
          return or(this, r, e, c);
        case "ascii":
        case "latin1":
        case "binary":
          return tr(this, r, e, c);
        case "base64":
          return J(this, r, e, c);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return zt(this, r, e, c);
        default:
          if (_)
            throw new TypeError("Unknown encoding: " + M);
          M = ("" + M).toLowerCase(), _ = !0;
      }
  }, w.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function g(a, r, e) {
    return r === 0 && e === a.length ? o.fromByteArray(a) : o.fromByteArray(a.slice(r, e));
  }
  function t(a, r, e) {
    e = Math.min(a.length, e);
    const c = [];
    let M = r;
    for (; M < e; ) {
      const E = a[M];
      let _ = null, C = E > 239 ? 4 : E > 223 ? 3 : E > 191 ? 2 : 1;
      if (M + C <= e) {
        let k, L, Y, T;
        switch (C) {
          case 1:
            E < 128 && (_ = E);
            break;
          case 2:
            k = a[M + 1], (k & 192) === 128 && (T = (E & 31) << 6 | k & 63, T > 127 && (_ = T));
            break;
          case 3:
            k = a[M + 1], L = a[M + 2], (k & 192) === 128 && (L & 192) === 128 && (T = (E & 15) << 12 | (k & 63) << 6 | L & 63, T > 2047 && (T < 55296 || T > 57343) && (_ = T));
            break;
          case 4:
            k = a[M + 1], L = a[M + 2], Y = a[M + 3], (k & 192) === 128 && (L & 192) === 128 && (Y & 192) === 128 && (T = (E & 15) << 18 | (k & 63) << 12 | (L & 63) << 6 | Y & 63, T > 65535 && T < 1114112 && (_ = T));
        }
      }
      _ === null ? (_ = 65533, C = 1) : _ > 65535 && (_ -= 65536, c.push(_ >>> 10 & 1023 | 55296), _ = 56320 | _ & 1023), c.push(_), M += C;
    }
    return l(c);
  }
  const s = 4096;
  function l(a) {
    const r = a.length;
    if (r <= s)
      return String.fromCharCode.apply(String, a);
    let e = "", c = 0;
    for (; c < r; )
      e += String.fromCharCode.apply(
        String,
        a.slice(c, c += s)
      );
    return e;
  }
  function p(a, r, e) {
    let c = "";
    e = Math.min(a.length, e);
    for (let M = r; M < e; ++M)
      c += String.fromCharCode(a[M] & 127);
    return c;
  }
  function v(a, r, e) {
    let c = "";
    e = Math.min(a.length, e);
    for (let M = r; M < e; ++M)
      c += String.fromCharCode(a[M]);
    return c;
  }
  function b(a, r, e) {
    const c = a.length;
    (!r || r < 0) && (r = 0), (!e || e < 0 || e > c) && (e = c);
    let M = "";
    for (let E = r; E < e; ++E)
      M += it[a[E]];
    return M;
  }
  function B(a, r, e) {
    const c = a.slice(r, e);
    let M = "";
    for (let E = 0; E < c.length - 1; E += 2)
      M += String.fromCharCode(c[E] + c[E + 1] * 256);
    return M;
  }
  w.prototype.slice = function(r, e) {
    const c = this.length;
    r = ~~r, e = e === void 0 ? c : ~~e, r < 0 ? (r += c, r < 0 && (r = 0)) : r > c && (r = c), e < 0 ? (e += c, e < 0 && (e = 0)) : e > c && (e = c), e < r && (e = r);
    const M = this.subarray(r, e);
    return Object.setPrototypeOf(M, w.prototype), M;
  };
  function d(a, r, e) {
    if (a % 1 !== 0 || a < 0)
      throw new RangeError("offset is not uint");
    if (a + r > e)
      throw new RangeError("Trying to access beyond buffer length");
  }
  w.prototype.readUintLE = w.prototype.readUIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let M = this[r], E = 1, _ = 0;
    for (; ++_ < e && (E *= 256); )
      M += this[r + _] * E;
    return M;
  }, w.prototype.readUintBE = w.prototype.readUIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let M = this[r + --e], E = 1;
    for (; e > 0 && (E *= 256); )
      M += this[r + --e] * E;
    return M;
  }, w.prototype.readUint8 = w.prototype.readUInt8 = function(r, e) {
    return r = r >>> 0, e || d(r, 1, this.length), this[r];
  }, w.prototype.readUint16LE = w.prototype.readUInt16LE = function(r, e) {
    return r = r >>> 0, e || d(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, w.prototype.readUint16BE = w.prototype.readUInt16BE = function(r, e) {
    return r = r >>> 0, e || d(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, w.prototype.readUint32LE = w.prototype.readUInt32LE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, w.prototype.readUint32BE = w.prototype.readUInt32BE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, w.prototype.readBigUInt64LE = kt(function(r) {
    r = r >>> 0, qt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && V(r, this.length - 8);
    const M = e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, E = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + c * 2 ** 24;
    return BigInt(M) + (BigInt(E) << BigInt(32));
  }), w.prototype.readBigUInt64BE = kt(function(r) {
    r = r >>> 0, qt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && V(r, this.length - 8);
    const M = e * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], E = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c;
    return (BigInt(M) << BigInt(32)) + BigInt(E);
  }), w.prototype.readIntLE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let M = this[r], E = 1, _ = 0;
    for (; ++_ < e && (E *= 256); )
      M += this[r + _] * E;
    return E *= 128, M >= E && (M -= Math.pow(2, 8 * e)), M;
  }, w.prototype.readIntBE = function(r, e, c) {
    r = r >>> 0, e = e >>> 0, c || d(r, e, this.length);
    let M = e, E = 1, _ = this[r + --M];
    for (; M > 0 && (E *= 256); )
      _ += this[r + --M] * E;
    return E *= 128, _ >= E && (_ -= Math.pow(2, 8 * e)), _;
  }, w.prototype.readInt8 = function(r, e) {
    return r = r >>> 0, e || d(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, w.prototype.readInt16LE = function(r, e) {
    r = r >>> 0, e || d(r, 2, this.length);
    const c = this[r] | this[r + 1] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, w.prototype.readInt16BE = function(r, e) {
    r = r >>> 0, e || d(r, 2, this.length);
    const c = this[r + 1] | this[r] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, w.prototype.readInt32LE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, w.prototype.readInt32BE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, w.prototype.readBigInt64LE = kt(function(r) {
    r = r >>> 0, qt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && V(r, this.length - 8);
    const M = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (c << 24);
    return (BigInt(M) << BigInt(32)) + BigInt(e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), w.prototype.readBigInt64BE = kt(function(r) {
    r = r >>> 0, qt(r, "offset");
    const e = this[r], c = this[r + 7];
    (e === void 0 || c === void 0) && V(r, this.length - 8);
    const M = (e << 24) + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(M) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + c);
  }), w.prototype.readFloatLE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), u.read(this, r, !0, 23, 4);
  }, w.prototype.readFloatBE = function(r, e) {
    return r = r >>> 0, e || d(r, 4, this.length), u.read(this, r, !1, 23, 4);
  }, w.prototype.readDoubleLE = function(r, e) {
    return r = r >>> 0, e || d(r, 8, this.length), u.read(this, r, !0, 52, 8);
  }, w.prototype.readDoubleBE = function(r, e) {
    return r = r >>> 0, e || d(r, 8, this.length), u.read(this, r, !1, 52, 8);
  };
  function i(a, r, e, c, M, E) {
    if (!w.isBuffer(a))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > M || r < E)
      throw new RangeError('"value" argument is out of bounds');
    if (e + c > a.length)
      throw new RangeError("Index out of range");
  }
  w.prototype.writeUintLE = w.prototype.writeUIntLE = function(r, e, c, M) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !M) {
      const C = Math.pow(2, 8 * c) - 1;
      i(this, r, e, c, C, 0);
    }
    let E = 1, _ = 0;
    for (this[e] = r & 255; ++_ < c && (E *= 256); )
      this[e + _] = r / E & 255;
    return e + c;
  }, w.prototype.writeUintBE = w.prototype.writeUIntBE = function(r, e, c, M) {
    if (r = +r, e = e >>> 0, c = c >>> 0, !M) {
      const C = Math.pow(2, 8 * c) - 1;
      i(this, r, e, c, C, 0);
    }
    let E = c - 1, _ = 1;
    for (this[e + E] = r & 255; --E >= 0 && (_ *= 256); )
      this[e + E] = r / _ & 255;
    return e + c;
  }, w.prototype.writeUint8 = w.prototype.writeUInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
  }, w.prototype.writeUint16LE = w.prototype.writeUInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, w.prototype.writeUint16BE = w.prototype.writeUInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, w.prototype.writeUint32LE = w.prototype.writeUInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
  }, w.prototype.writeUint32BE = w.prototype.writeUInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  };
  function y(a, r, e, c, M) {
    X(r, c, M, a, e, 7);
    let E = Number(r & BigInt(4294967295));
    a[e++] = E, E = E >> 8, a[e++] = E, E = E >> 8, a[e++] = E, E = E >> 8, a[e++] = E;
    let _ = Number(r >> BigInt(32) & BigInt(4294967295));
    return a[e++] = _, _ = _ >> 8, a[e++] = _, _ = _ >> 8, a[e++] = _, _ = _ >> 8, a[e++] = _, e;
  }
  function R(a, r, e, c, M) {
    X(r, c, M, a, e, 7);
    let E = Number(r & BigInt(4294967295));
    a[e + 7] = E, E = E >> 8, a[e + 6] = E, E = E >> 8, a[e + 5] = E, E = E >> 8, a[e + 4] = E;
    let _ = Number(r >> BigInt(32) & BigInt(4294967295));
    return a[e + 3] = _, _ = _ >> 8, a[e + 2] = _, _ = _ >> 8, a[e + 1] = _, _ = _ >> 8, a[e] = _, e + 8;
  }
  w.prototype.writeBigUInt64LE = kt(function(r, e = 0) {
    return y(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), w.prototype.writeBigUInt64BE = kt(function(r, e = 0) {
    return R(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), w.prototype.writeIntLE = function(r, e, c, M) {
    if (r = +r, e = e >>> 0, !M) {
      const k = Math.pow(2, 8 * c - 1);
      i(this, r, e, c, k - 1, -k);
    }
    let E = 0, _ = 1, C = 0;
    for (this[e] = r & 255; ++E < c && (_ *= 256); )
      r < 0 && C === 0 && this[e + E - 1] !== 0 && (C = 1), this[e + E] = (r / _ >> 0) - C & 255;
    return e + c;
  }, w.prototype.writeIntBE = function(r, e, c, M) {
    if (r = +r, e = e >>> 0, !M) {
      const k = Math.pow(2, 8 * c - 1);
      i(this, r, e, c, k - 1, -k);
    }
    let E = c - 1, _ = 1, C = 0;
    for (this[e + E] = r & 255; --E >= 0 && (_ *= 256); )
      r < 0 && C === 0 && this[e + E + 1] !== 0 && (C = 1), this[e + E] = (r / _ >> 0) - C & 255;
    return e + c;
  }, w.prototype.writeInt8 = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
  }, w.prototype.writeInt16LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, w.prototype.writeInt16BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, w.prototype.writeInt32LE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
  }, w.prototype.writeInt32BE = function(r, e, c) {
    return r = +r, e = e >>> 0, c || i(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  }, w.prototype.writeBigInt64LE = kt(function(r, e = 0) {
    return y(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), w.prototype.writeBigInt64BE = kt(function(r, e = 0) {
    return R(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function U(a, r, e, c, M, E) {
    if (e + c > a.length)
      throw new RangeError("Index out of range");
    if (e < 0)
      throw new RangeError("Index out of range");
  }
  function O(a, r, e, c, M) {
    return r = +r, e = e >>> 0, M || U(a, r, e, 4), u.write(a, r, e, c, 23, 4), e + 4;
  }
  w.prototype.writeFloatLE = function(r, e, c) {
    return O(this, r, e, !0, c);
  }, w.prototype.writeFloatBE = function(r, e, c) {
    return O(this, r, e, !1, c);
  };
  function Bt(a, r, e, c, M) {
    return r = +r, e = e >>> 0, M || U(a, r, e, 8), u.write(a, r, e, c, 52, 8), e + 8;
  }
  w.prototype.writeDoubleLE = function(r, e, c) {
    return Bt(this, r, e, !0, c);
  }, w.prototype.writeDoubleBE = function(r, e, c) {
    return Bt(this, r, e, !1, c);
  }, w.prototype.copy = function(r, e, c, M) {
    if (!w.isBuffer(r))
      throw new TypeError("argument should be a Buffer");
    if (c || (c = 0), !M && M !== 0 && (M = this.length), e >= r.length && (e = r.length), e || (e = 0), M > 0 && M < c && (M = c), M === c || r.length === 0 || this.length === 0)
      return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (c < 0 || c >= this.length)
      throw new RangeError("Index out of range");
    if (M < 0)
      throw new RangeError("sourceEnd out of bounds");
    M > this.length && (M = this.length), r.length - e < M - c && (M = r.length - e + c);
    const E = M - c;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, c, M) : Uint8Array.prototype.set.call(
      r,
      this.subarray(c, M),
      e
    ), E;
  }, w.prototype.fill = function(r, e, c, M) {
    if (typeof r == "string") {
      if (typeof e == "string" ? (M = e, e = 0, c = this.length) : typeof c == "string" && (M = c, c = this.length), M !== void 0 && typeof M != "string")
        throw new TypeError("encoding must be a string");
      if (typeof M == "string" && !w.isEncoding(M))
        throw new TypeError("Unknown encoding: " + M);
      if (r.length === 1) {
        const _ = r.charCodeAt(0);
        (M === "utf8" && _ < 128 || M === "latin1") && (r = _);
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
      const _ = w.isBuffer(r) ? r : w.from(r, M), C = _.length;
      if (C === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (E = 0; E < c - e; ++E)
        this[E + e] = _[E % C];
    }
    return this;
  };
  const $ = {};
  function Z(a, r, e) {
    $[a] = class extends e {
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
      set code(M) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: M,
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
      let c = `The value of "${a}" is out of range.`, M = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? M = rr(String(e)) : typeof e == "bigint" && (M = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (M = rr(M)), M += "n"), c += ` It must be ${r}. Received ${M}`, c;
    },
    RangeError
  );
  function rr(a) {
    let r = "", e = a.length;
    const c = a[0] === "-" ? 1 : 0;
    for (; e >= c + 4; e -= 3)
      r = `_${a.slice(e - 3, e)}${r}`;
    return `${a.slice(0, e)}${r}`;
  }
  function tt(a, r, e) {
    qt(r, "offset"), (a[r] === void 0 || a[r + e] === void 0) && V(r, a.length - (e + 1));
  }
  function X(a, r, e, c, M, E) {
    if (a > e || a < r) {
      const _ = typeof r == "bigint" ? "n" : "";
      let C;
      throw E > 3 ? r === 0 || r === BigInt(0) ? C = `>= 0${_} and < 2${_} ** ${(E + 1) * 8}${_}` : C = `>= -(2${_} ** ${(E + 1) * 8 - 1}${_}) and < 2 ** ${(E + 1) * 8 - 1}${_}` : C = `>= ${r}${_} and <= ${e}${_}`, new $.ERR_OUT_OF_RANGE("value", C, a);
    }
    tt(c, M, E);
  }
  function qt(a, r) {
    if (typeof a != "number")
      throw new $.ERR_INVALID_ARG_TYPE(r, "number", a);
  }
  function V(a, r, e) {
    throw Math.floor(a) !== a ? (qt(a, e), new $.ERR_OUT_OF_RANGE(e || "offset", "an integer", a)) : r < 0 ? new $.ERR_BUFFER_OUT_OF_BOUNDS() : new $.ERR_OUT_OF_RANGE(
      e || "offset",
      `>= ${e ? 1 : 0} and <= ${r}`,
      a
    );
  }
  const rt = /[^+/0-9A-Za-z-_]/g;
  function fr(a) {
    if (a = a.split("=")[0], a = a.trim().replace(rt, ""), a.length < 2)
      return "";
    for (; a.length % 4 !== 0; )
      a = a + "=";
    return a;
  }
  function K(a, r) {
    r = r || 1 / 0;
    let e;
    const c = a.length;
    let M = null;
    const E = [];
    for (let _ = 0; _ < c; ++_) {
      if (e = a.charCodeAt(_), e > 55295 && e < 57344) {
        if (!M) {
          if (e > 56319) {
            (r -= 3) > -1 && E.push(239, 191, 189);
            continue;
          } else if (_ + 1 === c) {
            (r -= 3) > -1 && E.push(239, 191, 189);
            continue;
          }
          M = e;
          continue;
        }
        if (e < 56320) {
          (r -= 3) > -1 && E.push(239, 191, 189), M = e;
          continue;
        }
        e = (M - 55296 << 10 | e - 56320) + 65536;
      } else
        M && (r -= 3) > -1 && E.push(239, 191, 189);
      if (M = null, e < 128) {
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
  function sr(a, r) {
    let e, c, M;
    const E = [];
    for (let _ = 0; _ < a.length && !((r -= 2) < 0); ++_)
      e = a.charCodeAt(_), c = e >> 8, M = e % 256, E.push(M), E.push(c);
    return E;
  }
  function Q(a) {
    return o.toByteArray(fr(a));
  }
  function G(a, r, e, c) {
    let M;
    for (M = 0; M < c && !(M + e >= r.length || M >= a.length); ++M)
      r[M + e] = a[M];
    return M;
  }
  function Tt(a, r) {
    return a instanceof r || a != null && a.constructor != null && a.constructor.name != null && a.constructor.name === r.name;
  }
  function W(a) {
    return a !== a;
  }
  const it = function() {
    const a = "0123456789abcdef", r = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const c = e * 16;
      for (let M = 0; M < 16; ++M)
        r[c + M] = a[e] + a[M];
    }
    return r;
  }();
  function kt(a) {
    return typeof BigInt > "u" ? nt : a;
  }
  function nt() {
    throw new Error("BigInt not supported");
  }
})(re);
(function(n, o) {
  var u = re, h = u.Buffer;
  function m(x, w) {
    for (var A in x)
      w[A] = x[A];
  }
  h.from && h.alloc && h.allocUnsafe && h.allocUnsafeSlow ? n.exports = u : (m(u, o), o.Buffer = f);
  function f(x, w, A) {
    return h(x, w, A);
  }
  m(h, f), f.from = function(x, w, A) {
    if (typeof x == "number")
      throw new TypeError("Argument must not be a number");
    return h(x, w, A);
  }, f.alloc = function(x, w, A) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    var F = h(x);
    return w !== void 0 ? typeof A == "string" ? F.fill(w, A) : F.fill(w) : F.fill(0), F;
  }, f.allocUnsafe = function(x) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    return h(x);
  }, f.allocUnsafeSlow = function(x) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    return u.SlowBuffer(x);
  };
})(Wr, Wr.exports);
var ar = Wr.exports.Buffer;
function Ki(n) {
  if (n.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var o = new Uint8Array(256), u = 0; u < o.length; u++)
    o[u] = 255;
  for (var h = 0; h < n.length; h++) {
    var m = n.charAt(h), f = m.charCodeAt(0);
    if (o[f] !== 255)
      throw new TypeError(m + " is ambiguous");
    o[f] = h;
  }
  var x = n.length, w = n.charAt(0), A = Math.log(x) / Math.log(256), F = Math.log(256) / Math.log(x);
  function S(I) {
    if ((Array.isArray(I) || I instanceof Uint8Array) && (I = ar.from(I)), !ar.isBuffer(I))
      throw new TypeError("Expected Buffer");
    if (I.length === 0)
      return "";
    for (var z = 0, N = 0, _t = 0, H = I.length; _t !== H && I[_t] === 0; )
      _t++, z++;
    for (var ot = (H - _t) * F + 1 >>> 0, At = new Uint8Array(ot); _t !== H; ) {
      for (var Ut = I[_t], ft = 0, q = ot - 1; (Ut !== 0 || ft < N) && q !== -1; q--, ft++)
        Ut += 256 * At[q] >>> 0, At[q] = Ut % x >>> 0, Ut = Ut / x >>> 0;
      if (Ut !== 0)
        throw new Error("Non-zero carry");
      N = ft, _t++;
    }
    for (var Ft = ot - N; Ft !== ot && At[Ft] === 0; )
      Ft++;
    for (var $t = w.repeat(z); Ft < ot; ++Ft)
      $t += n.charAt(At[Ft]);
    return $t;
  }
  function P(I) {
    if (typeof I != "string")
      throw new TypeError("Expected String");
    if (I.length === 0)
      return ar.alloc(0);
    for (var z = 0, N = 0, _t = 0; I[z] === w; )
      N++, z++;
    for (var H = (I.length - z) * A + 1 >>> 0, ot = new Uint8Array(H); I[z]; ) {
      var At = o[I.charCodeAt(z)];
      if (At === 255)
        return;
      for (var Ut = 0, ft = H - 1; (At !== 0 || Ut < _t) && ft !== -1; ft--, Ut++)
        At += x * ot[ft] >>> 0, ot[ft] = At % 256 >>> 0, At = At / 256 >>> 0;
      if (At !== 0)
        throw new Error("Non-zero carry");
      _t = Ut, z++;
    }
    for (var q = H - _t; q !== H && ot[q] === 0; )
      q++;
    var Ft = ar.allocUnsafe(N + (H - q));
    Ft.fill(0, 0, N);
    for (var $t = N; q !== H; )
      Ft[$t++] = ot[q++];
    return Ft;
  }
  function D(I) {
    var z = P(I);
    if (z)
      return z;
    throw new Error("Non-base" + x + " character");
  }
  return {
    encode: S,
    decodeUnsafe: P,
    decode: D
  };
}
var Wi = Ki, ji = Wi, Hi = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", Ji = ji(Hi);
function Zt(n, o, u) {
  return o <= n && n <= u;
}
function wr(n) {
  if (n === void 0)
    return {};
  if (n === Object(n))
    return n;
  throw TypeError("Could not convert argument to dictionary");
}
function Xi(n) {
  for (var o = String(n), u = o.length, h = 0, m = []; h < u; ) {
    var f = o.charCodeAt(h);
    if (f < 55296 || f > 57343)
      m.push(f);
    else if (56320 <= f && f <= 57343)
      m.push(65533);
    else if (55296 <= f && f <= 56319)
      if (h === u - 1)
        m.push(65533);
      else {
        var x = n.charCodeAt(h + 1);
        if (56320 <= x && x <= 57343) {
          var w = f & 1023, A = x & 1023;
          m.push(65536 + (w << 10) + A), h += 1;
        } else
          m.push(65533);
      }
    h += 1;
  }
  return m;
}
function Qi(n) {
  for (var o = "", u = 0; u < n.length; ++u) {
    var h = n[u];
    h <= 65535 ? o += String.fromCharCode(h) : (h -= 65536, o += String.fromCharCode(
      (h >> 10) + 55296,
      (h & 1023) + 56320
    ));
  }
  return o;
}
var cr = -1;
function ie(n) {
  this.tokens = [].slice.call(n);
}
ie.prototype = {
  endOfStream: function() {
    return !this.tokens.length;
  },
  read: function() {
    return this.tokens.length ? this.tokens.shift() : cr;
  },
  prepend: function(n) {
    if (Array.isArray(n))
      for (var o = n; o.length; )
        this.tokens.unshift(o.pop());
    else
      this.tokens.unshift(n);
  },
  push: function(n) {
    if (Array.isArray(n))
      for (var o = n; o.length; )
        this.tokens.push(o.shift());
    else
      this.tokens.push(n);
  }
};
var Qt = -1;
function zr(n, o) {
  if (n)
    throw TypeError("Decoder error");
  return o || 65533;
}
var dr = "utf-8";
function pr(n, o) {
  if (!(this instanceof pr))
    return new pr(n, o);
  if (n = n !== void 0 ? String(n).toLowerCase() : dr, n !== dr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  o = wr(o), this._streaming = !1, this._BOMseen = !1, this._decoder = null, this._fatal = Boolean(o.fatal), this._ignoreBOM = Boolean(o.ignoreBOM), Object.defineProperty(this, "encoding", { value: "utf-8" }), Object.defineProperty(this, "fatal", { value: this._fatal }), Object.defineProperty(this, "ignoreBOM", { value: this._ignoreBOM });
}
pr.prototype = {
  decode: function(o, u) {
    var h;
    typeof o == "object" && o instanceof ArrayBuffer ? h = new Uint8Array(o) : typeof o == "object" && "buffer" in o && o.buffer instanceof ArrayBuffer ? h = new Uint8Array(
      o.buffer,
      o.byteOffset,
      o.byteLength
    ) : h = new Uint8Array(0), u = wr(u), this._streaming || (this._decoder = new tn({ fatal: this._fatal }), this._BOMseen = !1), this._streaming = Boolean(u.stream);
    for (var m = new ie(h), f = [], x; !m.endOfStream() && (x = this._decoder.handler(m, m.read()), x !== Qt); )
      x !== null && (Array.isArray(x) ? f.push.apply(f, x) : f.push(x));
    if (!this._streaming) {
      do {
        if (x = this._decoder.handler(m, m.read()), x === Qt)
          break;
        x !== null && (Array.isArray(x) ? f.push.apply(f, x) : f.push(x));
      } while (!m.endOfStream());
      this._decoder = null;
    }
    return f.length && ["utf-8"].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen && (f[0] === 65279 ? (this._BOMseen = !0, f.shift()) : this._BOMseen = !0), Qi(f);
  }
};
function mr(n, o) {
  if (!(this instanceof mr))
    return new mr(n, o);
  if (n = n !== void 0 ? String(n).toLowerCase() : dr, n !== dr)
    throw new Error("Encoding not supported. Only utf-8 is supported");
  o = wr(o), this._streaming = !1, this._encoder = null, this._options = { fatal: Boolean(o.fatal) }, Object.defineProperty(this, "encoding", { value: "utf-8" });
}
mr.prototype = {
  encode: function(o, u) {
    o = o ? String(o) : "", u = wr(u), this._streaming || (this._encoder = new rn(this._options)), this._streaming = Boolean(u.stream);
    for (var h = [], m = new ie(Xi(o)), f; !m.endOfStream() && (f = this._encoder.handler(m, m.read()), f !== Qt); )
      Array.isArray(f) ? h.push.apply(h, f) : h.push(f);
    if (!this._streaming) {
      for (; f = this._encoder.handler(m, m.read()), f !== Qt; )
        Array.isArray(f) ? h.push.apply(h, f) : h.push(f);
      this._encoder = null;
    }
    return new Uint8Array(h);
  }
};
function tn(n) {
  var o = n.fatal, u = 0, h = 0, m = 0, f = 128, x = 191;
  this.handler = function(w, A) {
    if (A === cr && m !== 0)
      return m = 0, zr(o);
    if (A === cr)
      return Qt;
    if (m === 0) {
      if (Zt(A, 0, 127))
        return A;
      if (Zt(A, 194, 223))
        m = 1, u = A - 192;
      else if (Zt(A, 224, 239))
        A === 224 && (f = 160), A === 237 && (x = 159), m = 2, u = A - 224;
      else if (Zt(A, 240, 244))
        A === 240 && (f = 144), A === 244 && (x = 143), m = 3, u = A - 240;
      else
        return zr(o);
      return u = u << 6 * m, null;
    }
    if (!Zt(A, f, x))
      return u = m = h = 0, f = 128, x = 191, w.prepend(A), zr(o);
    if (f = 128, x = 191, h += 1, u += A - 128 << 6 * (m - h), h !== m)
      return null;
    var F = u;
    return u = m = h = 0, F;
  };
}
function rn(n) {
  n.fatal, this.handler = function(o, u) {
    if (u === cr)
      return Qt;
    if (Zt(u, 0, 127))
      return u;
    var h, m;
    Zt(u, 128, 2047) ? (h = 1, m = 192) : Zt(u, 2048, 65535) ? (h = 2, m = 224) : Zt(u, 65536, 1114111) && (h = 3, m = 240);
    for (var f = [(u >> 6 * h) + m]; h > 0; ) {
      var x = u >> 6 * (h - 1);
      f.push(128 | x & 63), h -= 1;
    }
    return f;
  };
}
const en = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TextEncoder: mr,
  TextDecoder: pr
}, Symbol.toStringTag, { value: "Module" })), nn = /* @__PURE__ */ Se(en);
var on = Ct && Ct.__createBinding || (Object.create ? function(n, o, u, h) {
  h === void 0 && (h = u), Object.defineProperty(n, h, { enumerable: !0, get: function() {
    return o[u];
  } });
} : function(n, o, u, h) {
  h === void 0 && (h = u), n[h] = o[u];
}), fn = Ct && Ct.__setModuleDefault || (Object.create ? function(n, o) {
  Object.defineProperty(n, "default", { enumerable: !0, value: o });
} : function(n, o) {
  n.default = o;
}), Pt = Ct && Ct.__decorate || function(n, o, u, h) {
  var m = arguments.length, f = m < 3 ? o : h === null ? h = Object.getOwnPropertyDescriptor(o, u) : h, x;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    f = Reflect.decorate(n, o, u, h);
  else
    for (var w = n.length - 1; w >= 0; w--)
      (x = n[w]) && (f = (m < 3 ? x(f) : m > 3 ? x(o, u, f) : x(o, u)) || f);
  return m > 3 && f && Object.defineProperty(o, u, f), f;
}, sn = Ct && Ct.__importStar || function(n) {
  if (n && n.__esModule)
    return n;
  var o = {};
  if (n != null)
    for (var u in n)
      u !== "default" && Object.hasOwnProperty.call(n, u) && on(o, n, u);
  return fn(o, n), o;
}, Te = Ct && Ct.__importDefault || function(n) {
  return n && n.__esModule ? n : { default: n };
};
Object.defineProperty(St, "__esModule", { value: !0 });
St.deserializeUnchecked = St.deserialize = St.serialize = St.BinaryReader = St.BinaryWriter = St.BorshError = jr = St.baseDecode = Le = St.baseEncode = void 0;
const Gt = Te(Ue.exports), Oe = Te(Ji), un = sn(nn), hn = typeof TextDecoder != "function" ? un.TextDecoder : TextDecoder, an = new hn("utf-8", { fatal: !0 });
function ln(n) {
  return typeof n == "string" && (n = Buffer.from(n, "utf8")), Oe.default.encode(Buffer.from(n));
}
var Le = St.baseEncode = ln;
function cn(n) {
  return Buffer.from(Oe.default.decode(n));
}
var jr = St.baseDecode = cn;
const qr = 1024;
class Rt extends Error {
  constructor(o) {
    super(o), this.fieldPath = [], this.originalMessage = o;
  }
  addToFieldPath(o) {
    this.fieldPath.splice(0, 0, o), this.message = this.originalMessage + ": " + this.fieldPath.join(".");
  }
}
St.BorshError = Rt;
class ke {
  constructor() {
    this.buf = Buffer.alloc(qr), this.length = 0;
  }
  maybeResize() {
    this.buf.length < 16 + this.length && (this.buf = Buffer.concat([this.buf, Buffer.alloc(qr)]));
  }
  writeU8(o) {
    this.maybeResize(), this.buf.writeUInt8(o, this.length), this.length += 1;
  }
  writeU16(o) {
    this.maybeResize(), this.buf.writeUInt16LE(o, this.length), this.length += 2;
  }
  writeU32(o) {
    this.maybeResize(), this.buf.writeUInt32LE(o, this.length), this.length += 4;
  }
  writeU64(o) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Gt.default(o).toArray("le", 8)));
  }
  writeU128(o) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Gt.default(o).toArray("le", 16)));
  }
  writeU256(o) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Gt.default(o).toArray("le", 32)));
  }
  writeU512(o) {
    this.maybeResize(), this.writeBuffer(Buffer.from(new Gt.default(o).toArray("le", 64)));
  }
  writeBuffer(o) {
    this.buf = Buffer.concat([
      Buffer.from(this.buf.subarray(0, this.length)),
      o,
      Buffer.alloc(qr)
    ]), this.length += o.length;
  }
  writeString(o) {
    this.maybeResize();
    const u = Buffer.from(o, "utf8");
    this.writeU32(u.length), this.writeBuffer(u);
  }
  writeFixedArray(o) {
    this.writeBuffer(Buffer.from(o));
  }
  writeArray(o, u) {
    this.maybeResize(), this.writeU32(o.length);
    for (const h of o)
      this.maybeResize(), u(h);
  }
  toArray() {
    return this.buf.subarray(0, this.length);
  }
}
St.BinaryWriter = ke;
function Nt(n, o, u) {
  const h = u.value;
  u.value = function(...m) {
    try {
      return h.apply(this, m);
    } catch (f) {
      if (f instanceof RangeError) {
        const x = f.code;
        if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(x) >= 0)
          throw new Rt("Reached the end of buffer when deserializing");
      }
      throw f;
    }
  };
}
class Ot {
  constructor(o) {
    this.buf = o, this.offset = 0;
  }
  readU8() {
    const o = this.buf.readUInt8(this.offset);
    return this.offset += 1, o;
  }
  readU16() {
    const o = this.buf.readUInt16LE(this.offset);
    return this.offset += 2, o;
  }
  readU32() {
    const o = this.buf.readUInt32LE(this.offset);
    return this.offset += 4, o;
  }
  readU64() {
    const o = this.readBuffer(8);
    return new Gt.default(o, "le");
  }
  readU128() {
    const o = this.readBuffer(16);
    return new Gt.default(o, "le");
  }
  readU256() {
    const o = this.readBuffer(32);
    return new Gt.default(o, "le");
  }
  readU512() {
    const o = this.readBuffer(64);
    return new Gt.default(o, "le");
  }
  readBuffer(o) {
    if (this.offset + o > this.buf.length)
      throw new Rt(`Expected buffer length ${o} isn't within bounds`);
    const u = this.buf.slice(this.offset, this.offset + o);
    return this.offset += o, u;
  }
  readString() {
    const o = this.readU32(), u = this.readBuffer(o);
    try {
      return an.decode(u);
    } catch (h) {
      throw new Rt(`Error decoding UTF-8 string: ${h}`);
    }
  }
  readFixedArray(o) {
    return new Uint8Array(this.readBuffer(o));
  }
  readArray(o) {
    const u = this.readU32(), h = Array();
    for (let m = 0; m < u; ++m)
      h.push(o());
    return h;
  }
}
Pt([
  Nt
], Ot.prototype, "readU8", null);
Pt([
  Nt
], Ot.prototype, "readU16", null);
Pt([
  Nt
], Ot.prototype, "readU32", null);
Pt([
  Nt
], Ot.prototype, "readU64", null);
Pt([
  Nt
], Ot.prototype, "readU128", null);
Pt([
  Nt
], Ot.prototype, "readU256", null);
Pt([
  Nt
], Ot.prototype, "readU512", null);
Pt([
  Nt
], Ot.prototype, "readString", null);
Pt([
  Nt
], Ot.prototype, "readFixedArray", null);
Pt([
  Nt
], Ot.prototype, "readArray", null);
St.BinaryReader = Ot;
function Ce(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Wt(n, o, u, h, m) {
  try {
    if (typeof h == "string")
      m[`write${Ce(h)}`](u);
    else if (h instanceof Array)
      if (typeof h[0] == "number") {
        if (u.length !== h[0])
          throw new Rt(`Expecting byte array of length ${h[0]}, but got ${u.length} bytes`);
        m.writeFixedArray(u);
      } else if (h.length === 2 && typeof h[1] == "number") {
        if (u.length !== h[1])
          throw new Rt(`Expecting byte array of length ${h[1]}, but got ${u.length} bytes`);
        for (let f = 0; f < h[1]; f++)
          Wt(n, null, u[f], h[0], m);
      } else
        m.writeArray(u, (f) => {
          Wt(n, o, f, h[0], m);
        });
    else if (h.kind !== void 0)
      switch (h.kind) {
        case "option": {
          u == null ? m.writeU8(0) : (m.writeU8(1), Wt(n, o, u, h.type, m));
          break;
        }
        case "map": {
          m.writeU32(u.size), u.forEach((f, x) => {
            Wt(n, o, x, h.key, m), Wt(n, o, f, h.value, m);
          });
          break;
        }
        default:
          throw new Rt(`FieldType ${h} unrecognized`);
      }
    else
      De(n, u, m);
  } catch (f) {
    throw f instanceof Rt && f.addToFieldPath(o), f;
  }
}
function De(n, o, u) {
  if (typeof o.borshSerialize == "function") {
    o.borshSerialize(u);
    return;
  }
  const h = n.get(o.constructor);
  if (!h)
    throw new Rt(`Class ${o.constructor.name} is missing in schema`);
  if (h.kind === "struct")
    h.fields.map(([m, f]) => {
      Wt(n, m, o[m], f, u);
    });
  else if (h.kind === "enum") {
    const m = o[h.field];
    for (let f = 0; f < h.values.length; ++f) {
      const [x, w] = h.values[f];
      if (x === m) {
        u.writeU8(f), Wt(n, x, o[x], w, u);
        break;
      }
    }
  } else
    throw new Rt(`Unexpected schema kind: ${h.kind} for ${o.constructor.name}`);
}
function dn(n, o, u = ke) {
  const h = new u();
  return De(n, o, h), h.toArray();
}
St.serialize = dn;
function jt(n, o, u, h) {
  try {
    if (typeof u == "string")
      return h[`read${Ce(u)}`]();
    if (u instanceof Array) {
      if (typeof u[0] == "number")
        return h.readFixedArray(u[0]);
      if (typeof u[1] == "number") {
        const m = [];
        for (let f = 0; f < u[1]; f++)
          m.push(jt(n, null, u[0], h));
        return m;
      } else
        return h.readArray(() => jt(n, o, u[0], h));
    }
    if (u.kind === "option")
      return h.readU8() ? jt(n, o, u.type, h) : void 0;
    if (u.kind === "map") {
      let m = /* @__PURE__ */ new Map();
      const f = h.readU32();
      for (let x = 0; x < f; x++) {
        const w = jt(n, o, u.key, h), A = jt(n, o, u.value, h);
        m.set(w, A);
      }
      return m;
    }
    return ne(n, u, h);
  } catch (m) {
    throw m instanceof Rt && m.addToFieldPath(o), m;
  }
}
function ne(n, o, u) {
  if (typeof o.borshDeserialize == "function")
    return o.borshDeserialize(u);
  const h = n.get(o);
  if (!h)
    throw new Rt(`Class ${o.name} is missing in schema`);
  if (h.kind === "struct") {
    const m = {};
    for (const [f, x] of n.get(o).fields)
      m[f] = jt(n, f, x, u);
    return new o(m);
  }
  if (h.kind === "enum") {
    const m = u.readU8();
    if (m >= h.values.length)
      throw new Rt(`Enum index: ${m} is out of range`);
    const [f, x] = h.values[m], w = jt(n, f, x, u);
    return new o({ [f]: w });
  }
  throw new Rt(`Unexpected schema kind: ${h.kind} for ${o.constructor.name}`);
}
function pn(n, o, u, h = Ot) {
  const m = new h(u), f = ne(n, o, m);
  if (m.offset < u.length)
    throw new Rt(`Unexpected ${u.length - m.offset} bytes after deserialized data`);
  return f;
}
St.deserialize = pn;
function mn(n, o, u, h = Ot) {
  const m = new h(u);
  return ne(n, o, m);
}
St.deserializeUnchecked = mn;
function yn(n) {
  n.Buffer = re.Buffer;
}
class vn {
  constructor() {
    Vt(this, "name");
    Vt(this, "connected");
    Vt(this, "connecting");
    Vt(this, "windowMsgStream");
    this.name = "Suiet", this.connected = !1, this.connecting = !1, this.windowMsgStream = new ki(
      Zr.DAPP,
      Zr.SUIET_CONTENT
    );
  }
  async connect(o) {
    return await this.windowMsgStream.post(Kt("handshake", null)), await this.windowMsgStream.post(
      Kt("dapp.connect", { permissions: o })
    );
  }
  async disconnect() {
    return await this.windowMsgStream.post(Kt("handwave", null));
  }
  async hasPermissions(o) {
    throw new Error("function not implemented yet");
  }
  async requestPermissions() {
    throw new Error("function not implemented yet");
  }
  async executeMoveCall(o) {
    return await this.windowMsgStream.post(
      Kt("dapp.requestTransaction", {
        type: Ie.MOVE_CALL,
        data: o
      })
    );
  }
  async executeSerializedMoveCall(o) {
    throw new Error("function not implemented yet");
  }
  async getAccounts() {
    return await this.windowMsgStream.post(
      Kt("dapp.getAccounts", null)
    );
  }
  async signMessage(o) {
    const u = { message: Le(o.message) }, h = await this.windowMsgStream.post(
      Kt("dapp.signMessage", u)
    );
    if (h.error)
      return h;
    const m = h.data;
    return {
      ...h,
      data: {
        signature: jr(m.signature),
        signedMessage: jr(m.signedMessage)
      }
    };
  }
  async getPublicKey() {
    return await this.windowMsgStream.post(Kt("dapp.getPublicKey", null));
  }
}
yn(window);
Object.defineProperty(window, "__suiet__", {
  enumerable: !1,
  configurable: !1,
  value: new vn()
});
export {
  vn as DAppInterface
};
