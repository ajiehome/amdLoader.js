module.declare(['cyclic/b'], function(require, exports) {

    var b = require('cyclic/b');
    exports.a = function() {
        return b;
    };

    console.log('a.js')
});
