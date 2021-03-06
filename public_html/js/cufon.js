/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 */
var Cufon = (function () {
    var K = function () {
        return K.replace.apply(null, arguments)
    };
    var U = K.DOM = {
        ready: (function () {
            var Z = false, b = {loaded: 1, complete: 1};
            var Y = [], a = function () {
                if (Z) {
                    return
                }
                Z = true;
                for (var c; c = Y.shift(); c()) {
                }
            };
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", a, false);
                window.addEventListener("pageshow", a, false)
            }
            if (!window.opera && document.readyState) {
                (function () {
                    b[document.readyState] ? a() : setTimeout(arguments.callee, 10)
                })()
            }
            if (document.readyState && document.createStyleSheet) {
                (function () {
                    try {
                        document.body.doScroll("left");
                        a()
                    }
                    catch (c) {
                        setTimeout(arguments.callee, 1)
                    }
                })()
            }
            O(window, "load", a);
            return function (c) {
                if (!arguments.length) {
                    a()
                }
                else {
                    Z ? c() : Y.push(c)
                }
            }
        })()
    };
    var L = K.CSS = {
        Size: function (Z, Y) {
            this.value = parseFloat(Z);
            this.unit = String(Z).match(/[a-z%]*$/)[0] || "px";
            this.convert = function (a) {
                return a / Y * this.value
            };
            this.convertFrom = function (a) {
                return a / this.value * Y
            };
            this.toString = function () {
                return this.value + this.unit
            }
        }, getStyle: function (Z) {
            var Y = document.defaultView;
            if (Y && Y.getComputedStyle) {
                return new A(Y.getComputedStyle(Z, null))
            }
            if (Z.currentStyle) {
                return new A(Z.currentStyle)
            }
            return new A(Z.style)
        }, ready: (function () {
            var a = false;
            var Z = [], b = function () {
                a = true;
                for (var d; d = Z.shift(); d()) {
                }
            };
            var Y = Object.prototype.propertyIsEnumerable ? F("style") : {length: 0};
            var c = F("link");
            U.ready(function () {
                var g = 0, f;
                for (var e = 0, d = c.length; f = c[e], e < d; ++e) {
                    if (!f.disabled && f.rel.toLowerCase() == "stylesheet") {
                        ++g
                    }
                }
                if (document.styleSheets.length >= Y.length + g) {
                    b()
                }
                else {
                    setTimeout(arguments.callee, 10)
                }
            });
            return function (d) {
                if (a) {
                    d()
                }
                else {
                    Z.push(d)
                }
            }
        })(), supports: function (a, Z) {
            var Y = document.createElement("span").style;
            if (Y[a] === undefined) {
                return false
            }
            Y[a] = Z;
            return Y[a] === Z
        }, textAlign: function (b, a, Y, Z) {
            if (a.get("textAlign") == "right") {
                if (Y > 0) {
                    b = " " + b
                }
            }
            else {
                if (Y < Z - 1) {
                    b += " "
                }
            }
            return b
        }, textDecoration: function (d, c) {
            if (!c) {
                c = this.getStyle(d)
            }
            var Z = {underline: null, overline: null, "line-through": null};
            for (var Y = d; Y.parentNode && Y.parentNode.nodeType == 1;) {
                var b = true;
                for (var a in Z) {
                    if (Z[a]) {
                        continue
                    }
                    if (c.get("textDecoration").indexOf(a) != -1) {
                        Z[a] = c.get("color")
                    }
                    b = false
                }
                if (b) {
                    break
                }
                c = this.getStyle(Y = Y.parentNode)
            }
            return Z
        }, textShadow: I(function (c) {
            if (c == "none") {
                return null
            }
            var b = [], d = {}, Y, Z = 0;
            var a = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
            while (Y = a.exec(c)) {
                if (Y[0] == ",") {
                    b.push(d);
                    d = {}, Z = 0
                }
                else {
                    if (Y[1]) {
                        d.color = Y[1]
                    }
                    else {
                        d[["offX", "offY", "blur"][Z++]] = Y[2]
                    }
                }
            }
            b.push(d);
            return b
        }), color: I(function (Z) {
            var Y = {};
            Y.color = Z.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function (b, a, c) {
                Y.opacity = parseFloat(c);
                return "rgb(" + a + ")"
            });
            return Y
        }), textTransform: function (Z, Y) {
            return Z[{uppercase: "toUpperCase", lowercase: "toLowerCase"}[Y.get("textTransform")] || "toString"]()
        }
    };

    function Q(Z) {
        var Y = this.face = Z.face;
        this.glyphs = Z.glyphs;
        this.w = Z.w;
        this.baseSize = parseInt(Y["units-per-em"], 10);
        this.family = Y["font-family"].toLowerCase();
        this.weight = Y["font-weight"];
        this.style = Y["font-style"] || "normal";
        this.viewBox = (function () {
            var b = Y.bbox.split(/\s+/);
            var a = {
                minX: parseInt(b[0], 10),
                minY: parseInt(b[1], 10),
                maxX: parseInt(b[2], 10),
                maxY: parseInt(b[3], 10)
            };
            a.width = a.maxX - a.minX, a.height = a.maxY - a.minY;
            a.toString = function () {
                return [this.minX, this.minY, this.width, this.height].join(" ")
            };
            return a
        })();
        this.ascent = -parseInt(Y.ascent, 10);
        this.descent = -parseInt(Y.descent, 10);
        this.height = -this.ascent + this.descent
    }

    function E() {
        var Z = {}, Y = {oblique: "italic", italic: "oblique"};
        this.add = function (a) {
            (Z[a.style] || (Z[a.style] = {}))[a.weight] = a
        };
        this.get = function (e, f) {
            var d = Z[e] || Z[Y[e]] || Z.normal || Z.italic || Z.oblique;
            if (!d) {
                return null
            }
            f = {normal: 400, bold: 700}[f] || parseInt(f, 10);
            if (d[f]) {
                return d[f]
            }
            var b = {1: 1, 99: 0}[f % 100], h = [], c, a;
            if (b === undefined) {
                b = f > 400
            }
            if (f == 500) {
                f = 400
            }
            for (var g in d) {
                g = parseInt(g, 10);
                if (!c || g < c) {
                    c = g
                }
                if (!a || g > a) {
                    a = g
                }
                h.push(g)
            }
            if (f < c) {
                f = c
            }
            if (f > a) {
                f = a
            }
            h.sort(function (j, i) {
                return (b ? (j > f && i > f) ? j < i : j > i : (j < f && i < f) ? j > i : j < i) ? -1 : 1
            });
            return d[h[0]]
        }
    }

    function P() {
        function a(c, d) {
            if (c.contains) {
                return c.contains(d)
            }
            return c.compareDocumentPosition(d) & 16
        }

        function Y(d) {
            var c = d.relatedTarget;
            if (!c || a(this, c)) {
                return
            }
            Z(this)
        }

        function b(c) {
            Z(this)
        }

        function Z(c) {
            setTimeout(function () {
                K.replace(c, D.get(c).options, true)
            }, 10)
        }

        this.attach = function (c) {
            if (c.onmouseenter === undefined) {
                O(c, "mouseover", Y);
                O(c, "mouseout", Y)
            }
            else {
                O(c, "mouseenter", b);
                O(c, "mouseleave", b)
            }
        }
    }

    function X() {
        var a = {}, Y = 0;

        function Z(b) {
            return b.cufid || (b.cufid = ++Y)
        }

        this.get = function (b) {
            var c = Z(b);
            return a[c] || (a[c] = {})
        }
    }

    function A(Y) {
        var a = {}, Z = {};
        this.get = function (b) {
            return a[b] != undefined ? a[b] : Y[b]
        };
        this.getSize = function (c, b) {
            return Z[c] || (Z[c] = new L.Size(this.get(c), b))
        };
        this.extend = function (b) {
            for (var c in b) {
                a[c] = b[c]
            }
            return this
        }
    }

    function O(Z, Y, a) {
        if (Z.addEventListener) {
            Z.addEventListener(Y, a, false)
        }
        else {
            if (Z.attachEvent) {
                Z.attachEvent("on" + Y, function () {
                    return a.call(Z, window.event)
                })
            }
        }
    }

    function R(Z, Y) {
        var a = D.get(Z);
        if (a.options) {
            return Z
        }
        if (Y.hover && Y.hoverables[Z.nodeName.toLowerCase()]) {
            B.attach(Z)
        }
        a.options = Y;
        return Z
    }

    function I(Y) {
        var Z = {};
        return function (a) {
            if (!Z.hasOwnProperty(a)) {
                Z[a] = Y.apply(null, arguments)
            }
            return Z[a]
        }
    }

    function C(d, c) {
        if (!c) {
            c = L.getStyle(d)
        }
        var Z = c.get("fontFamily").split(/\s*,\s*/), b;
        for (var a = 0, Y = Z.length; a < Y; ++a) {
            b = Z[a].replace(/^(["'])(.*?)\1$/, "$2").toLowerCase();
            if (H[b]) {
                return H[b].get(c.get("fontStyle"), c.get("fontWeight"))
            }
        }
        return null
    }

    function F(Y) {
        return document.getElementsByTagName(Y)
    }

    function G() {
        var Y = {}, b;
        for (var a = 0, Z = arguments.length; a < Z; ++a) {
            for (b in arguments[a]) {
                Y[b] = arguments[a][b]
            }
        }
        return Y
    }

    function M(b, k, Z, m, c, a) {
        var j = m.separate;
        if (j == "none") {
            return W[m.engine].apply(null, arguments)
        }
        var h = document.createDocumentFragment(), e;
        var f = k.split(N[j]), Y = (j == "words");
        if (Y && S) {
            if (/^\s/.test(k)) {
                f.unshift("")
            }
            if (/\s$/.test(k)) {
                f.push("")
            }
        }
        for (var g = 0, d = f.length; g < d; ++g) {
            e = W[m.engine](b, Y ? L.textAlign(f[g], Z, g, d) : f[g], Z, m, c, a, g < d - 1);
            if (e) {
                h.appendChild(e)
            }
        }
        return h
    }

    function J(Z, g) {
        var a, Y, d, f;
        for (var b = R(Z, g).firstChild; b; b = d) {
            d = b.nextSibling;
            f = false;
            if (b.nodeType == 1) {
                if (!b.firstChild) {
                    continue
                }
                if (!/cufon/.test(b.className)) {
                    arguments.callee(b, g);
                    continue
                }
                else {
                    f = true
                }
            }
            if (!Y) {
                Y = L.getStyle(Z).extend(g)
            }
            if (!a) {
                a = C(Z, Y)
            }
            if (!a) {
                continue
            }
            if (f) {
                W[g.engine](a, null, Y, g, b, Z);
                continue
            }
            var e = b.data;
            if (e === "") {
                continue
            }
            var c = M(a, e, Y, g, b, Z);
            if (c) {
                b.parentNode.replaceChild(c, b)
            }
            else {
                b.parentNode.removeChild(b)
            }
        }
    }

    var S = " ".split(/\s+/).length == 0;
    var D = new X();
    var B = new P();
    var V = [];
    var W = {}, H = {}, T = {
        enableTextDecoration: false,
        engine: null,
        hover: false,
        hoverables: {a: true},
        printable: true,
        selector: (window.Sizzle || window.jQuery || (window.dojo && dojo.query) || (window.$$ && function (Y) {
            return $$(Y)
        }) || (window.$ && function (Y) {
            return $(Y)
        }) || (document.querySelectorAll && function (Y) {
            return document.querySelectorAll(Y)
        }) || F),
        separate: "words",
        textShadow: "none"
    };
    var N = {words: /\s+/, characters: ""};
    K.now = function () {
        U.ready();
        return K
    };
    K.refresh = function () {
        var a = V.splice(0, V.length);
        for (var Z = 0, Y = a.length; Z < Y; ++Z) {
            K.replace.apply(null, a[Z])
        }
        return K
    };
    K.registerEngine = function (Z, Y) {
        if (!Y) {
            return K
        }
        W[Z] = Y;
        return K.set("engine", Z)
    };
    K.registerFont = function (a) {
        var Y = new Q(a), Z = Y.family;
        if (!H[Z]) {
            H[Z] = new E()
        }
        H[Z].add(Y);
        return K.set("fontFamily", Z)
    };
    K.replace = function (a, Z, Y) {
        Z = G(T, Z);
        if (!Z.engine) {
            return K
        }
        if (typeof Z.textShadow == "string") {
            Z.textShadow = L.textShadow(Z.textShadow)
        }
        if (!Y) {
            V.push(arguments)
        }
        if (a.nodeType || typeof a == "string") {
            a = [a]
        }
        L.ready(function () {
            for (var c = 0, b = a.length; c < b; ++c) {
                var d = a[c];
                if (typeof d == "string") {
                    K.replace(Z.selector(d), Z, true)
                }
                else {
                    J(d, Z)
                }
            }
        });
        return K
    };
    K.set = function (Y, Z) {
        T[Y] = Z;
        return K
    };
    return K
})();
Cufon.registerEngine("canvas", (function () {
    var B = document.createElement("canvas");
    if (!B || !B.getContext || !B.getContext.apply) {
        return null
    }
    B = null;
    var A = Cufon.CSS.supports("display", "inline-block");
    var E = !A && (document.compatMode == "BackCompat" || /frameset|transitional/i.test(document.doctype.publicId));
    var F = document.createElement("style");
    F.type = "text/css";
    F.appendChild(document.createTextNode(".cufon-canvas{text-indent:0}@media screen,projection{.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle" + (E ? "" : ";font-size:1px;line-height:1px") + "}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden}" + (A ? ".cufon-canvas canvas{position:relative}" : ".cufon-canvas canvas{position:absolute}") + "}@media print{.cufon-canvas{padding:0 !important}.cufon-canvas canvas{display:none}.cufon-canvas .cufon-alt{display:inline}}"));
    document.getElementsByTagName("head")[0].appendChild(F);
    function D(O, H) {
        var M = 0, L = 0;
        var G = [], N = /([mrvxe])([^a-z]*)/g, J;
        generate:for (var I = 0; J = N.exec(O); ++I) {
            var K = J[2].split(",");
            switch (J[1]) {
                case"v":
                    G[I] = {
                        m: "bezierCurveTo",
                        a: [M + ~~K[0], L + ~~K[1], M + ~~K[2], L + ~~K[3], M += ~~K[4], L += ~~K[5]]
                    };
                    break;
                case"r":
                    G[I] = {m: "lineTo", a: [M += ~~K[0], L += ~~K[1]]};
                    break;
                case"m":
                    G[I] = {m: "moveTo", a: [M = ~~K[0], L = ~~K[1]]};
                    break;
                case"x":
                    G[I] = {m: "closePath"};
                    break;
                case"e":
                    break generate
            }
            H[G[I].m].apply(H, G[I].a)
        }
        return G
    }

    function C(K, J) {
        for (var I = 0, H = K.length; I < H; ++I) {
            var G = K[I];
            J[G.m].apply(J, G.a)
        }
    }

    return function (q, T, k, P, X, r) {
        var I = (T === null);
        var V = q.viewBox;
        var J = k.getSize("fontSize", q.baseSize);
        var h = k.get("letterSpacing");
        h = (h == "normal") ? 0 : J.convertFrom(parseInt(h, 10));
        var W = 0, j = 0, f = 0, R = 0;
        var U = P.textShadow, d = [];
        if (U) {
            for (var p = 0, m = U.length; p < m; ++p) {
                var Z = U[p];
                var c = J.convertFrom(parseFloat(Z.offX));
                var b = J.convertFrom(parseFloat(Z.offY));
                d[p] = [c, b];
                if (b < W) {
                    W = b
                }
                if (c > j) {
                    j = c
                }
                if (b > f) {
                    f = b
                }
                if (c < R) {
                    R = c
                }
            }
        }
        var u = Cufon.CSS.textTransform(I ? X.alt : T, k).split("");
        var G = 0, S = null;
        for (var p = 0, m = u.length; p < m; ++p) {
            var Q = q.glyphs[u[p]] || q.missingGlyph;
            if (!Q) {
                continue
            }
            G += S = Number(Q.w || q.w) + h
        }
        if (S === null) {
            return null
        }
        j += (V.width - S);
        R += V.minX;
        var O, K;
        if (I) {
            O = X;
            K = X.firstChild
        }
        else {
            O = document.createElement("span");
            O.className = "cufon cufon-canvas";
            O.alt = T;
            K = document.createElement("canvas");
            O.appendChild(K);
            if (P.printable) {
                var n = document.createElement("span");
                n.className = "cufon-alt";
                n.appendChild(document.createTextNode(T));
                O.appendChild(n)
            }
        }
        var v = O.style;
        var a = K.style;
        var H = J.convert(V.height - W + f);
        var t = Math.ceil(H);
        var e = t / H;
        K.width = Math.ceil(J.convert(G + j - R) * e);
        K.height = t;
        W += V.minY;
        a.top = Math.round(J.convert(W - q.ascent)) + "px";
        a.left = Math.round(J.convert(R)) + "px";
        var N = Math.ceil(J.convert(G * e)) + "px";
        if (A) {
            v.width = N;
            v.height = J.convert(q.height) + "px"
        }
        else {
            v.paddingLeft = N;
            v.paddingBottom = (J.convert(q.height) - 1) + "px"
        }
        var s = K.getContext("2d"), Y = t / V.height;
        s.scale(Y, Y);
        s.translate(-R, -W);
        s.lineWidth = q.face["underline-thickness"];
        s.save();
        function L(i, g) {
            s.strokeStyle = g;
            s.beginPath();
            s.moveTo(0, i);
            s.lineTo(G, i);
            s.stroke()
        }

        var M = P.enableTextDecoration ? Cufon.CSS.textDecoration(r, k) : {};
        if (M.underline) {
            L(-q.face["underline-position"], M.underline)
        }
        if (M.overline) {
            L(q.ascent, M.overline)
        }
        s.fillStyle = k.get("color");
        function o() {
            for (var w = 0, g = u.length; w < g; ++w) {
                var x = q.glyphs[u[w]] || q.missingGlyph;
                if (!x) {
                    continue
                }
                s.beginPath();
                if (x.d) {
                    if (x.code) {
                        C(x.code, s)
                    }
                    else {
                        x.code = D("m" + x.d, s)
                    }
                }
                s.fill();
                s.translate(Number(x.w || q.w) + h, 0)
            }
        }

        if (U) {
            for (var p = 0, m = U.length; p < m; ++p) {
                var Z = U[p];
                s.save();
                s.fillStyle = Z.color;
                s.translate.apply(s, d[p]);
                o();
                s.restore()
            }
        }
        o();
        s.restore();
        if (M["line-through"]) {
            L(-q.descent, M["line-through"])
        }
        return O
    }
})());
Cufon.registerEngine("vml", (function () {
    if (!document.namespaces) {
        return
    }
    document.write('<!--[if vml]><script type="text/javascript">Cufon.vmlEnabled=true;<\/script><![endif]-->');
    if (!Cufon.vmlEnabled) {
        return
    }
    if (document.namespaces.cvml == null) {
        document.namespaces.add("cvml", "urn:schemas-microsoft-com:vml");
        document.write('<style type="text/css">.cufon-vml-canvas{text-indent:0}@media screen{cvml\\:shape,cvml\\:group,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute}.cufon-vml-canvas{position:absolute;text-align:left}.cufon-vml{display:inline-block;position:relative;vertical-align:middle}.cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px}a .cufon-vml{cursor:pointer}}@media print{.cufon-vml *{display:none}.cufon-vml .cufon-alt{display:inline}}</style>')
    }
    function B(C, D) {
        return A(C, /(?:em|ex|%)$/i.test(D) ? "1em" : D)
    }

    function A(F, G) {
        if (/px$/i.test(G)) {
            return parseFloat(G)
        }
        var E = F.style.left, D = F.runtimeStyle.left;
        F.runtimeStyle.left = F.currentStyle.left;
        F.style.left = G;
        var C = F.style.pixelLeft;
        F.style.left = E;
        F.runtimeStyle.left = D;
        return C
    }

    return function (r, U, m, R, Y, s, h) {
        var F = (U === null);
        if (F) {
            U = Y.alt
        }
        var W = r.viewBox;
        var G = m.computedFontSize || (m.computedFontSize = new Cufon.CSS.Size(B(s, m.get("fontSize")) + "px", r.baseSize));
        var g = m.computedLSpacing;
        if (g == undefined) {
            g = m.get("letterSpacing");
            m.computedLSpacing = g = (g == "normal") ? 0 : ~~G.convertFrom(A(s, g))
        }
        var O, H;
        if (F) {
            O = Y;
            H = Y.firstChild
        }
        else {
            O = document.createElement("span");
            O.className = "cufon cufon-vml";
            O.alt = U;
            H = document.createElement("span");
            H.className = "cufon-vml-canvas";
            O.appendChild(H);
            if (R.printable) {
                var p = document.createElement("span");
                p.className = "cufon-alt";
                p.appendChild(document.createTextNode(U));
                O.appendChild(p)
            }
            if (!h) {
                O.appendChild(document.createElement("cvml:group"))
            }
        }
        var x = O.style;
        var b = H.style;
        var D = G.convert(W.height), u = Math.ceil(D);
        var f = u / D;
        var e = W.minX, d = W.minY;
        b.height = u;
        b.top = Math.round(G.convert(d - r.ascent));
        b.left = Math.round(G.convert(e));
        x.height = G.convert(r.height) + "px";
        var K = R.enableTextDecoration ? Cufon.CSS.textDecoration(s, m) : {};
        var T = m.get("color");
        var v = Cufon.CSS.textTransform(U, m).split("");
        var C = 0, c = 0, L = null;
        var S, M, V = R.textShadow;
        for (var q = 0, o = 0, n = v.length; q < n; ++q) {
            S = r.glyphs[v[q]] || r.missingGlyph;
            if (S) {
                C += L = ~~(S.w || r.w) + g
            }
        }
        if (L === null) {
            return null
        }
        var N = -e + C + (W.width - L);
        var w = G.convert(N * f), j = Math.round(w);
        var a = N + "," + W.height, E;
        var X = "r" + a + "nsnf";
        for (q = 0; q < n; ++q) {
            S = r.glyphs[v[q]] || r.missingGlyph;
            if (!S) {
                continue
            }
            if (F) {
                M = H.childNodes[o];
                if (M.firstChild) {
                    M.removeChild(M.firstChild)
                }
            }
            else {
                M = document.createElement("cvml:shape");
                H.appendChild(M)
            }
            M.stroked = "f";
            M.coordsize = a;
            M.coordorigin = E = (e - c) + "," + d;
            M.path = (S.d ? "m" + S.d + "xe" : "") + "m" + E + X;
            M.fillcolor = T;
            var t = M.style;
            t.width = j;
            t.height = u;
            if (V) {
                var J = V[0], I = V[1];
                var Q = Cufon.CSS.color(J.color), P;
                var Z = document.createElement("cvml:shadow");
                Z.on = "t";
                Z.color = Q.color;
                Z.offset = J.offX + "," + J.offY;
                if (I) {
                    P = Cufon.CSS.color(I.color);
                    Z.type = "double";
                    Z.color2 = P.color;
                    Z.offset2 = I.offX + "," + I.offY
                }
                Z.opacity = Q.opacity || (P && P.opacity) || 1;
                M.appendChild(Z)
            }
            c += ~~(S.w || r.w) + g;
            ++o
        }
        x.width = Math.max(Math.ceil(G.convert(C * f)), 0);
        return O
    }
})());