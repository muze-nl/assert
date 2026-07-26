# check

```javascript
import { check, validURL } from '@muze-nl/assert'

function example(url) {
	check(url, validURL, 'url must be valid', TypeError)
	return fetch(url)
}
```

`check()` always validates. If any assertion fails, it throws an error with the original `problems` and normalized structured `issues` on `error.cause`.

Use `check()` for contracts that must always be enforced, such as public API arguments. Use [`assert()`](./assert.md) for development-time checks that only run when assertions are enabled.

The third argument is the error message prefix. The fourth argument is optional and defaults to `Error`.
