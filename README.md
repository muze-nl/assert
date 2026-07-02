[![GitHub License](https://img.shields.io/github/license/muze-nl/assert)](https://github.com/muze-nl/assert/blob/main/LICENSE)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/muze-nl/assert)]()
[![NPM Version](https://img.shields.io/npm/v/@muze-nl/assert)](https://www.npmjs.com/package/@muze-nl/assert)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@muze-nl/assert)](https://www.npmjs.com/package/@muze-nl/assert)
[![Project stage: Development][project-stage-badge: Development]][project-stage-page]

# Assert: optional assertion checking

```javascript
import { assert, enable, Optional, Required, oneOf, validURL } from '@muze-nl/assert/core'

enable()

function registerClient(metadata) {
	assert(metadata, {
		redirect_uris: Required([validURL]),
		application_type: Optional(oneOf('web', 'native')),
		client_name: Optional(String)
	})

	// continue with metadata known to match the expected shape
}
```

## Table of Contents

1. [Introduction](#introduction)
2. [Usage](#usage)
3. [Documentation](#documentation)
4. [License](#license)

## Introduction

Assert is a lightweight library for optional runtime checks. It is meant for code that benefits from explicit developer feedback during development, but should not spend time validating assumptions in production unless you ask it to.

Assertions are disabled by default. `assert()` returns immediately until you call `enable()`. When enabled, failed assertions throw an error with path-aware details. If you always want to validate and handle failures yourself, use `fails()` or `issues()` directly.

This style is useful for design-by-contract checks, protocol implementations, middleware preconditions, mock servers, and other places where executable requirements make code easier to understand.

## Usage

Install with npm:

```shell
npm install @muze-nl/assert
```

Use the side-effect-free entry point when you want tree-shaking:

```javascript
import { assert, enable, Required, validURL } from '@muze-nl/assert/core'
```

The package root exports the same API and also assigns it to `globalThis.assert` for compatibility:

```javascript
import * as assert from '@muze-nl/assert'
```

In the browser, using a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@muze-nl/assert/dist/assert.min.js" crossorigin="anonymous"></script>
```

This loads the API as `window.assert`.

## Documentation

- [Documentation index](docs/)
- [Reference](docs/reference/)
- [Creating custom assertion checks](docs/reference/#creating-custom-assertion-checks)
- [fails()](docs/reference/fails.md), [issues()](docs/reference/issues.md), and [formatIssues()](docs/reference/formatIssues.md)

## License

This software is licensed under the MIT open source license. See the [License](./LICENSE) file.

[project-stage-badge: Development]: https://img.shields.io/badge/Project%20Stage-Development-yellowgreen.svg
[project-stage-page]: https://blog.pother.ca/project-stages/
