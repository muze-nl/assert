# issues

```javascript
import { issues, formatIssues, Required, validURL } from '@muze-nl/assert'

const problems = issues(data, {
	client_info: {
		redirect_uris: Required([validURL])
	}
})

if (problems) {
	console.error(formatIssues(problems).join('\n'))
}
```

This checks the data in the same way as [`fails()`](./fails.md), but returns normalized, path-aware issue objects instead of the original problem objects.

```javascript
[
	{
		path: ['client_info', 'redirect_uris', 0],
		pathString: 'client_info.redirect_uris[0]',
		message: 'data is not a valid url',
		expected: 'validURL',
		actual: 'not a url'
	}
]
```

`message` contains only the problem itself. The path is available separately as `path` and `pathString`, so tools can decide how to show it without repeating information.

For console output, use [`formatIssue()`](./formatIssue.md) or [`formatIssues()`](./formatIssues.md):

```text
  - client_info.redirect_uris[0]: data is not a valid url
```

Equality and common matcher failures are formatted more directly:

```text
  - response_type: expected 'code', found 'token'
  - role: expected one of 'admin', 'editor', found 'guest'
  - code: expected /^x/, found 'abc'
```

Formatted values are intentionally concise and may be clipped. The `actual` property keeps the original value for code that needs exact data.

`issues()` returns `false` when there are no problems, just like `fails()`.

Use `fails()` when you need the original problem objects for compatibility. Use `issues()` when you want stable structured output for logs, tests, UI messages, or tools built on top of Assert.
