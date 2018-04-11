module.declare(['math/math'], function (require, exports, module) {

    var add = require('math/math').add;

    exports.increment = function (val) {
        return add(val, 1);
    }

});