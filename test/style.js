import { assert } from 'chai'
import {beforeEach, describe, it} from 'mocha'
import Style from '../src/style'
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

describe('Style', () => {
    describe('.apply()', () => {
        it('should return a selection', () => {
            addObjects()
            assert.deepEqual(Style({
                'background-color': 'pink'
            }).apply(d3.select('#obj-1')), d3.select('#obj-1'))
        })

        it('should change style', () => {
            addObjects()
            Style({
                'background-color': 'pink'
            }).apply(d3.select('#obj-1'))
            assert.equal(d3.select('#obj-1').style('background-color'), 'pink')
        })
    })

    describe('.diff()', () => {
        it('should return difference between two styles', () => {
            addObjects()
            assert.deepEqual(Style({
                'background-color': 'red',
                color: 'black',
            }).diff(Style({
                'background-color': 'red',
                color: 'blue',
            }), d3.select('#obj-1')).__test__.toString(), Style({
                // Same style but different from object's current style.
                'background-color': 'red',

                // Differing style.
                color: 'blue'
            }).__test__.toString())
        })
    })
})
