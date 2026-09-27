# Assert Tutorial

There are two kinds of checks you tend to find in JavaScript projects. One kind is there because the outside world is untrustworthy: a form post, an API response, a file someone uploaded at three in the morning. Those checks belong in production. The other kind is there because you, the developer, are trying to keep a promise to yourself while building something: this option should be a URL, this property should be present, this array should contain only strings. Assert is mostly for that second kind.

Assert lets you write small executable descriptions of the shapes and values your code expects, then decide when those descriptions should actually run. Most of the time `assert()` does nothing. When you call `enable()`, it wakes up and starts throwing useful errors. If you want checks that always run, you can use `fails()` or `issues()` directly.

We will start with the smallest useful example and then slowly turn the knobs.

## A First Assertion

Install the package:

```shell
npm install @muze-nl/assert
```

For modern bundlers, start with the side-effect-free entry point:

```javascript
import { assert, enable, Required, validURL } from '@muze-nl/assert/core'

enable()

function fetchProfile(url) {
	assert(url, Required(validURL))
	return fetch(url)
}
```

Read that assertion as: "when assertions are enabled, `url` must be present, and it must be a valid absolute URL." If `url` is missing or malformed, `assert()` throws. If assertions are disabled, `assert()` returns immediately and your function continues.

That little on/off switch is the point. You can put assertion checks near the code they describe, without turning every production call into a validation ceremony.

## Disabled Is The Default

If you remove `enable()` from the first example, `assert()` will not check anything:

```javascript
import { assert, Required, validURL } from '@muze-nl/assert/core'

function fetchProfile(url) {
	assert(url, Required(validURL))
	return fetch(url)
}
```

This is not a security boundary, and it is not a substitute for validating untrusted input. It is a developer aid. The code still evaluates the arguments you pass into `assert()`, but the assertion itself does no work until enabled.

You can turn checking off again:

```javascript
import { disable, enable } from '@muze-nl/assert/core'

enable()
// assertions run

disable()
// assert() returns immediately again
```

If you import from `@muze-nl/assert`, the same API is also assigned to `globalThis.assert` for compatibility. If you import from `@muze-nl/assert/core`, nothing is added to the global object, which is the entry point you want for tree-shaking.

## Patterns: The Small Language Inside Assert

Assert patterns are ordinary JavaScript values arranged to describe the data you expect. Some patterns are literals:

```javascript
assert(response, {
	status: 200,
	type: 'basic',
	ok: true
})
```

This checks with loose equality, so it is best used for simple literal expectations. The common constructors check types:

```javascript
assert(user, {
	id: String,
	age: Number,
	active: Boolean,
	roles: Array,
	profile: Object
})
```

`String` means a non-empty string. An empty string fails, which is often what you want when checking identifiers, names, and URL-like fields. `Array` means `Array.isArray(value)`. `Object` means a non-null object that is not an array. If you need JavaScript constructor identity instead, use `instanceOf(SomeClass)`.

Regular expressions work too:

```javascript
assert(user, {
	username: /^[a-z0-9_]+$/i
})
```

Object literals describe object shapes:

```javascript
assert(config, {
	server: {
		origin: validURL,
		timeout: Number
	}
})
```

Array literals describe every item in an array:

```javascript
assert(config, {
	redirect_uris: [validURL],
	contacts: [String]
})
```

This is intentionally compact. You can read a large assertion object much like a small spec.

## Required, Optional, And Recommended

Many useful checks are about presence. `Required()` says the value must exist and must not be `null`:

```javascript
import { Required, validURL } from '@muze-nl/assert/core'

assert(metadata, {
	redirect_uris: Required([validURL])
})
```

`Optional()` says the value may be absent, but if it is present, it must match:

```javascript
import { Optional, oneOf } from '@muze-nl/assert/core'

assert(metadata, {
	application_type: Optional(oneOf('web', 'native')),
	client_name: Optional(String)
})
```

`Recommended()` is the friendly nudge. It behaves like `Optional()`, but writes a warning if the value is missing:

```javascript
import { Recommended, validURL } from '@muze-nl/assert/core'

assert(metadata, {
	logo_uri: Recommended(validURL)
})
```

If you are implementing a specification, this maps nicely onto the difference between "MUST", "MAY", and "SHOULD". The code starts to look less like a pile of `if` statements and more like the thing you are implementing.

## Choices And Combinations

`oneOf()` accepts a list of possible patterns. The value only has to match one of them:

```javascript
import { oneOf } from '@muze-nl/assert/core'

assert(metadata, {
	application_type: oneOf('web', 'native')
})
```

`anyOf()` is similar, but for arrays. Every item in the data array must match at least one of the given patterns:

```javascript
import { anyOf } from '@muze-nl/assert/core'

assert(token, {
	scopes: anyOf('openid', 'profile', 'email')
})
```

`allOf()` says the value must satisfy every pattern:

```javascript
import { allOf, not, oneOf } from '@muze-nl/assert/core'

assert(request, {
	grant_type: allOf(
		oneOf('authorization_code', 'refresh_token'),
		not('implicit')
	)
})
```

`not()` inverts a single assertion. If the inner assertion succeeds, `not()` fails:

```javascript
import { not } from '@muze-nl/assert/core'

assert(options, {
	mode: not('deprecated')
})
```

These functions become most useful when nested inside `Optional()` or `Required()`, because each wrapper accepts one assertion pattern:

```javascript
assert(metadata, {
	token_endpoint_auth_method: Optional(oneOf('client_secret_basic', 'private_key_jwt')),
	sector_identifier_uri: Optional(allOf(validURL, not('http://localhost/')))
})
```

## When You Want The Problems Instead Of An Exception

`assert()` is for checks that should throw when enabled. Sometimes you want to run the check yourself and decide what to do. Use `fails()` for that:

```javascript
import { fails, Required, validURL } from '@muze-nl/assert/core'

let problems = fails(metadata, {
	redirect_uris: Required([validURL])
})

if (problems) {
	console.error(problems)
}
```

`fails()` always checks. It does not care whether `enable()` has been called. It returns `false` on success, or an array of problem objects on failure. These problem objects are the older compatibility shape, with fields such as `message`, `found`, `expected`, `path`, `pathString`, and `pathParts`.

For new code that wants stable, path-aware output, use `issues()`:

```javascript
import { formatIssues, issues, Required, validURL } from '@muze-nl/assert/core'

let problems = issues(metadata, {
	redirect_uris: Required([validURL])
})

if (problems) {
	console.error(formatIssues(problems).join('\n'))
}
```

The formatted output is deliberately plain:

```text
  - redirect_uris[1]: data is not a valid url
```

An issue keeps the path separately from the message, so tools can show failures however they like:

```javascript
{
	path: ['redirect_uris', 1],
	pathString: 'redirect_uris[1]',
	message: 'data is not a valid url',
	expected: 'validURL',
	actual: 'not a url'
}
```

That is useful in tests, logs, UI messages, and anywhere else you do not want to scrape human text to find out what happened.

## A Custom Assertion

The built-ins cover the common shapes, but the interesting work often lives in the rules specific to your project. A custom assertion is a function that receives `(data, root, path)` and returns `false` for success, or an `error()` result for failure.

Here is a small one:

```javascript
import { error } from '@muze-nl/assert/core'

function includes(...requiredValues) {
	return function _includes(data, root, path) {
		if (!Array.isArray(data)) {
			return error('data is not an array', data, requiredValues, path)
		}
		let missing = requiredValues.filter(value => !data.includes(value))
		if (missing.length) {
			return error('data must include required values', data, requiredValues, path)
		}
		return false
	}
}
```

And here it is in use:

```javascript
assert(clientMetadata, {
	scopes_supported: includes('openid')
})
```

The `path` parameter matters. Pass it into `error()` so the final report can point to the exact property that failed. If your custom assertion calls `fails()` internally, pass all four values along:

```javascript
import { error, fails } from '@muze-nl/assert/core'

function mustNotMatch(pattern) {
	return function _mustNotMatch(data, root, path) {
		if (!fails(data, pattern, root, path)) {
			return error('data matches pattern, when required not to', data, pattern, path)
		}
		return false
	}
}
```

That is almost all the machinery. Return `false` when the world is good. Return `error(...)` when it is not. Use `root` when a rule needs to compare one part of the object to another. Pass `path` along like a little breadcrumb trail.

## A Larger Example

Here is a more realistic shape, the sort of thing you might use around client metadata in an OAuth or OpenID Connect project:

```javascript
import {
	allOf,
	assert,
	enable,
	Optional,
	Required,
	oneOf,
	validEmail,
	validURL
} from '@muze-nl/assert/core'

enable()

const clientMetadataPattern = {
	redirect_uris: Required([validURL]),
	application_type: Optional(oneOf('web', 'native')),
	client_name: Optional(String),
	contacts: Optional([validEmail]),
	policy_uri: Optional(validURL),
	token_endpoint_auth_method: Optional(oneOf(
		'client_secret_basic',
		'client_secret_post',
		'private_key_jwt',
		'none'
	)),
	default_max_age: Optional(Number),
	require_auth_time: Optional(Boolean)
}

export function registerClient(metadata) {
	assert(metadata, clientMetadataPattern)
	return saveClient(metadata)
}
```

It is not magic, and that is the charm of it. The pattern is just a JavaScript object. The assertion functions are just functions. When assertions are disabled, `registerClient()` does not perform the check. When enabled, the first bad metadata object gives you a path and a reason instead of a half-hour tour through the debugger.

## Where To Go Next

The reference docs live in [reference](./reference/). Start with [`assert()`](./reference/assert.md), [`check()`](./reference/check.md), [`fails()`](./reference/fails.md), and [`issues()`](./reference/issues.md), then look at [`Optional()`](./reference/Optional.md), [`Required()`](./reference/Required.md), [`oneOf()`](./reference/oneOf.md), and [`allOf()`](./reference/allOf.md) when you want to compose larger checks.

The shortest version is this: use `assert()` for development-time contracts, `check()` for contracts that must always throw on failure, `fails()` when you want raw compatibility problems, and `issues()` plus `formatIssues()` when you want clean reporting. Then add custom assertions where your project has rules of its own.
