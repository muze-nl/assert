# Assert

The assert library allows you to add assertion asserts in your code, e.g. middleware components.
Assertion checking can be turned on and off globally, so you can enable it in a development setting, but disable it in production.

If you use the [`assert.assert()`](./assert.md) method in your middleware, users can turn assertion asserting on or off. If you use the [`assert.fails`](./fails.md) method directly, these assertions will always be asserted. They can't be turned off.

## Methods
- [`assert.assert`](./assert.md)
- [`assert.disable`](./disable.md)
- [`assert.enable`](./enable.md)
- [`assert.fails`](./fails.md)
- [`assert.oneOf`](./oneOf.md)
- [`assert.Optional`](./Optional.md)
