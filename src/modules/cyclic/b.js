S.declare(['cyclic/a'], function(require, exports) {

    var a = require('cyclic/a');
    exports.b = function() {
        return a;
    };

console.log('b.js')
});
