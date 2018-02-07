! function(root) {
    var _head = document.head,
        _require,
        _base,
        _path = {},
        DOT_RE = /\/\.\//g,
        DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//,
        DOUBLE_SLASH_RE = /([^:/])\/\//g;

    /* Tool */
    function _isFunction(f) {
        return typeof f === 'function';
    }

    function _normalize(base, id) {
        if (_isUnnormalId(id)) return id;
        if (_isRelativePath(id)) return _resolvePath(base, id) + '.js';
        return id;
    }

    function _isUnnormalId(id) {
        return (/^https?:|^file:|^\/|\.js$/).test(id);
    }

    function _isRelativePath(path) {
        return (path + '').indexOf('.') === 0;
    }

    // reference from seajs
    function _resolvePath(base, path) {
        path = base.substring(0, base.lastIndexOf('/') + 1) + path;
        path = path.replace(DOT_RE, '/');
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, '/');
        }
        return path = path.replace(DOUBLE_SLASH_RE, '$1/');
    }

    var Loader = function(url, isLoaded) {
        if (!isLoaded) {
            this.load(url)
        }
        this.path = url;
        this.succList = [];
        this.failList = [];
    }

    Loader.prototype = {
        constructor: Loader,
        /**
         * load
         * @param {String} url
         */
        load: function(url) {
            var
                node = document.createElement('script'),
                _this = this;
            node.addEventListener('load', _onload, false);
            node.addEventListener('error', _onerror, false);

            node.type = 'text/javascript';
            node.async = 'async';
            node.src = url;

            function _onload() {
                _onece()
                _module.make(_this.path)
            }

            function _onerror() {
                _onece()
                _head.removeChild(node)
            }

            function _onece() {
                node.removeEventListener('load', _onload, false)
                node.removeEventListener('error', _onerror, false)
            }

            _head.appendChild(node);
        },
        /**
         * _push
         * @private
         * @param {Array} list
         * @param {Function} cb
         */
        _unshift: function(list, cb) {
            if (!list.some(function(item) {
                    return item === cb
                }))
                return list.unshift(cb);
        },
        /**
         * succ
         * @param {Function} cb
         */
        succ: function(cb) {
            return this._unshift(this.succList, cb);
        },
         /**
         * fail
         * @param {Function} cb
         */
        fail: function (cb) {
            return this._unshift(this.failList, cb);
        },
        /**
         * done
         */
        done: function () {
            this.loaded = true;
            this.succList.forEach(function (cb) {
                return cb();
            });
        },
        /**
         * down
         */
        down: function () {
            this.failList.forEach(function (cb) {
                return cb();
            });
        },
        /**
         * require
         * @returns exports
         */
        require: function () {
            if (this.factory) {
                var module = { exports: {} };
                this.factory(makeRequire({ base: this.path }), module.exports, module);
                this.exports = module.exports;
                this.require = function () {
                    return this.exports;
                };
                return this.require();
            } else {
                return new Error('script has not loaded.');
            }
        },
        /**
         * set
         * @param {Function} factory
         */
        set: function (factory) {
            this.factory = factory;
            return this.done();
        }
    }

    function _makeModules(modules, r) {
        var mods = [];
        modules.forEach(function(module) {
            mods.push(r(module));
        });
        return mods;
    }

    var Cache = (function() {
        var map = {}
        return {
            /**
             * get
             * @param {String} key
             * @returns value
             */
            get: function(key) {
                return map[key]
            },
            /**
             * put
             * @param {String} key
             * @param {Object} value
             * @returns success or failure
             */
            put: function(key, value) {
                if (key in map) return false;
                map[key] = value;
                return true;
            }
        }
    })()

    /**
     * 内部模块
     */
    var _module = (function() {
        var stack = []

        return {
            /**
             * push
             * @param {Object} o
             */
            push: function() {
                return stack.push.apply(stack, arguments);
            },
            /**
             * make
             * @param {String} src
             */
            make: function(baseUrl) {
                stack.forEach(function(o) {
                    // 格式化路径
                    var module = o.n = _normalize(baseUrl, o.n);

                    var loader = Cache.get(module);
                    if (!loader) {
                        loader = new Loader(module, true);
                        Cache.put(module, loader);
                    }
                })

                stack.forEach(function(o) {
                    var
                        module = o.n,
                        deps = o.d,
                        factory = o.f,
                        base = location.href;
                    return makeRequire({ base: base })(deps, function() {
                        var loader = Cache.get(module);
                        return !loader.loaded && loader.set(factory);
                    }, 0, true);
                });

                stack.length = 0;
            }
        }
    })()

    /**
     * makeRequire
     * @param {Object} opts
     * @returns require
     */
    function makeRequire(opts) {
       var base = opts.base;
        function _r(deps, succ, fail, sync) {
            var fired, self = this, _deps = deps.slice(0);
            if (succ) {
                function _checkDeps() {
                    var res = [];
                    console.log(deps);
                    deps.forEach(function (dep, i) {
                        var
                            path = _normalize(base, dep),
                            loader = Cache.get(path);
                        if (!loader) {
                            loader = new Loader(path);
                            Cache.set(path, loader);
                        }
                        if (loader.loaded) {
                            return;
                        }

                        res.push(dep);
                        loader.succ(_checkDeps);
                        fail && loader.fail(fail);
                    });
                    deps = res;
                    // make sure success callback will not trigger multiple times
                    if (!deps.length && !fired) {
                        fired = true;
                        // This is a way to prevent emit too quick for multi module in one file
                        sync ?
                            succ() :
                            setTimeout(function () {
                                succ.apply(self, _makeModules(_deps, _r));
                            }, 0);
                    }
                }
                _checkDeps();
            }
        }
        return _r;
    }

    /**
     * 
     * @param {*} name 
     * @param {*} deps 
     * @param {*} factory 
     */
    function define(module, deps, factory) {

        if (!factory) {
            if (_isFunction(deps)) {
                // 处理这种情况 define('./test', function() {});
                factory = deps;
            } else {
                // 处理这种情况
                // define('./test', 'guotingjie');
                var tmp = deps;
                factory = function(require, exports, module) {
                    return module.exports = tmp;
                }
            }

            deps = [];
        }

        _module.push({
            n: module,
            d: deps,
            f: factory
        });
    }

    function config(opt) {
        _path = opt.path || _path;
    }

    var require = root.require = function() {
        if (_require) return _require.apply(root, arguments);

        _module.make(_base || location.href);
        if (_base) {
            _require = makeRequire({ base: _base });
            _localBase = location.href;
        } else {
            _require = makeRequire({ base: location.href });
        }

        return _require.apply(root, arguments);
    }

    require.config = config
    root.define = define
}(window)
