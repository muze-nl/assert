# Optional

```
Optional(...assertions): Function
```

This function is meant to be used as part of an assertion in [`assert.fails()`](./fails.md), e.g:

```javascript
import {assert, Optional} from '@muze-nl/assert'

function example(url) {
    assert(url, {
        searchParams: {
            state: Optional(/.+/)
        }
    })
}
```

Here it will only fail if the search parameter state is set, but doesn't match the given regular expression (which matches any non-empty string). 

`Optional()` returns a function that is used by [`assert`](./assert.md) and [`fails`](./fails.md). It will return `false` if there are no problems, or an [`error`](./error.md) with a description otherwise.

You can pass any assertion to Optional that would be valid for `assert` and `fails`, e.g:

```javascript
    assert(url, Optional({
        searchParams: {
            state: /.+/
        }
    }))
```

This will only test if a url has non-empty state search parameter, if a url is actually passed. Or you can do this:

```javascript
    assert(url, {
        searchParams: Optional({
            state: /.+/
        })
    })
```

Which will test the searchParams state parameter, only when there is a searchParams property.
