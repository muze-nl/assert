/*
TODO: add assertExplain global flag, so that if assert() fails, you can call explain() with
  the same pattern and it will return text explanation of why it failed, each assertion function must 
  then check assertExplain, and return a text explanation of what fails or succeeds
  top level can then filter to show only the failures
  (so that not(x) can show the succeeds message of x)
*/

/**
 * assertEnabled (Boolean) used to toggle whether the assert()
 * method should test assertions or not.
 */
globalThis.assertEnabled = false

/**
 * Enables assertion testing with assert()
 */
export function enable() {
	globalThis.assertEnabled = true
}

/**
 * Disables assertion testing with assert()
 */
export function disable() {
	globalThis.assertEnabled = false
}

/**
 * This function will check the source for the assertions in test, if
 * assertion checking is enabled globally.
 * If it is, and any assertion fails, it will throw an assertError
 * with a list of problems and other details.
 */
export function assert(source, test) {
	if (globalThis.assertEnabled) {
		let problems = fails(source,test)
		if (problems) {
			throw new Error('Assertions failed', {
				cause: { problems, source } 
			})
		}
	}
}

/**
 * Tests a given value against a pattern, only if the value is not null or undefined
 */
export function Optional(pattern) {
	return function _Optional(data, root, path) {
		if (typeof data != 'undefined' && data!=null && typeof pattern != 'undefined' ) {
			return fails(data, pattern, root, path)
		}
	}
}

/**
 * Tests a given value against a pattern, always.
 */
export function Required(pattern) {
	return function _Required(data, root, path) {
		if (data==null || typeof data == 'undefined') {
			return error('data is required', data, pattern || 'any value', path)
		} else if (typeof pattern != 'undefined') {
			return fails(data, pattern, root, path)
		} else {
			return false
		}
	}
}

/**
 * Tests a given value against a pattern, only if the value is not null or undefined
 * If null or undefined, it does print a warning to the console.
 */
export function Recommended(pattern) {
	return function _Recommended(data, root, path) {
		if (data==null || typeof data == 'undefined') {
			console.warn('data does not contain recommended value', data, pattern, path)
			return false
		} else {
			return fails(data, pattern, root, path)
		}
	}
}

/**
 * Tests a given value against a set of patterns, untill one succeeds
 * Returns an error if none succeed
 */
export function oneOf(...patterns) { 
	return function _oneOf(data, root, path) {
		for(let pattern of patterns) {
			if (!fails(data, pattern, root, path)) {
				return false
			}
		}
		return error('data does not match oneOf patterns', data, patterns, path)
	}
}

/**
 * Tests a given array of values against a set of patterns
 * If any value does not match one of the patterns, it will return an error
 * If not given an array to test, it will return an error
 */
export function anyOf(...patterns) {
	return function _anyOf(data, root, path) {
		if (!Array.isArray(data)) {
			return error('data is not an array',data,'anyOf',path)
		}
		for (let value of data) {
			if (oneOf(...patterns)(value)) {
				return error('data does not match anyOf patterns',value,patterns,path)
			}
		}
		return false
	}
}

export function allOf(...patterns) {
	return function _allOf(data, root, path) {
		let problems = []
		for (let pattern of patterns) {
			problems = problems.concat(fails(data, pattern, root, path))
		}
		problems = problems.filter(Boolean)
		if (problems.length) {
			return error('data does not match all given patterns', data, patterns, path, problems)
		}
	}
}

/**
 * Tests a given value to see if it is a valid (and absolute) URL, by
 * parsing it with the URL() constructor, and then testing the href
 * value to be equal to the initial value.
 */
export function validURL(data, root, path) {
	try {
		if (data instanceof URL) {
			data = data.href
		}
		let url = new URL(data)
		if (url.href!=data) {
			if (!(url.href+'/'==data || url.href==data+'/')) {
				// new URL() always adds a / as path
				return error('data is not a valid url',data,'validURL',path)
			}
		}
	} catch(e) {
		return error('data is not a valid url',data,'validURL',path)
	}
}

/**
 * Tests a given value to see if it looks like a valid email address, by
 * testing it against a regular expression. So there are no guarantees that
 * it is an actual working email address, just that it looks like one.
 */
export function validEmail(data, root, path) {
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
		return error('data is not a valid email',data,'validEmail',path)
	}
}

/**
 * Tests a given value to see if it is an object which is an instance of the given
 * constructor
 */
export function instanceOf(constructor) {
	return function _instanceOf(data, root, path) {
		if (!(data instanceof constructor)) {
			return error('data is not an instanceof pattern',data,constructor,path)
		}
	}
}

/**
 * Runs the given test pattern on a value, if the test succeeds, it fails
 * the not() test.
 */
export function not(pattern) {
	return function _not(data, root, path) {
		if (!fails(data, pattern, root, path)) {
			return error('data matches pattern, when required not to', data, pattern, path)
		}
	}
}

/**
 * returns an array of problems if the data fails to satisfy 
 * the assertions in the given pattern, false otherwise
 * @param {any} data    The data to match
 * @param {any} pattern The pattern to match
 * @param {any} root    Root object for assertions, set to data by default
 * @return {Array|false} Array with problems if the pattern fails, false otherwise
 */
export function fails(data, pattern, root, path='') {
	if (!root) {
		root = data
	}
	let problems = []
	if (pattern === Boolean) {
		if (typeof data != 'boolean' && !(data instanceof Boolean)) {
			problems.push(error('data is not a boolean', data, pattern, path))
		}		
	} else if (pattern === Number) {
		if (typeof data != 'number' && !(data instanceof Number)) {
			problems.push(error('data is not a number', data, pattern, path))
		}
	} else if (pattern === String) {
		if (typeof data != 'string' && !(data instanceof String)) {
			problems.push(error('data is not a string', data, pattern, path))
		}
		if (data == "") {
			problems.push(error('data is an empty string, which is not allowed', data, pattern, path))
		}
	} else if (pattern instanceof RegExp) {
    	if (Array.isArray(data)) {
			let index = data.findIndex((element,index) => fails(element,pattern,root,path+'['+index+']'))
            if (index>-1) {
            	problems.push(error('data['+index+'] does not match pattern', data[index], pattern, path+'['+index+']'))
            }
        } else if (typeof data == 'undefined') {
        	problems.push(error('data is undefined, should match pattern', data, pattern, path))
    	} else if (!pattern.test(data)) {
        	problems.push(error('data does not match pattern', data, pattern, path))
        }
    } else if (pattern instanceof Function) {
        let problem = pattern(data, root, path)
        if (problem) {
        	if (Array.isArray(problem)) {
        		problems = problems.concat(problem)
        	} else {
	        	problems.push(problem)
	        }
        }
    } else if (Array.isArray(pattern)) {
		if (!Array.isArray(data)) {
			problems.push(error('data is not an array',data,[],path))
		}
		for (let p of pattern) {
			for (let index of data.keys()) {
				let problem = fails(data[index], p, root, path+'['+index+']')
				if (Array.isArray(problem)) {
					problems = problems.concat(problem)
				} else if (problem) {
					problems.push(problem)
				}
			}
    	}
    } else if (pattern && typeof pattern == 'object') {
        if (Array.isArray(data)) {
            let index = data.findIndex((element,index) => fails(element,pattern,root,path+'['+index+']'))
            if (index>-1) {
            	problems.push(error('data['+index+'] does not match pattern', data[index], pattern, path+'['+index+']'))
            }
        } else if (!data || typeof data != 'object') {
        	problems.push(error('data is not an object, pattern is', data, pattern, path))
        } else {
        	if (data instanceof URLSearchParams) {
        		data = Object.fromEntries(data)
        	}
        	if (pattern instanceof Function) {
        		let result = fails(data, pattern, root, path)
	            if (result) {
	            	problems = problems.concat(result)
	            }
        	} else {
		        for (const [wKey, wVal] of Object.entries(pattern)) {
		            let result = fails(data[wKey], wVal, root, path+'.'+wKey)
		            if (result) {
		            	problems = problems.concat(result)
		            }
		        }
		    }
	    }
    } else {
    	if (pattern!=data) {
    		problems.push(error('data and pattern are not equal', data, pattern, path))
    	}
    }
    if (problems.length) {
    	return problems
    }
    return false
}

/**
 * Returns an object with message, found and expected properties
 */ 
export function error(message, found, expected, path, problems) {
	let result = {
		message,
		found,
		expected,
		path
	}
	if (problems) {
		result.problems = problems
	}
	return result
}
