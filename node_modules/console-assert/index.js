var originalConAssert = console.assert;

exports.browserify = function() {
    console.assert = function(expr) {
        if(expr) return;
        var args = Array.prototype.slice.call(arguments, 1);
        console.error.apply(console, ['Assertion failed:'].concat(args));
    };
};

exports.restore = function() {
    console.assert = originalConAssert;
};
