import { enable, disable, fails, issues, assert, error, warn,
	oneOf, anyOf, allOf, not, Optional, Required, Recommended,
	validURL, validEmail, instanceOf, check, formatIssue, formatIssues } from '../src/assert.mjs'
import tap from 'tap'

tap.test('start', t => {
	let source = 'Foo'
	let expect = 'Foo'
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('object', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: 'bar'
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('object2', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		baz: 'bax'
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.end()
})

tap.test('enable', t => {
	let result = assert('foo','bar')
	t.equal(result, undefined)
	enable()
	let oldConsoleError = console.error
	console.error = () => {}
	t.throws(() => {
		let result = assert('foo','bar')
	})
	console.error = oldConsoleError
	disable()
	t.end()
})

tap.test('check always throws with structured cause', t => {
	t.throws(() => check({ foo: 1 }, { foo: String }, 'metadata is invalid', TypeError), {
		name: 'TypeError',
		message: "metadata is invalid:\n  - foo: data is not a string"
	})

	try {
		check({ foo: 1 }, { foo: String }, 'metadata is invalid')
	} catch (error) {
		t.same(error.cause.issues[0].path, ['foo'])
		t.equal(error.cause.issues[0].message, 'data is not a string')
	}
	t.end()
})

tap.test('function', t => {
	let source = 'Foo'
	let expect = s => !(s=='Foo')
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('regex', t => {
	let source = 'Foo'
	let expect = /F.*/
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('optional', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: 'bar',
		bar: Optional('foo')
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('optional2', t => {
	let source = {
		foo: 'bar',
		bar: 'baz'
	}
	let expect = {
		foo: 'bar',
		bar: Optional('foo')
	}
	let result = fails(source, expect)
	t.ok(result)
	t.equal(result.length, 1)
	t.end()
})

tap.test('optional nested', t => {
	let source = {
		foo: {
			bar: 'baz'
		}
	}
	let expect = {
		foo: Optional({
			bar: 'baz'
		})
	}
	let result = fails(source, expect)
	t.equal(result, false)
	source.foo.bar = 'not baz'
	result = fails(source, expect)
	t.ok(result)
	t.equal(result.length, 1)
	t.end()
})

tap.test('Optional empty', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: Optional()
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('oneOf', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: oneOf('baz','bar')
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('oneOf2', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: oneOf('baz','bax')
	}
	let result = fails(source, expect)
	t.ok(result)
	t.equal(result.length, 1)
	t.end()	
})

tap.test('anyOf', t => {
	let source = {
		foo: ['bar','baz']
	}
	let expect = {
		foo: anyOf('bar','baz','bax')
	}
	let result = fails(source, expect)
	t.ok(!result)
	t.end()
})

tap.test('allOf', t => {
	let source = {
		foo: 'bar',
		baz: 'bax'
	}
	let expect = allOf({
		foo: 'bar'
	}, {
		baz: 'bax'
	})
	let result = fails(source, expect)
	t.ok(!result)
	t.end()
})

tap.test('allOf2', t => {
	let source = {
		foo: 'bar'
	}
	let expect = allOf({
		foo: 'bar'
	}, {
		baz: 'bax'
	})
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.end()
})

tap.test('not', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: not(oneOf('baz','bax'))
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()		
})

tap.test('validURL', t => {
	const validURLs = [
		'http://example.com/',
		'https://example.com/?foo=bar#baz',
        'ftp://ftp.is.co.za/rfc/rfc1808.txt',
        'http://www.ietf.org/rfc/rfc2396.txt',
        'ldap://[2001:db8::7]/c=GB?objectClass?one',
        'mailto:John.Doe@example.com',
        'news:comp.infosystems.www.servers.unix',
        'tel:+1-816-555-1212',
        'telnet://192.0.2.16:80/',
        'urn:oasis:names:specification:docbook:dtd:xml:4.1.2',
        'file:///C:/',
        'http://www.ariadne-cms.org/~user/page',
        'http://example.com/foo+bar',
        'http://example.com/foo%20bar'
	]
	const invalidURLs = [
         'http://127.0.0.1:11211:80/',
         'http://google.com#@evil.com/',
         'http://foo@evil.com:80@google.com/',
         'http://foo@127.0.0.1 @google.com/',
         'http://127.0.0.1:11211#@google.com:80/'
	]
	for (let url of validURLs) {
		let result = fails(url, validURL)
		t.equal(result, false)
		if (result) {
			console.log(result)
		}
	}
	for (let url of invalidURLs) {
		let result = fails(url, validURL)
		t.ok(result)
		t.equal(result.length, 1)
		if (!result) {
			console.log(url, 'should fail to assert')
		}
	}
	t.end()
})

tap.test('validURL accepts URL instances', t => {
	let result = fails(new URL('https://example.com/callback'), validURL)
	t.equal(result, false)
	t.end()
})

tap.test('validEmail', t => {
	const validEmails = [
		'something@something.com',
		'someone@localhost.localdomain',
		'a/b@domain.com',
		'{}@domain.com',
		"m*'!%@something.sa",
		"!#$%&'*+/=?^_`{|}~.-@com.com",
	]
	const invalidEmails = [
//		"invalid:email@example.com",
		"@somewhere.com",
		"example.com",
		"@@example.com",
		"a space@example.com",
//		"something@ex..ample.com",
//		"\"test\blah\"\"@example.com"
	]
	for (let email of validEmails) {
		let result = fails(email, validEmail)
		t.equal(result, false)
		if (result) {
			console.log(result)
		}		
	}
	for (let email of invalidEmails) {
		let result = fails(email, validEmail)
		t.ok(result)
		t.equal(result.length, 1)
		if (!result) {
			console.log(email, 'should fail to assert')
		}
	}
	t.end()
})

tap.test('Recommended warns but accepts missing values', t => {
	let oldConsoleWarn = console.warn
	let warnings = []
	console.warn = (...args) => warnings.push(args)
	try {
		let result = fails({}, {
			display_name: Recommended(String)
		})
		t.equal(result, false)
		t.equal(warnings.length, 1)
		t.equal(warnings[0][1], 'data does not contain recommended value')
		t.equal(fails({ display_name: 'Ada' }, {
			display_name: Recommended(String)
		}), false)
	} finally {
		console.warn = oldConsoleWarn
	}
	t.end()
})

tap.test('Required accepts any present value when no pattern is given', t => {
	let result = fails({
		metadata: {}
	}, {
		metadata: Required()
	})
	t.equal(result, false)
	t.end()
})

tap.test('Number', t => {
let source = {
		foo: 42,
		bar: 1.5,
		baz: new Number(10)
	}
	let expect = {
		foo: Number,
		bar: Number,
		baz: Number
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()	
})

tap.test('Boolean', t => {
let source = {
		foo: true,
		bar: false,
		baz: new Boolean(false)
	}
	let expect = {
		foo: Boolean,
		bar: Boolean,
		baz: Boolean
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()	
})

tap.test('String', t => {
let source = {
		foo: "a string",
		bar: new String('also a string')
	}
	let expect = {
		foo: String,
		bar: String
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()	
})

tap.test('Empty String', t => {
let source = {
		foo: ""
	}
	let expect = {
		foo: String
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.end()	
})

tap.test('Object', t => {
	let result = fails({
		foo: {},
		bar: { baz: true }
	}, {
		foo: Object,
		bar: Object
	})
	t.equal(result, false)
	t.equal(fails({ foo: [] }, { foo: Object }).length, 1)
	t.end()
})

tap.test('array', t => {
	let source = {
		foo: [1,2,3],
		bar: ['a','b','c']
	}
	let expect = {
		foo: [Number],
		bar: [String]
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('array incorrect', t => {
	let source = {
		foo: [1,2,'a'],
		bar: ['a','b','']
	}
	let expect = {
		foo: [Number],
		bar: [String]
	}
	let result = fails(source, expect)
	t.equal(result.length, 2)
	t.end()
})

tap.test('array patterns can use custom validators', t => {
	let startsWithA = (value, root, path) => value.startsWith('a') ? false : error('must start with a', value, 'a*', path)
	let result = fails({
		items: ['alpha', 'beta']
	}, {
		items: [startsWithA]
	})
	t.equal(result.length, 1)
	t.equal(result[0].message, 'must start with a')
	t.equal(result[0].pathString, 'items[1]')
	t.end()
})

tap.test('URLSearchParams can be matched as an object', t => {
	let result = fails(new URLSearchParams({
		client_id: 'abc',
		redirect_uri: 'https://example.com/callback'
	}), {
		client_id: String,
		redirect_uri: validURL
	})
	t.equal(result, false)
	t.end()
})

tap.test('[validURL] empty', t => {
	let source = {

	}
	let expect = {
		redirect_uris: Required([validURL])
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.end()
})

tap.test('missing prop', t => {
	let source = {

	}
	let expect = {
		redirect_uris: /.+/
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.end()
})

export const MustInclude = (...options) =>
	(value, root, path) => {
		return Array.isArray(value) && options.filter(o => !value.includes(o)).length != 0
	}

tap.test('custom function', t => {
	let source = {
		scopes_supported: ['openid','offline_access']
	}
	let expect = {
		scopes_supported: Required(MustInclude('openid')),
	}
	let result = fails(source, expect)
	t.equal(result, false)
	t.end()
})

function MustHave(...options) {
	return function _MustHave(data, root, path) {
		if (options.filter(o => data.hasOwnProperty(o)).length === options.length) {
			return false
		}
		return error('data must have all of:', data, options, path)
	}
}

tap.test('path', t => {
	let source = {
		client_info: {
			scopes_supported: ['openid','offline_access']
		},
		test: true
	}
	let expect = {
		client_info: MustHave('scopes_supported')
	}
	let result = fails(source, expect)
	t.equal(result, false)
	source.client_info = {}
	result = fails(source, expect)
	t.equal(result.length, 1)
	t.equal(result[0].path, '.client_info')
	t.end()
})

tap.test('string instead of object', t => {
	let source = "I am a string"
	let expect = {
		string: "I am an object"
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.equal(result[0].message, 'data is not an object, pattern is')
	t.end()
})

tap.test('issues returns false on success', t => {
	let source = {
		foo: 'bar'
	}
	let expect = {
		foo: String
	}
	let result = issues(source, expect)
	t.equal(result, false)
	t.end()
})

tap.test('issues gives structured nested array paths', t => {
	let source = {
		client_info: {
			redirect_uris: [
				'https://example.com/',
				'not a url'
			]
		}
	}
	let expect = {
		client_info: {
			redirect_uris: Required([validURL])
		}
	}
	let result = issues(source, expect)
	t.equal(result.length, 1)
	t.same(result[0].path, ['client_info', 'redirect_uris', 1])
	t.equal(result[0].pathString, 'client_info.redirect_uris[1]')
	t.equal(result[0].actual, 'not a url')
	t.equal(result[0].found, undefined)
	t.equal(result[0].message, 'data is not a valid url')
	t.equal(formatIssue(result[0]), 'client_info.redirect_uris[1]: data is not a valid url')
	t.end()
})

tap.test('issues flattens nested allOf problems', t => {
	let source = {
		foo: 'bar'
	}
	let expect = allOf({
		foo: 'bar'
	}, {
		baz: 'bax'
	})
	let result = issues(source, expect)
	t.equal(result.length, 1)
	t.same(result[0].path, ['baz'])
	t.equal(result[0].pathString, 'baz')
	t.equal(result[0].actual, undefined)
	t.end()
})

tap.test('issues preserves item path for anyOf failures', t => {
	let source = {
		roles: ['admin', 'guest']
	}
	let expect = {
		roles: anyOf('admin', 'editor')
	}
	let result = issues(source, expect)
	t.equal(result.length, 1)
	t.same(result[0].path, ['roles', 1])
	t.equal(result[0].pathString, 'roles[1]')
	t.equal(result[0].actual, 'guest')
	t.end()
})

tap.test('issues normalizes custom validator problem arrays', t => {
	let result = issues({ code: 'x' }, {
		code: () => [false, 'plain problem', error('custom problem', 'x', 'y')]
	})
	t.equal(result.length, 2)
	t.same(result[0].path, [])
	t.equal(result[0].message, 'plain problem')
	t.equal(result[0].actual, undefined)
	t.equal(formatIssue(result[0]), 'value: plain problem')
	t.equal(result[1].message, 'custom problem')
	t.end()
})

tap.test('errors expose string and array paths', t => {
	let nested = error('message', 'found', 'expected', '.client_info.redirect_uris[1]')
	t.same(nested.pathParts, ['client_info', 'redirect_uris', 1])
	t.equal(nested.pathString, 'client_info.redirect_uris[1]')

	let indexed = error('message', 'found', 'expected', [0, 'name'])
	t.same(indexed.pathParts, [0, 'name'])
	t.equal(indexed.pathString, '[0].name')
	t.end()
})


tap.test('issues uses concise equality messages and display expected values', t => {
	let result = issues({ foo: 'foo', bar: 1 }, { foo: 'bar', bar: String })
	t.equal(result.length, 2)
	t.equal(result[0].message, "expected 'bar', found 'foo'")
	t.equal(formatIssue(result[0]), "foo: expected 'bar', found 'foo'")
	t.equal(result[0].expected, "'bar'")
	t.equal(result[1].message, 'data is not a string')
	t.equal(result[1].expected, 'string')
	t.equal(formatIssue(result[1]), 'bar: data is not a string')
	t.end()
})

tap.test('formatIssues returns concise console lines', t => {
	let result = issues({ foo: 'foo', bar: 1 }, { foo: 'bar', bar: String })
	t.same(formatIssues(result), [
		"  - foo: expected 'bar', found 'foo'",
		'  - bar: data is not a string'
	])
	t.end()
})

tap.test('assert error cause includes structured issues', t => {
	enable()
	let oldConsoleError = console.error
	console.error = () => {}
	try {
		assert({ foo: 1 }, { foo: String })
		t.fail('assert should throw')
	} catch (err) {
		t.ok(err.cause.problems)
		t.ok(err.cause.issues)
		t.same(err.cause.issues[0].path, ['foo'])
		t.equal(err.cause.issues[0].actual, 1)
		t.equal(err.message, 'Assertions failed:\n  - foo: data is not a string')
	} finally {
		console.error = oldConsoleError
		disable()
	}
	t.end()
})

tap.test('fails remains backwards compatible while exposing path parts', t => {
	let source = {
		client_info: {}
	}
	let expect = {
		client_info: {
			scopes_supported: Required([String])
		}
	}
	let result = fails(source, expect)
	t.equal(result.length, 1)
	t.equal(result[0].path, '.client_info.scopes_supported')
	t.same(result[0].pathParts, ['client_info', 'scopes_supported'])
	t.equal(result[0].pathString, 'client_info.scopes_supported')
	t.equal(result[0].actual, undefined)
	t.end()
})



tap.test('formatIssues makes common matcher messages concise', t => {
	let oneOfResult = issues({ role: 'guest' }, { role: oneOf('admin', 'editor') })
	t.same(formatIssues(oneOfResult), [
		"  - role: expected one of 'admin', 'editor', found 'guest'"
	])

	let regexResult = issues({ code: 'abc' }, { code: /^x/ })
	t.same(formatIssues(regexResult), [
		"  - code: expected /^x/, found 'abc'"
	])

	let missingRegexResult = issues({}, { code: /.+/ })
	t.same(formatIssues(missingRegexResult), [
		'  - code: missing; expected /.+/'
	])

	let notResult = issues({ role: 'guest' }, { role: not('guest') })
	t.same(formatIssues(notResult), [
		"  - role: must not match 'guest'"
	])

	let instanceResult = issues({ date: {} }, { date: instanceOf(Date) })
	t.same(formatIssues(instanceResult), [
		'  - date: expected instance of Date, found {}'
	])
	t.end()
})

tap.test('formatIssues truncates long values but issues keep raw actual values', t => {
	let longActual = 'x'.repeat(120)
	let longExpected = 'y'.repeat(120)
	let result = issues({ message: longActual }, { message: longExpected })
	let lines = formatIssues(result)
	t.equal(result[0].actual, longActual)
	t.ok(lines[0].includes('…'))
	t.ok(lines[0].length <= 190)
	t.end()
})

tap.test('formatIssues describes circular values', t => {
	let circular = {}
	circular.self = circular
	let result = issues({ value: circular }, { value: 'literal' })
	t.same(formatIssues(result), [
		"  - value: expected 'literal', found [object Object]"
	])
	t.end()
})

tap.test('formatIssue stays unindented, formatIssues is indented for console output', t => {
	let result = issues({ foo: 1 }, { foo: String })
	t.equal(formatIssue(result[0]), 'foo: data is not a string')
	t.same(formatIssues(result), [
		'  - foo: data is not a string'
	])
	t.same(formatIssues(result, { indent: '    ' }), [
		'    foo: data is not a string'
	])
	t.same(formatIssues(result, { indent: '' }), [
		'foo: data is not a string'
	])
	t.end()
})

tap.test('format helpers handle plain values', t => {
	t.equal(formatIssue('not an issue object'), 'not an issue object')
	t.same(formatIssues('not an issue object'), [
		'not an issue object'
	])
	t.equal(formatIssues(false), false)
	t.end()
})

tap.test('formatIssues covers built-in failure message formats', t => {
	let cases = [
		{
			name: 'required value',
			data: {},
			pattern: { foo: Required(String) },
			expected: ['  - foo: required']
		},
		{
			name: 'literal equality',
			data: { foo: 'foo' },
			pattern: { foo: 'bar' },
			expected: ["  - foo: expected 'bar', found 'foo'"]
		},
		{
			name: 'string type',
			data: { foo: 12 },
			pattern: { foo: String },
			expected: ['  - foo: data is not a string']
		},
		{
			name: 'empty string',
			data: { foo: '' },
			pattern: { foo: String },
			expected: ['  - foo: empty string is not allowed']
		},
		{
			name: 'number type',
			data: { foo: '12' },
			pattern: { foo: Number },
			expected: ['  - foo: data is not a number']
		},
		{
			name: 'boolean type',
			data: { foo: 'true' },
			pattern: { foo: Boolean },
			expected: ['  - foo: data is not a boolean']
		},
		{
			name: 'array type',
			data: { foo: {} },
			pattern: { foo: Array },
			expected: ['  - foo: data is not an array']
		},
		{
			name: 'object type',
			data: { foo: [] },
			pattern: { foo: Object },
			expected: ['  - foo: data is not an object']
		},
		{
			name: 'regex mismatch',
			data: { code: 'abc' },
			pattern: { code: /^x/ },
			expected: ["  - code: expected /^x/, found 'abc'"]
		},
		{
			name: 'missing regex value',
			data: {},
			pattern: { code: /.+/ },
			expected: ['  - code: missing; expected /.+/']
		},
		{
			name: 'regex mismatch inside array data',
			data: { codes: ['x-ray', 'abc'] },
			pattern: { codes: /^x/ },
			expected: ["  - codes[1]: expected /^x/, found 'abc'"]
		},
		{
			name: 'expected object',
			data: { config: 'not an object' },
			pattern: { config: { enabled: Boolean } },
			expected: ['  - config: data is not an object']
		},
		{
			name: 'object pattern mismatch inside array data',
			data: { items: [{ kind: 'wrong' }] },
			pattern: { items: { kind: 'right' } },
			expected: ['  - items[0]: expected {"kind":"right"}, found {"kind":"wrong"}']
		},
		{
			name: 'expected array for array pattern',
			data: { items: 'not an array' },
			pattern: { items: [Number] },
			expected: ['  - items: data is not an array']
		},
		{
			name: 'array item mismatch',
			data: { items: [1, 'two'] },
			pattern: { items: [Number] },
			expected: ['  - items[1]: data is not a number']
		},
		{
			name: 'oneOf mismatch',
			data: { role: 'guest' },
			pattern: { role: oneOf('admin', 'editor') },
			expected: ["  - role: expected one of 'admin', 'editor', found 'guest'"]
		},
		{
			name: 'anyOf expects array',
			data: { roles: 'admin' },
			pattern: { roles: anyOf('admin', 'editor') },
			expected: ['  - roles: data is not an array']
		},
		{
			name: 'anyOf item mismatch',
			data: { roles: ['admin', 'guest'] },
			pattern: { roles: anyOf('admin', 'editor') },
			expected: ["  - roles[1]: expected one of 'admin', 'editor', found 'guest'"]
		},
		{
			name: 'allOf nested failure is flattened',
			data: { foo: 'ok' },
			pattern: allOf({ foo: String }, { bar: Required(String) }),
			expected: ['  - bar: required']
		},
		{
			name: 'valid url',
			data: { url: 'not a url' },
			pattern: { url: validURL },
			expected: ['  - url: data is not a valid url']
		},
		{
			name: 'valid email',
			data: { email: 'not an email' },
			pattern: { email: validEmail },
			expected: ['  - email: data is not a valid email']
		},
		{
			name: 'instanceOf',
			data: { date: {} },
			pattern: { date: instanceOf(Date) },
			expected: ['  - date: expected instance of Date, found {}']
		},
		{
			name: 'not',
			data: { role: 'guest' },
			pattern: { role: not('guest') },
			expected: ["  - role: must not match 'guest'"]
		}
	]
	for (let testCase of cases) {
		t.same(formatIssues(issues(testCase.data, testCase.pattern)), testCase.expected, testCase.name)
	}
	t.end()
})

tap.test('assert error message indents multiple failures', t => {
	enable()
	let oldConsoleError = console.error
	console.error = () => {}
	try {
		assert({ foo: 1, role: 'guest' }, {
			foo: String,
			role: oneOf('admin', 'editor')
		})
		t.fail('assert should throw')
	} catch (err) {
		t.equal(err.message, [
			'Assertions failed:',
			'  - foo: data is not a string',
			"  - role: expected one of 'admin', 'editor', found 'guest'"
		].join('\n'))
	} finally {
		console.error = oldConsoleError
		disable()
	}
	t.end()
})
