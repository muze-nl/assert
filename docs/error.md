# error

This function is used to return problems found in a validator, e.g:

```javascript
function myValidator(pattern) {
	return function(data, root, path) {
		if (fails(data, pattern)) {
			return error('data fails myValidator', data, pattern, path)
		}
		return false
	}
}
```

These problems are collected, and when assertion testing is [enabled](./enable.md), added to the error thrown by [`assert()`](./assert.md). The returned problem object keeps the existing `path`, `message`, `found`, and `expected` properties, and also includes `pathString` and `pathParts` for structured reporting. New code that wants the normalized `actual` property should use [`issues()`](./issues.md).