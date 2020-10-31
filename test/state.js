import stringify from 'json-stable-stringify'
import { assert } from 'chai'
import {beforeEach, describe, it} from 'mocha'
import { TRANSITION_TYPES } from '../src/transition'
import State from '../src/state'
import SceneObject from '../src/scene-object'
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

describe('State', () => {
    describe('.toString()', () => {
        it('should return the string representation of the state', () => {
            assert.equal(State({
                id: 0,
                visible: true,
                style: {
                    fill: 'red'
                },
                attr: {
                    stroke: 'blue'
                }
            }).__test__.toString(), stringify({
                id: 0,
                delay: 0,
                duration: 0,
                visible: true,
                style: {
                    fill: 'red'
                },
                attr: {
                    stroke: 'blue'
                }
            }))
        })
    })

    describe('.getTransitionType()', () => {
        it('should return undefined if object is not present', () => {
            assert(typeof State({visible: false}).getTransitionType(State({visible: false})) === 'undefined')
        })

        it('should return enter if object enters', () => {
            assert.equal(State({visible: false}).getTransitionType(State({visible: true})), TRANSITION_TYPES.enter)
        })

        it('should return exit if object exits', () => {
            assert.equal(State({visible: true}).getTransitionType(State({visible: false})), TRANSITION_TYPES.exit)
        })

        it('should return update if object updates', () => {
            assert.equal(State({visible: true}).getTransitionType(State({visible: true})), TRANSITION_TYPES.update)
        })
    })
})
