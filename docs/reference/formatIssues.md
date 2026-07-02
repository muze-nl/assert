# formatIssues

```javascript
import { issues, formatIssues } from '@muze-nl/assert'

const problems = issues({ foo: 'foo', bar: 1 }, {
	foo: 'bar',
	bar: String
})

if (problems) {
	console.error(formatIssues(problems).join('\n'))
}
```

Formats structured issues as concise console lines. By default each line is indented and marked with a bullet, so multiple assertion failures remain visually distinct under the `Assertions failed:` header:

```text
  - foo: expected 'bar', found 'foo'
  - bar: data is not a string
```

Use the `indent` option to change or remove the prefix:

```javascript
formatIssues(problems, { indent: '' })
```

```text
foo: expected 'bar', found 'foo'
bar: data is not a string
```

The formatter keeps the message short for common cases such as equality checks, regular expressions, `oneOf()`, `not()`, missing values, and `instanceOf()`.

Formatted values are display values only. Long strings and large objects may be clipped; use `issues()` when code needs access to the original `actual` value.
