S.declare(['cyclic/a', 'cyclic/b'], function(require) {
    
    var a = require('cyclic/a');
    var b = require('cyclic/b');

    console.log(a)
    console.log(b)
})
