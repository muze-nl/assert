# Assert

The assert library allows you to add assertion asserts in your code, e.g. middleware components.
Assertion checking can be turned on and off globally, so you can enable it in a development setting, but disable it in production.

If you use the [`assert.assert()`](./assert.md) method in your middleware, users can turn assertion asserting on or off. If you use the [`assert.fails`](./fails.md) method directly, these assertions will always be asserted. They can't be turned off.

## Methods
- [`anyOf`](./anyOf.md)
- [`assert`](./assert.md)
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
	id_token_encrypted_response_enc: Optional(
		oneOf(...validJWA), 
		MustHave('id_token_encrypted_response_alg')
	)
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