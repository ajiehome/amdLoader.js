// initialize module loader
var hrefs = location.href.split('/');
var path = hrefs.slice(0, hrefs.length - 2).join('/');

S.reset(path + '/src/modules');

// add 'test' module
S.declare('test', [], function (require, exports) {

  exports.print = function (txt, style) {
    sendMessage('printResults', txt, style);
  };

  exports.assert = function (guard, message) {
    if (typeof message === 'undefined') message = '';
    if (guard) {
      exports.print('PASS ' + message, 'pass');
    } else {
      exports.print('FAIL ' + message, 'fail');
    }
  };
});

S.provide(['program', 'math', 'increment'], function (require) {
  //try {
  require('program');
  //} catch (x) {
  //  sendMessage('printResults', 'ERROR ' + x.message, 'error');
  //}
  sendMessage('testNext');
});

function sendMessage(msg, a1, a2) {
  var p = window.parent;
  if (p && p[msg]) p[msg](a1, a2);
}