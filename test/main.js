// initialize module loader
var hrefs = location.href.split('/');
var path = hrefs.slice(0, hrefs.length - 2).join('/');

module.reset(path + '/src/modules');

// add 'test' module
module.declare('test', [], function(require, exports) {

  exports.hello = function(name) {
    console.log('hello,' + name)
  }
});

// S.provide(['math/program'], function(require) {
//   //try {
//     require('math/program');
//   //} catch (x) {
//   //  sendMessage('printResults', 'ERROR ' + x.message, 'error');
//   //}
// });

module.provide(['cyclic/main'], function(require) {
  //try {
    require('cyclic/main');
  //} catch (x) {
  //  sendMessage('printResults', 'ERROR ' + x.message, 'error');
  //}
});
