# Assert Reference

The assert library allows you to add runtime assertion checks in your code, e.g. middleware components.
Assertion checking can be turned on and off for the imported module, so you can enable it in a development setting, but disable it in production.

If you use the [`assert.assert()`](./assert.md) method in your middleware, users can turn assertion checking on or off. If you use the [`assert.fails`](./fails.md) method directly, these assertions will always be checked. They can't be turned off.

Most examples import from `@muze-nl/assert`, which also assigns the API to `globalThis.assert` for compatibility. Use `@muze-nl/assert/core` if you want the same API from a tree-shakeable entry point with no global side effects.

## Patterns

Assert patterns are ordinary JavaScript values:

- literal strings, numbers, and booleans use loose equality
- regular expressions match strings, or every item when the data is an array
- object literals describe object shapes
- array literals require an array and apply their child pattern to every item
- functions are custom validators
- `String`, `Number`, `Boolean`, `Array`, and `Object` are built-in type patterns

`String` requires a non-empty string. `Array` requires `Array.isArray(value)`. `Object` requires a non-null object that is not an array. Use [`instanceOf`](./instanceOf.md) when you need JavaScript constructor identity.

## API
- [`allOf`](./allOf.md)
- [`anyOf`](./anyOf.md)
- [`assert`](./assert.md)
- [`check`](./check.md)
- [`disable`](./disable.md)
- [`enable`](./enable.md)
- [`error`](./error.md)
- [`fails`](./fails.md)
- [`formatIssue`](./formatIssue.md)
- [`formatIssues`](./formatIssues.md)
- [`instanceOf`](./instanceOf.md)
- [`issues`](./issues.md)
- [`not`](./not.md)
- [`oneOf`](./oneOf.md)
- [`validEmail`](./validEmail.md)
- [`validURL`](./validURL.md)
- [`Optional`](./Optional.md)
- [`Recommended`](./Recommended.md)
- [`Required`](./Required.md)
 
## Creating custom assertion checks

You can create your own assert checks, just like the `validEmail` and `validURL` functions, or even the `Required` or `oneOf` functions. Here is an example `MustHave`, which asserts that an object contains one or more specific properties:

```javascript
function MustHave(...options) {
	return function _MustHave(data, root, path) {
		if (options.filter(o => data.hasOwnProperty(o)).length === options.length) {
			return false
		}
		return error('data must have all of:', data, options, path)
	}
}
```

And you can use this as follows:

```javascript
assert(data, {
	id_token_encrypted_response_enc: Optional(allOf(
		oneOf(...validJWA), 
		MustHave('id_token_encrypted_response_alg')
	))
})
```

Each assertion check must return a function, that returns `false` if the assertion /succeeds/. It should return an `error()` response otherwise.

Here is the definition of `oneOf`, which succeeds if at least one of the arguments holds true:

```javascript
function oneOf(...patterns) { 
	return function _oneOf(data, root, path) {
		for(let pattern of patterns) {
			if (!fails(data, pattern, root, path)) {
				return false
			}
		}
		return error('data does not match oneOf patterns', data, patterns, path)
	}
}
```

Note that both asserts do not use anonymous functions. While that would work, it complicates looking at the function call trace.

Also note that the implementation of `MustHave` can only have string property names as parameters. In contrast `oneOf` accepts any other assertion function, as it calls `fails` again, for each parameter.
