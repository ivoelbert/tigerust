const t = new WeakMap();
function e(t, e) {
    return new Proxy(t, { get: (t, s) => e(t[s]) });
}
class s {
    constructor() {
        this.state = { type: 'Loading' };
        this.exports = null;
    }
    assertNoneState() {
        if ('None' !== this.state.type) throw new Error(`Invalid async state ${this.state.type}`);
    }
    wrapImportFn(t) {
        return (...e) => {
            var n;
            if ('Rewinding' === this.state.type) {
                let { value: t } = this.state;
                this.state = { type: 'None' };
                this.exports.asyncify_stop_rewind();
                return t;
            }
            this.assertNoneState();
            let s = t(...e);
            if (
                !(n = s) ||
                ('object' != typeof n && 'function' != typeof n) ||
                'function' != typeof n.then
            )
                return s;
            this.exports.asyncify_start_unwind(16);
            this.state = { type: 'Unwinding', promise: s };
        };
    }
    wrapModuleImports(t) {
        return e(t, (t) => ('function' == typeof t ? this.wrapImportFn(t) : t));
    }
    wrapImports(t) {
        if (void 0 !== t) return e(t, (t) => this.wrapModuleImports(t));
    }
    wrapExportFn(e) {
        let s = t.get(e);
        return void 0 !== s
            ? s
            : ((s = async (...t) => {
                  this.assertNoneState();
                  let s = e(...t);
                  for (; 'Unwinding' === this.state.type; ) {
                      let { promise: t } = this.state;
                      this.state = { type: 'None' };
                      this.exports.asyncify_stop_unwind();
                      let n = await t;
                      this.assertNoneState();
                      this.exports.asyncify_start_rewind(16);
                      this.state = { type: 'Rewinding', value: n };
                      s = e();
                  }
                  this.assertNoneState();
                  return s;
              }),
              t.set(e, s),
              s);
    }
    wrapExports(e) {
        let s = Object.create(null);
        for (let t in e) {
            let n = e[t];
            'function' != typeof n || t.startsWith('asyncify_') || (n = this.wrapExportFn(n));
            Object.defineProperty(s, t, { enumerable: !0, value: n });
        }
        t.set(e, s);
        return s;
    }
    init(t, e) {
        const { exports: s } = t,
            r = s.memory || (e.mem && e.mem.memory);
        new Int32Array(r.buffer, 16).set([24, 1024]);
        this.state = { type: 'None' };
        this.exports = this.wrapExports(s);
        Object.setPrototypeOf(t, n.prototype);
    }
}
class n extends WebAssembly.Instance {
    constructor(t, e) {
        let n = new s();
        super(t, n.wrapImports(e));
        n.init(this, e);
    }
    get exports() {
        return t.get(super.exports);
    }
}
async function r(t, e) {
    let n = new s(),
        r = await WebAssembly.instantiate(t, n.wrapImports(e));

    n.init(r instanceof WebAssembly.Instance ? r : r.instance, e);
    return r;
}
async function i(t, e) {
    let n = new s(),
        r = await WebAssembly.instantiateStreaming(t, n.wrapImports(e));

    n.init(r.instance, e);
    return r;
}
Object.defineProperty(n.prototype, 'exports', { enumerable: !0 });
export { n as Instance, r as instantiate, i as instantiateStreaming };
