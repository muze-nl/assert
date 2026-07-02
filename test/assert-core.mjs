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
	let { assert, disable, enable, fails, validURL } = await import('../src/assert-core.mjs')

	t.equal(fails('https://example.com/', validURL), false)
	t.equal(assert('not a url', validURL), undefined)

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
