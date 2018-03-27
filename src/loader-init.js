/**
 * Init Module Loader.
 * @author guotingjie@maxthon.net
 */
(function() {
    var main = Loader.main;

    if (main) {
        loader.importingModule = main;
        loader.importModule(main.uri);
    }
})(S.ModuleLoader)
