!function (root) {
  var _head = document.head,
    _baes,
    _path = {};

  var Loader = function (url, isLoaded) {
    if (!isLoaded) {
      this.load(url)
    }
    this.url = url
  }

  Loader.prototype = {
    constructor: Loader,
    /**
     * load
     * @param {String} url
     */
    load: function (url) {
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
        _module.make(_this.url)
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
    }
  }

  var Cache = (function () {
    var map = {}
    return {
      /**
       * get
       * @param {String} key
       * @returns value
       */
      get: function (key) {
        return map[key]
      },
      /**
       * put
       * @param {String} key
       * @param {Object} value
       * @returns success or failure
       */
      put: function (key, value) {
        if (key in map) return false;
        map[key] = value;
        return true;
      }
    }
  })()

  /**
   * 内部模块
   */
  var _module = (function () {
    var stack = []

    return {
      /**
       * push
       * @param {Object} o
       */
      push: function () {
        return stack.push.apply(stack, arguments);
      },
      /**
       * make
       * @param {String} src
       */
      make: function (baseUrl) {
        stack.forEach(function (o) {
          // 格式化路径
          var module = o.n = _normalize(baseUrl, o.n);

          var loader = Cache.get(module);
          if (!loader) {
            loader = new Loader(module, true);
            Cache.set(module, loader);
          }
        })

        stack.forEach(function (o) {
          var
            module = o.n,
            deps = o.d,
            factory = o.f,
            base = ~module.indexOf('/') ?
              module.replace(/[^\/]+$/, '') :
              _path[module].replace(/[^\/]+$/, '');
          return makeRequire({ base: base })(deps, function () {
            var loader = Cache.get(module);
            return !loader.loaded && loader.set(factory);
          }, 0, true);
        });

        stack.length = 0;
      }
    }
  })()

  /**
   * 
   * @param {*} name 
   * @param {*} deps 
   * @param {*} factory 
   */
  function define(name, deps, factory) {
    var args = arguments

    if (args.length < 3) {
      if (typeof deps === 'function') {
        factory = depts
      } else {
        var tmp = deps;
        factory = function (require, exports, module) {
          return module.exports = tmp;
        }
      }

      dept = []
    }

    _module.push({
      n: name,
      d: depts,
      f: factory
    })
  }

  function config(opt) {
    _path = opt.path || {}
  }

  var require = root.require = function () {

  }
  
  require.config = config
  root.define = define
}(window)