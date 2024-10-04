// global state switch to enable/disable assert
// uses globalThis so that even if npm installs multiple
// versions of this library, all use this same state
globalThis.assertEnabled = false

export function enable() {
	globalThis.assertEnabled = true
}

export function disable() {
	globalThis.assertEnabled = false
}

export function error(message, found, expected) {
	return {
		message,
		found,
		expected
	}
}

/**
 * returns new Boolean(true) if data does not match pattern
 * you can't return new Boolean(false), or at least that evaluates
 * to true, so if the data does match, it returns a primitive false
 * the Boolean(true) has an extra property called 'problems', which is
 * an array with a list of all fields that do not match, and why
 * @param  {any} data    The data to match
 * @param  {any} pattern The pattern to match
 * @return {Array|false} Array with problems if the pattern fails, false
 */
export function fails(data, pattern, container) {
	let problems = []
	if (pattern === Boolean) {
		if (typeof data != 'boolean') {
			problems.push(error('data is not a boolean', data, pattern))
		}		
	} else if (pattern === Number) {
		if (typeof data != 'number') {
			problems.push(error('data is not a number', data, pattern))
		}
	} else if (pattern instanceof RegExp) {
    	if (Array.isArray(data)) {
			let index = data.findIndex(element => fails(element,pattern))
            if (index>-1) {
            	problems.push(error('data['+index+'] does not match pattern', data[index], pattern))
            }
    	} else if (!pattern.test(data)) {
        	problems.push(error('data does not match pattern', data, pattern))
        }
    } else if (pattern instanceof Function) {
        if (pattern(data, container)) {
        	problems.push(error('data does not match function', data, pattern))
        }
    } else if (Array.isArray(pattern)) {
		if (!Array.isArray(data)) {
			problems.push(error('data is not an array',data,[]))
		}
		for (p of pattern) {
			let problem = fails(data, p)
			if (Array.isArray(problem)) {
				problems.concat(problem)
			} else if (problem) {
				problems.push(problem)
			}
    	}
    } else if (pattern && typeof pattern == 'object') {
        if (Array.isArray(data)) {
            let index = data.findIndex(element => fails(element,pattern))
            if (index>-1) {
            	problems.push(error('data['+index+'] does not match pattern', data[index], pattern))
            }
        } else if (!data || typeof data != 'object') {
        	problems.push(error('data is not an object, pattern is', data, pattern))
        } else {
        	if (data instanceof URLSearchParams) {
        		data = Object.fromEntries(data)
        	}
	        let p = problems[problems.length-1]
	        for (const [wKey, wVal] of Object.entries(pattern)) {
	            let result = fails(data[wKey], wVal, data)
	            if (result) {
	            	if (!p || typeof p == 'string') {
	            		p = {}
	            		problems.push(error(p, data[wKey], wVal))
	            	}
	            	p[wKey] = result.problems
	            }
	        }
	    }
    } else {
    	if (pattern!=data) {
    		problems.push(error('data and pattern are not equal', data, pattern))
    	}
    }
    if (problems.length) {
    	return problems
    }
    return false
}

export function assert(source, test) {
	if (!globalThis.assertEnabled) {
		return
	}
	let result = fails(source,test)
	if (result) {
		throw new assertError(result,source)
	}
}

export function Optional(pattern) {
	return function(data) {
		if (data==null || typeof data == 'undefined') {
			return false
		}
		return fails(data, pattern)
	}
}

export function Required(pattern) {
	return function(data) {
		return fails(data, pattern)
	}
}

export function Recommended(pattern) {
	if (data==null || typeof data == 'undefined') {
		console.warning('data does not contain recommended value', data, pattern)
		return false
	}
	return fails(data, pattern)
}

export function oneOf(...patterns) {
	return function(data) {
		for(let pattern of patterns) {
			if (!fails(data, pattern)) {
				return false
			}
		}
		return error('data does not match oneOf patterns',data,patterns)
	}
}

export function anyOf(...patterns) {
	return function(data) {
		if (!Array.isArray(data)) {
			return error('data is not an array',data,'anyOf')
		}
		for (let value of data) {
			if (oneOf(...patterns)(value)) {
				return error('data does not match anyOf patterns',value,patterns)
			}
		}
		return false
	}
}

export function validURL(data) {
	try {
		let url = new URL(data)
		if (url.href!=data) {
			return error('data is not a fully qualified url',data,'validURL')
		}
	} catch(e) {
		return error('data is not a valid url',data,'validURL')
	}
	return false
}

export function instanceOf(constructor) {
	return function(data) {
		if (!(data instanceof constructor)) {
			return error('data is not an instanceof pattern',data,constructor)
		}
		return false
	}
}

export function not(pattern) {
	return function(data) {
		let problem = fails(data, pattern)
		if (problem) {
			return false
		}
		return error('data matches pattern, when required not to', data, pattern)
	}
}

class assertError {
	constructor(problems, ...details) {
		this.problems = problems
		this.details = details
		console.trace()
	}
}
