import { assert } from 'chai'
import {describe, it} from 'mocha'
import State from '../src/state'


describe('State', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(State().toString(), 'State{}')

            assert.equal(State({
                visible: true
            }).toString(), 'State{visible}')

            assert.equal(State({
                attr: {
                    title: 'Foo',
                    lang: 'en'
                },
                style: {
                    width: '100px',
                    color: 'red'
                },
                delay: 20,
                duration: 10,
                visible: false
            }).toString(), 'State{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, style: Style{color: "red", width: "100px"}}')
        })
    })

    /*
    describe('.isVisible()', () => {
        it('should return true if element is visible', () => {
            assert.equal(State({}).isVisible(), false)
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
     */
})
