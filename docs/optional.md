# assert.Optional

```
assert.Optional(...assertions): Function
```

This function is meant to be used as part of an assertion in [`assert.fails()`](./fails.md), e.g:

```javascript
let errors = assert.fails(url.searchParams, {
    state: assert.Optional(/.+/)
})
```

Here it will only fail if the search parameter state is set, but doesn't match the given regular expression. 

`assert.Optional()` returns a function that is used by [`assert.fails`](.fails.md). It will return `false` if there are no problems.