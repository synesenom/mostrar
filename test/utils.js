import { assert } from 'chai'
import { JSDOM } from 'jsdom'
import { describe, it, beforeEach } from 'mocha'
import extractSelectors from '../src/utils/extract-selectors'


beforeEach(() => {
    const dom = new JSDOM('<html><body></body></html>')
    global.window = dom.window
    global.document = dom.window.document
})


describe('utils', () => {
    describe('.extractSelectors()', () => {
        it('should extract all class selectors', () => {
            // Add div.
            const el = document.createElement('div')
            el.classList.add('foo', 'bar', 'bar')
            el.id = 'some-id'

            // Extract selectors.
            assert.deepEqual(extractSelectors(el), ['#some-id', '.bar', '.foo'])
        })
    })
})
