# instanceOf

This asserts that a given object is an instance of the test class, e.g.:

```javascript
import { assert, instanceOf } from '@muze-nl/assert'

assert(url, instanceOf(URL))
```

Which will throw an error if the given url is not an instance of URL. (If assertion testing is ['enabled'](./enable.md))