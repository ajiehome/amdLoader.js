/**
 * Init Module Loader.
 * @author guotingjie@maxthon.net
 */
(function(loader) {
    var main = loader.main;

    if (main) {
        loader.importingModule = main;
        loader.importModule(main.uri);
    }
})(S.Loader)
