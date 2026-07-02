# validEmail

This asserts that a given string is a plausible email address. It doesn't test whether the email address actually exists, it also allows a number of invalid email addresses, because it is almost impossible to accurately fail all possible invalid email addresses without also failing some valid email addresses. Do not rely on this test only.

```javascript
import {assert, validEmail, Required } from '@muze-nl/assert'

assert(data, {
	email: Required(validEmail)
})
```

