# Required

This asserts that a given parameter is available and non-null. You can give it any additional assertion as parameter.

```javascript
import {assert, Required} from '@muze-nl/assert'

function example(url) {
    assert(url, {
        searchParams: {
            state: Required(/.+/)
        }
    })
}
```

Here it will fail if the search parameter state is not set, or doesn't match the given regular expression (which matches any non-empty string).

`Required()` returns a function that is used by [`assert`](./assert.md) and [`fails`](./fails.md). It will return `false` if there are no problems, or an [`error`](./error.md) with a description otherwise.

You can pass any assertion to Required that would be valid for `assert` and `fails`, e.g:

```javascript
    assert(url, Required({
        searchParams: {
            state: /.+/
        }
    }))
```
