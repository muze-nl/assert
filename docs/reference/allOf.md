# allOf

This asserts that a value matches every assertion passed to it. It is useful when you want to compose multiple checks into a single pattern, for example inside [`Optional()`](./Optional.md):

```javascript
import { assert, allOf, not, oneOf, Required } from '@muze-nl/assert'

assert(data, {
	grant_type: Required(allOf(
		oneOf('authorization_code', 'refresh_token'),
		not('implicit')
	))
})
```

`allOf()` returns `false` when every assertion succeeds. If one or more assertions fail, their problems are collected into a single error result.
