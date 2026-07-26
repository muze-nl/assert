import tap from 'tap'

tap.test('core import has no global side effects', async t => {
	let hadAssert = Object.prototype.hasOwnProperty.call(globalThis, 'assert')
	let previousAssert = globalThis.assert
	globalThis.assert = 'sentinel'

	try {
		await import('../src/assert-core.mjs')
		t.equal(globalThis.assert, 'sentinel')
		t.equal(globalThis.assertEnabled, undefined)
	} finally {
		if (hadAssert) {
			globalThis.assert = previousAssert
		} else {
			delete globalThis.assert
		}
	}
})

tap.test('core exports work without global registration', async t => {
	let { assert, check, disable, enable, fails, validURL } = await import('../src/assert-core.mjs')

	t.equal(fails('https://example.com/', validURL), false)
	t.equal(assert('not a url', validURL), undefined)
	t.throws(
		() => check('not a url', validURL, 'url is required', TypeError),
		{
			name: 'TypeError',
			message: /url is required/
		}
	)

	let oldConsoleError = console.error
	console.error = () => {}
	try {
		enable()
		t.throws(() => assert('not a url', validURL))
	} finally {
		disable()
		console.error = oldConsoleError
	}

	t.end()
})

tap.test('Array pattern checks for arrays like the other built-in types', async t => {
	let { fails } = await import('../src/assert-core.mjs')

	t.equal(fails([], Array), false)
	t.match(fails('not an array', Array), [
		{ message: 'data is not an array' }
	])

	t.end()
})

tap.test('Object pattern checks for non-array objects like the other built-in types', async t => {
	let { fails } = await import('../src/assert-core.mjs')

	t.equal(fails({}, Object), false)
	t.match(fails(null, Object), [
		{ message: 'data is not an object' }
	])
	t.match(fails([], Object), [
		{ message: 'data is not an object' }
	])

	t.end()
})
