import { enable, disable, fails, assert, 
	oneOf, anyOf, not, Optional, Required, Recommended } from '../src/assert.mjs'
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