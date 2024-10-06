import { enable, disable, fails, assert, 
	oneOf, anyOf, not, Optional, Required, Recommended,
	validURL, validEmail } from '../src/assert.mjs'
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


tap.test('enable', t => {
	let result = assert('foo','bar')
	t.equal(result, undefined)
	enable()
	t.throws(() => {
		let result = assert('foo','bar')
	})
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

tap.test('[validURL] empty', t => {
	let source = {

	}
	let expect = {
		redirect_uris: Required()
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
