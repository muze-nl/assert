# assert

```javascript
import {assert, validURL} from '@muze-nl/assert'

function example(url) {
    assert(url, validURL)
    return fetch(url)
}
```

This will call [`fails()`](./fails.md). If any assertion fails, it will throw an error with all failed assertions. The thrown error contains the original `problems` and normalized structured `issues` on `error.cause`. It also logs concise one-line messages to the console, for example:

```text
  - foo: data is not a string
  - bar: expected 'baz', found 'bax'
```

If assert is disabled--the default state--no assertions will be checked. See [`check()`](./check.md) for the always-on throwing variant, [`fails()`](./fails.md) for a list of possible assertions, and [`issues()`](./issues.md) for path-aware issue objects.
