/**
 * @author guotingjie@maxthon.net
 */

var S = S || {}

S.version = '0.0.1';

S.global = this; // this is window

//==============================================================================
// Debug Helpers
//==============================================================================


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define S.DEBUG=false to the JSCompiler.
 */
S.DEBUG = true;


/**
 * Prints debug info. NOTICE: 'S.log(...)' lines will be automatically stripped
 * from *-min.js files when building.
 * @param {string} msg The message to log.
 * @param {string} cat The log category for the message such as "info", "warn",
 * "error", "time" etc. Default is "log".
 */
S.log = function (msg, cat) {
    if (S.DEBUG) {
        var console = S.global['console'];
        if (console && console['log']) {
            console[cat && console[cat] ? cat : 'log'](msg);
        }
    }
};


/**
 * Throws error message.
 * @param {string} msg The exception message.
 */
S.error = function (msg) {
    if (S.DEBUG) {
        throw msg;
    }
};

S.type = (function () {
    var cls = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date',
        'RegExp', 'Object'
    ],
        cls2type = {};

    for (var i = 0; i < cls.length; i++) {
        var name = cls[i];
        cls2type['[object ' + name + ']'] = name.toLowerCase();
    }

    return function (o) {
        return o == null ?
            String(o) :
            cls2type[Object.prototype.toString.call(o)] || 'object';
    }
})();

/**
 * Checks to if an object is string.
 * @param {*} o
 */
S.isString = function (o) {
    return S.type(o) === 'string';
};


/**
 * Checks to if an object is function.
 * @param {*} o
 */
S.isFunction = function (o) {
    return S.type(o) === 'function';
};


/**
 * Checks to if an object is array.
 * @param {*} o
 */
S.isArray = Array.isArray ? Array.isArray : function (o) {
    return S.type(o) === 'array';
};