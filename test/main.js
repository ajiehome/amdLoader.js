// initialize module loader
var hrefs = location.href.split('/');
var path = hrefs.slice(0, hrefs.length - 2).join('/');

S.reset(path + '/src/modules');

// add 'test' module
S.declare('test', [], function(require, exports) {

  exports.hello = function(name) {
    console.log('hello,' + name)
  }
});

S.provide(['math/program'], function(require) {
  //try {
    console.log(111)
    require('math/program');
  //} catch (x) {
  //  sendMessage('printResults', 'ERROR ' + x.message, 'error');
  //}
});
