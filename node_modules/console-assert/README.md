# console-assert

Simple `console.assert` polyfill for node since existing realization throws instead of printing error.

See:
- Issue in nodejs repository: https://github.com/nodejs/node/issues/5340
- Draft specification: https://github.com/DeveloperToolsWG/console-object/blob/master/api.md#consoleassertexpression-object

## Why?

Because when you trying to write polymorphic code you can't use console.assert in node env.

## How to use?

Install module via npm:
```
npm i console-assert
```

Write this somewhere when you need it:
```js
require('console-assert').browserify();
```

> NB: Module patchs global console.assert and if you need to rollback behaviour
you have to just run `require('console-assert').restore();`.

## License

[The MIT License](http://qfox.mit-license.org/)
