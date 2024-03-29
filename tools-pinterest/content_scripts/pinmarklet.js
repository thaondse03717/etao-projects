(function (k, m, n, l) {
    var a = k[l.k] = {
        w: k,
        d: m,
        n: n,
        a: l,
        s: {},
        f: function () {
            return {
                callback: [],
                kill: function (b) {
                    if (typeof b === "string") b = a.d.getElementById(b);
                    b && b.parentNode && b.parentNode.removeChild(b)
                },
                get: function (b, c) {
                    var d = null;
                    return d = b[c] || b.getAttribute(c)
                },
                make: function (b) {
                    var c = false,
                        d, e;
                    for (d in b) if (b[d].hasOwnProperty) {
                        c = a.d.createElement(d);
                        for (e in b[d]) if (b[d][e].hasOwnProperty) if (typeof b[d][e] === "string") c[e] = b[d][e];
                        break
                    }
                    return c
                },
                listen: function (b, c, d) {
                    if (typeof a.w.addEventListener !== "undefined") b.addEventListener(c, d, false);
                    else typeof a.w.attachEvent !== "undefined" && b.attachEvent("on" + c, d)
                },
                getSelection: function () {
                    return ("" + (a.w.getSelection ? a.w.getSelection() : a.d.getSelection ? a.d.getSelection() : a.d.selection.createRange().text)).replace(/(^\s+|\s+$)/g, "")
                },
                pin: function (b) {
                    var c = "";
                    c = b.getElementsByTagName("IMG")[0];
                    var d = "false",
                        e = a.a.pin + "?",
                        f = (new Date).getTime();
                    if (b.rel === "video") d = "true";
                    e = e + "media=" + encodeURIComponent(c.src);
                    e = e + "&url=" + encodeURIComponent(c.getAttribute("url") || a.d.URL);
                    e = e + "&title=" + encodeURIComponent(a.d.title);
                    e = e + "&is_video=" + d;
                    c = a.v.selectedText || c.title || c.alt;
                    c = c.substr(0, 500);
                    e = e + "&description=" + encodeURIComponent(c);
                    if (a.v.hazIOS) {
                        a.w.setTimeout(function () {
                            a.w.location = "pinit12://" + e
                        }, 25);
                        a.w.location = "http://" + e
                    } else a.w.open("http://" + e, "pin" + f, a.a.pop)
                },
                close: function (b) {
                    if (a.s.bg) {
                        a.d.b.removeChild(a.s.shim);
                        a.d.b.removeChild(a.s.bg);
                        a.d.b.removeChild(a.s.bd)
                    }
                    k.hazPinningNow = false;
                    b && a.w.alert(b);
                    a.v.hazGoodUrl = false;
                    a.w.scroll(0, a.v.saveScrollTop)
                },
                click: function (b) {
                    b = b || a.w.event;
                    var c = null;
                    if (c = b.target ? b.target.nodeType === 3 ? b.target.parentNode : b.target : b.srcElement) if (c === a.s.x) a.f.close();
                    else if (c.className !== a.a.k + "_hideMe") {
                        if (!c.className) c = c.parentNode;
                        if (c.parentNode.className === a.a.k + "_pinContainer" || c.parentNode.parentNode.className === a.a.k + "_pinContainer" || c.className === a.a.k + "_pinButton") {
                            a.f.pin(c.parentNode.getElementsByTagName("A")[0]);
                            a.w.setTimeout(function () {
                                a.f.close()
                            }, 10)
                        }
                    }
                },
                behavior: function () {
                    a.f.listen(a.s.bd, "click", a.f.click)
                },
                presentation: function () {
                    var b = a.f.make({
                        STYLE: {
                            type: "text/css"
                        }
                    }),
                        c = a.a.rules.join("\n").replace(/#_/g, "#" + l.k + "_").replace(/\._/g, "." + l.k + "_");
                    if (b.styleSheet) b.styleSheet.cssText = c;
                    else b.appendChild(a.d.createTextNode(c));
                    a.d.h.appendChild(b)
                },
                addThumb: function (b, c, d) {
                    (d = b.getElementsByTagName(d)[0]) ? b.insertBefore(c, d) : b.appendChild(c)
                },
                thumb: function (b) {
                    var c = a.a.k + "_thumb_" + b.src;
                    if (typeof b.nopin === "undefined") b.nopin = 0;
                    if (b.src) {
                        if (!b.media) b.media = "image";
                        var d = a.f.make({
                            SPAN: {
                                className: a.a.k + "_pinContainer"
                            }
                        }),
                            e = a.f.make({
                                A: {
                                    rel: b.media
                                }
                            }),
                            f = new Image;
                        f.setAttribute("nopin", "nopin");
                        if (b.title) f.title = b.title;
                        b.page && f.setAttribute("url", b.page);
                        f.style.visibility = "hidden";
                        f.onload = function () {
                            var h = this.width,
                                i = this.height;
                            if (i > h) {
                                this.height = a.a.thumbCellSize;
                                var j = a.a.thumbCellSize * (h / i);
                                this.style.width = j;
                                this.style.marginLeft = a.a.thumbCellSize / 2 - j / 2 + "px"
                            }
                            if (i < h) {
                                this.width = a.a.thumbCellSize;
                                j = a.a.thumbCellSize * (i / h);
                                this.style.height = j;
                                this.style.marginTop = a.a.thumbCellSize / 2 - j / 2 + "px"
                            }
                            if (i === h) {
                                this.style.height = a.a.thumbCellSize + "px";
                                this.style.width = a.a.thumbCellSize + "px"
                            }
                            this.style.visibility = ""
                        };
                        f.src = b.src;
                        e.appendChild(f);
                        if (b.media !== "image") {
                            f = a.f.make({
                                B: {}
                            });
                            e.appendChild(f)
                        }
                        f = a.f.make({
                            CITE: {
                                innerHTML: b.height + " x " + b.width
                            }
                        });
                        e.appendChild(f);
                        d.appendChild(e);
                        d.appendChild(a.f.make({
                            SPAN: {
                                className: a.a.k + "_pinButton"
                            }
                        }));
                        e = false;
                        if (b.dupe) {
                            f = 0;
                            for (var g = a.v.thumbed.length; f < g; f += 1) if (a.v.thumbed[f].id.indexOf(b.dupe) !== -1) {
                                e = a.v.thumbed[f].id;
                                break
                            }
                        }
                        if (e !== false) if (e =
                        a.d.getElementById(e)) {
                            if (b.nopin === 1) a.v.hazAtLeastOneGoodThumb -= 1;
                            else e.parentNode.insertBefore(d, e);
                            e.parentNode.removeChild(e)
                        } else {
                            if (b.nopin === 0) b.page || b.media !== "image" ? a.f.addThumb(a.s.embedContainer, d, "SPAN") : a.f.addThumb(a.s.imgContainer, d, "SPAN")
                        } else if (b.nopin === 0) {
                            a.f.addThumb(a.s.imgContainer, d, "SPAN");
                            a.v.hazAtLeastOneGoodThumb += 1
                        }(b = a.d.getElementById(c)) && b.parentNode.removeChild(b);
                        d.id = c;
                        a.v.thumbed.push(d)
                    }
                },
                call: function (b, c) {
                    var d = a.f.callback.length,
                        e = a.a.k + ".f.callback[" + d + "]",
                        f = a.d.createElement("SCRIPT");
                    a.f.callback[d] = function (g) {
                        c(g, d);
                        a.v.awaitingCallbacks -= 1;
                        a.f.kill(e)
                    };
                    f.id = e;
                    f.src = b + "&callback=" + e;
                    f.type = "text/javascript";
                    f.charset = "utf-8";
                    a.v.firstScript.parentNode.insertBefore(f, a.v.firstScript);
                    a.v.awaitingCallbacks += 1
                },
                ping: {
                    check: function (b) {
                        b && b.pinnable === false && a.f.close(a.a.msg.noPin)
                    },
                    embed: function (b) {
                        if (b) if (b.err) {
                            if (b = a.d.getElementById(a.a.k + "_thumb_" + b.id)) {
                                var c = b.getElementsByTagName("SPAN")[0];
                                b.removeChild(c);
                                c = a.f.make({
                                    SPAN: {
                                        className: a.a.k + "_hideMe",
                                        innerHTML: "Sorry, cannot pin this image."
                                    }
                                });
                                b.appendChild(c)
                            }
                            a.v.hazAtLeastOneGoodThumb -= 1
                        } else if (b.reply && b.reply.img && b.reply.img.src) {
                            c = "";
                            if (b.reply.page) c = b.reply.page;
                            nopin = typeof b.reply.nopin === "undefined" || b.reply.nopin === 0 ? 0 : 1;
                            a.f.thumb({
                                src: b.reply.img.src,
                                height: b.reply.img.height,
                                width: b.reply.img.width,
                                media: b.reply.media,
                                title: b.reply.description,
                                page: c,
                                dupe: b.id,
                                nopin: nopin
                            })
                        }
                    }
                },
                getId: function (b) {
                    for (var c, d = b.u.split("?")[0].split("#")[0].split("/"); !c;) c = d.pop();
                    if (b.r) c = parseInt(c, b.r);
                    return encodeURIComponent(c)
                },
                hazUrl: {
                    vimeo: function () {
                        var b = a.f.getId({
                            u: a.d.URL,
                            r: 10
                        });
                        a.d.getElementsByTagName("DIV");
                        a.d.getElementsByTagName("LI");
                        a.d.getElementsByTagName("A");
                        var c = "vimeo";
                        if (a.d.URL.match(/^https/)) c += "_s";
                        if (b > 1E3 && a.v.hazCalledForThumb["_" + b] !== true) {
                            a.f.call(a.a.embed + "?src=" + c + "&id=" + b, a.f.ping.embed);
                            a.v.hazCalledForThumb["_" + b] = true
                        }
                    },
                    pinterest: function () {
                        a.f.close(a.a.msg.installed)
                    },
                    facebook: function () {
                        a.f.close(a.a.msg.privateDomain.replace(/%privateDomain%/, "Facebook"))
                    },
                    googleReader: function () {
                        a.f.close(a.a.msg.privateDomain.replace(/%privateDomain%/, "Google Reader"))
                    },
                    stumbleUpon: function () {
                        var b = 0,
                            c = a.a.stumbleFrame.length,
                            d;
                        for (b = 0; b < c; b += 1) if (d = a.d.getElementById(a.a.stumbleFrame[b])) {
                            a.f.close();
                            if (a.w.confirm(a.a.msg.bustFrame)) {
                                a.d.location = d.src;
                                a.w.open(d.src)
                            }
                            break
                        }
                    }
                },
                hazSite: {
                    flickr: {
                        img: function (b) {
                            if (b.src) {
                                b.src = b.src.split("?")[0];
                                a.f.call(a.a.embed + "?src=flickr&id=" + encodeURIComponent(b.src), a.f.ping.embed)
                            }
                        }
                    },
                    youtube: {
                        img: function (b) {
                            b =
                            b.src.split("?")[0].split("#")[0].split("/");
                            b.pop();
                            (id = b.pop()) && a.f.call(a.a.embed + "?src=youtube&id=" + id, a.f.ping.embed)
                        },
                        iframe: function (b) {
                            (b = a.f.getId({
                                u: b.src
                            })) && a.f.call(a.a.embed + "?src=youtube&id=" + b, a.f.ping.embed)
                        },
                        video: function (b) {
                            (b = b.getAttribute("data-youtube-id")) && a.f.call(a.a.embed + "?src=youtube&id=" + encodeURIComponent(b), a.f.ping.embed)
                        },
                        embed: function (b) {
                            var c = b.getAttribute("flashvars"),
                                d = "";
                            if (c) {
                                if (d = c.split("video_id=")[1]) d = d.split("&")[0];
                                d = encodeURIComponent(d)
                            } else d = a.f.getId({
                                u: b.src
                            });
                            d && a.f.call(a.a.embed + "?src=youtube&id=" + d, a.f.ping.embed)
                        },
                        object: function (b) {
                            b = b.getAttribute("data");
                            var c = "";
                            if (b)(c = a.f.getId({
                                u: b
                            })) && a.f.call(a.a.embed + "?src=youtube&id=" + c, a.f.ping.embed)
                        }
                    },
                    vimeo: {
                        iframe: function (b) {
                            b = a.f.getId({
                                u: b.src,
                                r: 10
                            });
                            b > 1E3 && a.f.call(a.a.embed + "?src=vimeo&id=" + b, a.f.ping.embed)
                        }
                    }
                },
                hazTag: {
                    img: function (b) {
                        if (!b.src.match(/^data/)) {
                            var c = new Image;
                            c.src = b.src;
                            c.height > a.a.minImgSize && c.width > a.a.minImgSize && a.f.thumb({
                                src: c.src,
                                height: c.height,
                                width: c.width
                            })
                        }
                    },
                    meta: function (b) {
                        b.name && b.name.toUpperCase() === "PINTEREST" && b.content && b.content.toUpperCase() === "NOPIN" && a.f.close(a.a.msg.noPin)
                    }
                },
                checkTags: function () {
                    var b, c, d, e, f, g, h, i, j;
                    a.v.tag = [];
                    b = 0;
                    for (c = a.a.check.length; b < c; b += 1) {
                        f = a.d.getElementsByTagName(a.a.check[b]);
                        d = 0;
                        for (e = f.length; d < e; d += 1) {
                            g = f[d];
                            !g.getAttribute("nopin") && g.style.display !== "none" && g.style.visibility !== "hidden" && a.v.tag.push(g)
                        }
                    }
                    b = 0;
                    for (c = a.v.tag.length; b < c; b += 1) {
                        f = a.v.tag[b];
                        g = f.tagName.toLowerCase();
                        if (a.a.tag[g]) for (h in a.a.tag[g]) if (a.a.tag[g][h].hasOwnProperty) {
                            i =
                            a.a.tag[g][h];
                            if (j = a.f.get(f, i.att)) {
                                d = 0;
                                for (e = i.match.length; d < e; d += 1) j.match(i.match[d]) && a.f.hazSite[h][g](f)
                            }
                        }
                        a.f.hazTag[g] && a.f.hazTag[g](f)
                    }
                },
                getHeight: function () {
                    return Math.max(Math.max(a.d.b.scrollHeight, a.d.d.scrollHeight), Math.max(a.d.b.offsetHeight, a.d.d.offsetHeight), Math.max(a.d.b.clientHeight, a.d.d.clientHeight))
                },
                structure: function () {
                    a.s.shim = a.f.make({
                        IFRAME: {
                            height: "100%",
                            width: "100%",
                            allowTransparency: true,
                            id: a.a.k + "_shim"
                        }
                    });
                    a.s.shim.setAttribute("nopin", "nopin");
                    a.d.b.appendChild(a.s.shim);
                    a.s.bg = a.f.make({
                        DIV: {
                            id: a.a.k + "_bg"
                        }
                    });
                    a.d.b.appendChild(a.s.bg);
                    a.s.bd = a.f.make({
                        DIV: {
                            id: a.a.k + "_bd"
                        }
                    });
                    a.s.x = a.f.make({
                        A: {
                            id: a.a.k + "_x",
                            innerHTML: a.a.msg.cancelTitle
                        }
                    });
                    a.s.bd.appendChild(a.s.x);
                    a.s.bd.appendChild(a.f.make({
                        SPAN: {
                            id: a.a.k + "_logo"
                        }
                    }));
                    a.s.embedContainer = a.f.make({
                        I: {
                            id: a.a.k + "_embedContainer"
                        }
                    });
                    a.s.bd.appendChild(a.s.embedContainer);
                    a.s.imgContainer = a.f.make({
                        I: {
                            id: a.a.k + "_imgContainer"
                        }
                    });
                    a.s.bd.appendChild(a.s.imgContainer);
                    a.d.b.appendChild(a.s.bd);
                    var b = a.f.getHeight();
                    if (a.s.bd.offsetHeight < b) {
                        a.s.bd.style.height = b + "px";
                        a.s.bg.style.height = b + "px";
                        a.s.shim.style.height = b + "px"
                    }
                    a.w.scroll(0, 0)
                },
                checkUrl: function () {
                    var b;
                    for (b in a.a.url) if (a.a.url[b].hasOwnProperty) if (a.d.URL.match(a.a.url[b])) {
                        a.f.hazUrl[b]();
                        if (a.v.hazGoodUrl === false) return false
                    }
                    return true
                },
                checkPage: function () {
                    if (a.f.checkUrl()) {
                        a.f.checkTags();
                        if (a.v.hazGoodUrl === false) return false
                    } else return false;
                    return true
                },
                init: function () {
                    a.d.d = a.d.documentElement;
                    a.d.b = a.d.getElementsByTagName("BODY")[0];
                    a.d.h = a.d.getElementsByTagName("HEAD")[0];
                    if (!a.d.b || !a.d.h) a.f.close(a.a.msg.noPinIncompletePage);
                    else if (k.hazPinningNow !== true) {
                        k.hazPinningNow = true;
                        var b, c = a.n.userAgent;
                        a.v = {
                            saveScrollTop: a.w.pageYOffset,
                            hazGoodUrl: true,
                            hazAtLeastOneGoodThumb: 0,
                            awaitingCallbacks: 0,
                            thumbed: [],
                            hazCalledForThumb: {},
                            hazIE: function () {
                                return /msie/i.test(c) && !/opera/i.test(c)
                            }(),
                            hazIOS: function () {
                                return c.match(/iP/) !== null
                            }(),
                            firstScript: a.d.getElementsByTagName("SCRIPT")[0],
                            selectedText: a.f.getSelection()
                        };
                        b = a.a.checkpoint.url + "?url=" + encodeURIComponent(a.d.URL);
                        a.f.call(b, a.f.ping.check);
                        a.f.presentation();
                        a.f.structure();
                        if (a.f.checkPage()) if (a.v.hazGoodUrl === true) {
                            a.f.behavior();
                            if (a.f.callback.length > 1) a.v.waitForCallbacks = a.w.setInterval(function () {
                                if (a.v.awaitingCallbacks === 0) if (a.v.hazAtLeastOneGoodThumb === 0 || a.v.tag.length === 0) {
                                    a.w.clearInterval(a.v.waitForCallbacks);
                                    a.f.close(a.a.msg.notFound)
                                }
                            }, 500);
                            else if (a.v.hazAtLeastOneGoodThumb === 0 || a.v.tag.length === 0) a.f.close(a.a.msg.notFound)
                        }
                    }
                }
            }
        }()
    };
    a.f.init()
})(window, document, navigator, {
    k: "PIN_" + (new Date).getTime(),
    checkpoint: {
        url: "//api.pinterest.com/v2/domains/info/"
    },
    embed: "//pinterest.com/embed/",
    pin: "pinterest.com/pin/create/bookmarklet/",
    minImgSize: 80,
    thumbCellSize: 200,
    check: ["meta", "iframe", "embed", "object", "img", "video", "a"],
    url: {
        vimeo: /^https?:\/\/vimeo\.com\//,
        facebook: /^https?:\/\/.*?\.facebook\.com\//,
        googleReader: /^https?:\/\/.*?\.google\.com\/reader\//,
        pinterest: /^https?:\/\/.*?\.?pinterest\.com\//,
        stumbleUpon: /^https?:\/\/.*?\.stumbleupon\.com\//
    },
    stumbleFrame: ["tb-stumble-frame", "stumbleFrame"],
    tag: {
        img: {
            flickr: {
                att: "src",
                match: [/staticflickr.com/, /static.flickr.com/]
            },
            youtube: {
                att: "src",
                match: [/ytimg.com\/vi/, /img.youtube.com\/vi/]
            }
        },
        video: {
            youtube: {
                att: "src",
                match: [/videoplayback/]
            }
        },
        embed: {
            youtube: {
                att: "src",
                match: [/^http:\/\/s\.ytimg\.com\/yt/, /^http:\/\/.*?\.?youtube-nocookie\.com\/v/]
            }
        },
        iframe: {
            youtube: {
                att: "src",
                match: [/^http:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/]
            },
            vimeo: {
                att: "src",
                match: [/^http?s:\/\/vimeo.com\/(\d+)/, /^http:\/\/player\.vimeo\.com\/video\/(\d+)/]
            }
        },
        object: {
            youtube: {
                att: "data",
                match: [/^http:\/\/.*?\.?youtube-nocookie\.com\/v/]
            }
        }
    },
    msg: {
        check: "",
        cancelTitle: "Cancel Pin",
        noPinIncompletePage: "Sorry, can't pin from non-HTML pages. If you're trying to upload an image, please visit pinterest.com.",
        bustFrame: "We need to remove the StumbleUpon toolbar before you can pin anything. Click OK to do this or Cancel to stay here.",
        noPin: "This site doesn't allow pinning to Pinterest. Please contact the owner with any questions. Thanks for visiting!",
        privateDomain: "Sorry, can't pin directly from %privateDomain%.",
        notFound: "Sorry, couldn't find any pinnable images or video on this page.",
        installed: "The bookmarklet is installed! Now you can click your Pin It button to pin images as you browse sites around the web."
    },
    pop: "status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=632,height=270,left=0,top=0",
    rules: ["#_shim {z-index:8675309; position: absolute; background: transparent; top:0; right:0; bottom:0; left:0; width: 100%; }", "#_bg {z-index:8675310; position: absolute; top:0; right:0; bottom:0; left:0; background-color:#f2f2f2; opacity:.95; width: 100%; }", "#_bd {z-index:8675311; position: absolute; text-align: left; padding-top: 38px; width: 100%; top: 0; left: 0; right: 0; font:16px hevetica neue,arial,san-serif; }", "#_bd i { font-style:normal; }", "#_bd a#_x { z-index:8675332; position: fixed; *position:absolute; width:100%; top: 0; left: 0; right: 0; cursor: pointer; height: 37px; line-height: 36px; font-size: 14px; font-weight: bold; display: block; margin: 0; background: url(//d3io1k5o0zdpqr.cloudfront.net/images/fullGradient07Normal.png) repeat-x scroll 0 0 #FFFFFF; border-bottom: 1px solid #aaa; color: #211922; text-align: center;}", "#_bd a#_x:active {background-color: #211922; background-image: url(//d3io1k5o0zdpqr.cloudfront.net/images/fullGradient07Inverted.png); border-color: #211922; text-shadow: 0 -1px #211922; }", "#_bd a#_x:hover {color: #fff; text-decoration: none; background-color: #1389e5; border-color: #1389e5; text-shadow: 0 -1px #46A0E6;}", "#_bd span { z-index:8675312; height:200px; width:200px; overflow:hidden; zoom:1; display:inline-block; background: #fff; text-shadow: 0 1px #fff; position: relative; vertical-align:middle; border: 1px solid #aaa; border-top: none; border-left: none;}", "#_bd span#_logo {background: #FCF9F9 url(//d3io1k5o0zdpqr.cloudfront.net/images/about/LogoAbout.png) 50% 50% no-repeat;}", "#_bd span a {z-index:8675314; cursor: pointer; height: 200px; width: 200px; }", "#_bd span a img { z-index: 8675316; position: absolute; top: 0; left: 0; border: 0; margin: 0; }", "#_bd span a b {z-index: 8675317;  position: absolute; top: 50%; left: 50%; height: 50px; width: 50px; background: transparent url(//d3io1k5o0zdpqr.cloudfront.net/images/VideoIndicator.png) 0 0 no-repeat; margin-top: -25px; margin-left: -25px; }", "#_bd span a cite {z-index: 8675317;  position: absolute; font-size: 10px; font-style: normal; bottom: 5px; width: 100px; left: 50%; margin-left: -50px; text-align: center; color: #000; background: #fff; padding: 3px;}", "#_bd span._pinContainer span._pinButton {z-index: 8675318;  line-height: 200px; font-size: 200px; cursor: pointer; position: absolute; top: 0; left: 0; height:200px; width:200px; background: transparent; }", "#_bd span._pinContainer span._pinButton:hover {background: transparent url(//d3io1k5o0zdpqr.cloudfront.net/images/PinThis.png) 50% 50% no-repeat; }", "#_bd span._pinContainer span._hideMe { z-index: 8675332;position: absolute; height: 200px; width: 200px; background: rgba(128, 128, 128, .5); *background: #aaa; line-height: 200px; font-size: 10px; color: #fff; text-align: center; font-weight: normal!important; }"]
});