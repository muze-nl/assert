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
- a function: the function is called with (property, data) and must return false (for success) or an array of problems.
- an object: each of the properties of this object must match with the child properties of the data
- an array: the property must be an array, if you pass an array with a value, each element of the array is asserted against that value
- Number or Boolean: the property must be a number or a boolean, respectively

Here is an example:

```javascript
function myValidatorFunction(property, data) {
  if (data.error) {
    return data.error
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

