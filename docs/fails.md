# fails

```javascript
import { fails, Required, oneOf } from '@muze-nl/assert'

const problems = fails(data, {
    state: Required(oneOf('foo','bar'))
})
if (problems) {
    console.error(problems)
}
```

This checks if data matches all of the assertions. If any assertion fails, this will return an array of failed assertions.

If data is an object, assertions must also be an object. For any property of data, you can add the same property to an assertion object. That assertion can be:

- a string, number or boolean: the property in the data must be the same (== comparison)
- a regular expression: the property in the data must match this expression
- a function: the function is called with 3 parameters (data, root, path) and must return false (for success) or an array of problems. Data is the data being asserted on, root is root object being asserted, path is the json pointer from the root to the current data.
- an object: each of the properties of this object must match with the child properties of the data
- an array: the property must be an array, if you pass an array with a value, each element of the array is asserted against that value
- Number, Boolean or String: the property must be a number, a boolean or a non-empty string, respectively

Here is an example:

```javascript
function myValidatorFunction(data, root) {
  if (root.error) {
    return root.error
  }
  return false // no problems
}

let errors = fails(response, {
  status: 200,
  headers: {
    'Content-Type':'application/json',
    'Etag': Optional(/([a-z0-9_\-])+/i)
  },
  body: myValidatorFunction
})
```

If you create your own assertion function, and want to call `fails` internally, make sure that you pass along all four parameters, like this:

```javascript
function not(pattern) {
  return function _not(data, root, path) {
    if (!fails(data, pattern, root, path)( {
      return error('data matches pattern, when required not to', data, pattern, path)
    }))
  }
}
```

Both `root` and `path` are used in the error reporting to help developers see which assertion failed on which property.