# Recommended

This assertion works identical to [`Optional()`](./Optional.md), with the addition that if the optional value is not set, it will write a console.warning that mentions that the value is recommended.

```javascript
import {assert, Recommended} from '@muze-nl/assert'

function example(url) {
    assert(url, {
        searchParams: {
            state: Recommended(/.+/)
        }
    })
}
```

Here it will fail if the search parameter state is set, but doesn't match the given regular expression (which matches any non-empty string), just like Optional. However if the state isn't set, it will write a warning to the console that this value is recommended.
