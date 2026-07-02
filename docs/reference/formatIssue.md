# formatIssue

```javascript
import { issues, formatIssue } from '@muze-nl/assert'

const problems = issues({ foo: 1 }, { foo: String })

if (problems) {
	console.error(formatIssue(problems[0]))
}
```

Formats one structured issue as a concise, single-line message:

```text
foo: data is not a string
```

The formatter adds the path once at the start of the line. The issue message itself does not repeat the path.

Equality and common matcher failures are formatted directly:

```text
foo: expected 'bar', found 'foo'
role: expected one of 'admin', 'editor', found 'guest'
code: expected /^x/, found 'abc'
```

For console output with multiple issues, prefer [`formatIssues()`](./formatIssues.md). It indents each issue by default:

```text
  - foo: expected 'bar', found 'foo'
  - role: expected one of 'admin', 'editor', found 'guest'
```

Long values are clipped in formatted output so console messages remain readable. The structured `actual` value on the issue remains unchanged.
