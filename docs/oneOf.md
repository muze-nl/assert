# oneOf

```javascript
import {assert, oneOf} from '@muze-nl/assert'

assert(url.searchParams, {
  grant_type: oneOf('refresh_token','authorization_code')
})
```

Here it will fail if the search parameter `grant_type` is anything other than either `'refresh_token'` or `'authorization_code'`.

You can use any other valid assertion inside `oneOf`.