# assert.assert

```
assert.assert(data, ...assertions) : throws
```

This will call [`assert.fails()`](./fails.md). If any assertion fails, it will throw an error with all failed assertions. If assert is disabled--the default state--no assertions will be checked. See [`assert.fails`](./fails.md) for a list of possible assertions.

You may wonder why this is called `assert.assert`. This is because this function is usually the main entrypoint into the assert library. If you want to avoid all the extra `assert.` code, you can import the functions from the assert library like this:

```javascript
import { enable, disable, fails, assert, 
	oneOf, anyOf, not, Optional, Required, Recommended } from '@muze-nl/assert'
```

Now you can write assertions like this:

```javascript
function myFunction(param1, param2) {
	assert(param1, Required(oneOf('foo','bar'))
	assert(param2, not(oneOf('foo','bar')))
}
```

Which in the case of more complex assertions becomes much more readable.