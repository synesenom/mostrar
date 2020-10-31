import { assert } from 'chai'
import { JSDOM } from 'jsdom'
import {beforeEach, describe, it} from 'mocha'
import TransitionCollection from '../src/transition-collection'
import * as d3 from 'd3'

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

describe('TransitionCollection', () => {
    describe('.getAttributes()', () => {
        it('should return empty object for empty entries', () => {
            assert.deepEqual(TransitionCollection([]).getAttributes(), {})
        })

        it('should return attributes from a set of entries', () => {
            assert.deepEqual(TransitionCollection([{
                attr: {
                    fill: 'red'
                }
            }, {
                attr: {
                    stroke: 'blue'
                }
            }, {
                attr: {}
            }, {}]).getAttributes(), {fill: 'red', stroke: 'blue'})
        })

        it('should init attributes if node is valid', () => {
            addObjects()
            assert.deepEqual(TransitionCollection([{
                attr: {
                    title: 'Original'
                }
            }, {
                attr: {
                    stroke: 'blue'
                }
            }]).getAttributes(d3.select('#obj-1')), {
                title: 'First object',
                stroke: null
            })
        })
    })

    describe('.getStyles()', () => {
        it('should return empty object for empty entries', () => {
            assert.deepEqual(TransitionCollection([]).getStyle(), {})
        })

        it('should return attributes from a set of entries', () => {
            assert.deepEqual(TransitionCollection([{
                style: {
                    fill: 'red'
                }
            }, {
                style: {
                    stroke: 'blue'
                }
            }, {
                style: {}
            }, {}]).getStyle(), {fill: 'red', stroke: 'blue'})
        })

        it('should init style if node is valid', () => {
            addObjects()
            assert.deepEqual(TransitionCollection([{
                style: {
                    'background-color': 'red'
                }
            }, {
                style: {
                    stroke: 'blue'
                }
            }]).getStyle(d3.select('#obj-1')), {
                'background-color': 'orange',
                stroke: null
            })
        })
    })

    describe('.getMaxDelay()', () => {
        it('should return 0 if transition collection is empty', () => {
            assert.equal(TransitionCollection([]).getMaxDelay(), 0)
        })

        it('should return 0 if delays are invalid', () => {
            assert.equal(TransitionCollection([{}]).getMaxDelay(), 0)
        })

        it('should return the max delay', () => {
            assert.equal(TransitionCollection([{},  {delay: 0}, {delay: 1}]).getMaxDelay(), 1)
        })
    })

    describe('.getMaxDuration()', () => {
        it('should return 0 if transition collection is empty', () => {
            assert.equal(TransitionCollection([]).getMaxDuration(), 0)
        })

        it('should return 0 if durations are invalid', () => {
            assert.equal(TransitionCollection([{}]).getMaxDuration(), 0)
        })

        it('should return the max duration', () => {
            assert.equal(TransitionCollection([{},  {duration: 0}, {duration: 1}]).getMaxDuration(), 1)
        })
    })
})
