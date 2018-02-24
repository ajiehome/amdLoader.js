! function(root) {

    var tmd = {
        /**
         * 入口方法
         * @param ids  {Array}  入口模块路径数组
         * @param callback
         */
        use: function(ids, callback) {
            //并行加载入口模块
            Promise.all(
                ids.map(function(id) {
                    return tmd.loader(id);
                })
            ).then(function(list) {
                //所有依赖加载完毕后执行回调函数
                if (typeof callback === "function") {
                    callback.apply(window, list)
                }
            }).catch(function(err) {
                console.log(err);
            })
        },
        /**
         * 模块加载
         * @param id   模块路径
         * @returns {Promise}
         */
        loader: function(id, deps) {
            return new Promise(function(resolve, reject) {
                var mod = cacheMods[id] || (cacheMods[id] = new Module(id, deps));
                mod.on('complete', function() {
                    var exp = tmd.getExports(mod);
                    resolve(exp);
                });

                mod.on('error', reject);
            });
        },
        /**
         * 获取模块接口
         * @param mod {object} 模块对象
         * @returns {*}
         */
        getExports: function(mod) {
            if (!mod.exports) {
                mod.exports = mod.factory(require, mod);
            }

            return mod.exports;
        }
    }

    /**
     * 模块缓存对象
     * @type {Object}
     */
    var cacheMods = {};

    function Module(uri, deps) {
        this.uri = uri;
        this.status = 'pending';
        this.dependence = deps;
        this.callback = {};
        this.load();
    }

    Module.prototype = {
        load: function() {
            var uri = this.uri;
            var script = document.createElement('script');
            script.src = uri;
            document.head.appendChild(script);
            this.status = 'loading';
        },
        on: function(event, callback) {
            if (event === "complete" && this.status === "complete") {
                callback(this);
            } else if (event === "error" && this.status === "error") {
                callback(this);
            } else {
                this.callback[event] = callback;
            }
        },
        trigger: function(event) {
            if (event in this.callback) {
                var callback = this.callback[event];
                callback(this);
            } else {
                console.log("not found callback")
            }
        }
    }

    var define = function() {

    }

    var require = root.require = function(ids, callback) {
        // var mod =
    }

    root.define = define;
}(window)
