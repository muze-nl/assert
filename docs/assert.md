# assert

```javascript
import {assert, validURL} from '@muze-nl/assert'

function example(url) {
    assert(url, validURL)
    return fetch(url)
}
```

This will call [`fails()`](./fails.md). If any assertion fails, it will throw an error with all failed assertions. If assert is disabled--the default state--no assertions will be checked. See [`fails()`](./fails.md) for a list of possible assertions.
