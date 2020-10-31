import { assert } from 'chai'
import {beforeEach, describe, it} from 'mocha'
import Attributes from '../src/attributes'
import * as d3 from 'd3'
import {JSDOM} from 'jsdom'

function addObjects () {
    [{
        classList: ['foo', 'bar']
    }].forEach((d, i) => {
        const el = document.createElement('div')
        el.id = 'obj-' + (i + 1)
        el.classList.add('obj', ...d.classList)
        el.style.backgroundColor = 'orange'
        el.title = 'First object'
        document.body.appendChild(el)
    })
}

beforeEach(() => {
    // Create DOM.
    const dom = new JSDOM('<html><body></body></html>')
    global.window = dom.window
    global.document = dom.window.document
})

describe('Attributes', () => {
    describe('.apply()', () => {
        it('should return a selection', () => {
            addObjects()
            assert.deepEqual(Attributes({
                title: 'Changed'
            }).apply(d3.select('#obj-1')), d3.select('#obj-1'))
        })

        it('should change attributes', () => {
            addObjects()
            Attributes({
                title: 'Changed'
            }).apply(d3.select('#obj-1'))
            assert.equal(d3.select('#obj-1').attr('title'), 'Changed')
        })
    })

    describe('.diff()', () => {
        it('should return difference between two attributes', () => {
            addObjects()
            assert.deepEqual(Attributes({
                lang: 'de',
                title: 'Changed'
            }).diff(Attributes({
                lang: 'en',
                title: 'Changed'
            }), d3.select('#obj-1')).__test__.toString(), Attributes({
                // Same attributes but different from object's current attributes.
                lang: 'en',

                // Differing attribute.
                title: 'Changed'
            }).__test__.toString())
        })
    })
})
