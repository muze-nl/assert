# not

This function inverts any assertions passed to it. It will succeed if all given assertions fail, e.g:

```javascript
import {assert, not, oneOf} from '@muze-nl/assert'

assert(foo, not(oneOf('bar','baz')))
```

Which will fail if `foo` is either `'bar'` or `'baz'`. You can pass any valid assertion as a parameter to `not`.