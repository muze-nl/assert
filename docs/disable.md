# disable

```javascript
import {assert, Optional} from '@muze-nl/assert'

function example(url) {
    assert(url, validURL)
    return fetch(url)
}
disable()
let response = example('https://github.com/')
```

Will stop validation by [`assert()`](./assert.md). This is the default state, only use it if you have previously called [`enable`](.enable.md).

Enabling or disabling assertion testing does not have any effect on [`fails()`](./fails.md), this function will always test assertions. It will not throw errors though, so you need to handle any problems detected yourself.