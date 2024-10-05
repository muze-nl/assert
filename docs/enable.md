# enable

```javascript
import {assert, validURL, enable} from '@muze-nl/assert'

function example(url) {
    assert(url, validURL)
    return fetch(url)
}

enable()
let response = example('https://github.com/')
```

Will enable assertion testing by [`assert()`](./assert.md). You can disable assertion at any point by calling [`disable()`](./disable.md). 

When assertion testing is disabled, `assert()` immediately returns, without doing any work. However, keep in mind that the parameters to `assert()` are still evaluated by javascript. So don't add asserts to performance sensitive functions, e.g. functions that get called a lot inside loops.
