/**
 * @author guotingjie@maxthon.net
 */

(function() {
    var noop = function() {}

    var loader = S.Loader = {
        baseUrl: '',
        importModule: noop,
        importingModule: null,
        main: null
    }

    loader.Module = function(id, uri) {
        this.id = id;
        this.uri = uri || getURI(id);

        this.require = noop;
        this.exports = {};
    }

    function getURI(id) {
        return loader.baseUrl + id + '.js';
    }

    S.define = function(factory) {
        var module = loader.importingModule;
        module.factory = factory;
        factory.call(module, module.require, module.exports, module);
    };
})()
