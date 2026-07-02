import * as assertApi from './assert-core.mjs'

export * from './assert-core.mjs'

globalThis.assert = { ...assertApi }
