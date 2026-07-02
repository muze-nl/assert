# not

This function inverts an assertion. It will succeed if the given assertion fails, e.g:

```javascript
import {assert, not, oneOf} from '@muze-nl/assert'

assert(foo, not(oneOf('bar','baz')))
```

Which will fail if `foo` is either `'bar'` or `'baz'`. You can pass any valid assertion as the parameter to `not`.
