import { assert } from 'chai'
import {describe, it} from 'mocha'
import {TRANSITION_TYPES} from '../src/transition'
import ElementState from '../src/element-state'


describe('ElementState', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(ElementState({
                visible: true
            }).toString(), 'ElementState{visible}')

            assert.equal(ElementState({
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
            }).toString(), 'ElementState{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, style: Style{color: "red", width: "100px"}}')
        })
    })

    describe('.isVisible()', () => {
        it('should return true if element is visible', () => {
            assert.equal(ElementState({}).isVisible(), false)
        })
    })

    describe('.getTransitionType()', () => {
        it('should return undefined if object is not present', () => {
            assert(typeof ElementState({visible: false}).getTransitionType(ElementState({visible: false})) === 'undefined')
        })

        it('should return enter if object enters', () => {
            assert.equal(ElementState({visible: false}).getTransitionType(ElementState({visible: true})), TRANSITION_TYPES.enter)
        })

        it('should return exit if object exits', () => {
            assert.equal(ElementState({visible: true}).getTransitionType(ElementState({visible: false})), TRANSITION_TYPES.exit)
        })

        it('should return update if object updates', () => {
            assert.equal(ElementState({visible: true}).getTransitionType(ElementState({visible: true})), TRANSITION_TYPES.update)
        })
    })
})
