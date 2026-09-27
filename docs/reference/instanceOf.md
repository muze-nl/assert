# instanceOf

This asserts that a given object is an instance of the test class, e.g.:

```javascript
import { assert, instanceOf } from '@muze-nl/assert'

assert(url, instanceOf(URL))
```

Which will throw an error if the given url is not an instance of URL, if assertion testing is [enabled](./enable.md).

Use this for JavaScript constructor identity. The built-in `Object` pattern has a narrower data-shape meaning: it accepts non-null objects, but not arrays.
