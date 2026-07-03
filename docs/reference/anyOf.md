# anyOf

This asserts that a given value is an array, and that all of its values match one of a set of possible values, e.g:

```javascript
import {assert, anyOf} from '@muze-nl/assert'

assert(supportedAlgorithms, anyOf('RS256','RS384','RS512'))
```
