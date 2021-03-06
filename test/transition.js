import { assert } from 'chai'
import { describe, it } from 'mocha'
import { Transition } from '../src/transition'


describe('Transition', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(Transition().toString(), 'Transition{}')

            assert.equal(Transition({
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
                selectors: ['.foo', '.bar']
            }).toString(), 'Transition{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, selectors: [.bar, .foo], style: Style{color: "red", width: "100px"}}')
        })
    })

    describe('.includes()', () => {
        it('should return false if constructor selector is invalid', () => {
            assert.equal(Transition().includes(['.foo', '#bar']), false)
            assert.equal(Transition().includes(['.foo', '#bar']), false)
        })

        it('should return false if selector parameter is invalid', () => {
            assert.equal(Transition({selectors: ['.foo', '#bar']}).includes(), false)
        })

        it('should return false if no overlap', () => {
            assert.equal(Transition({selectors: ['.foo', '#bar']}).includes(['#foo', '.bar']), false)
        })

        it('should return true if there is overlap', () => {
            assert.equal(Transition({selectors: ['.foo', '#bar']}).includes(['#foo', '.bar', '#bar']), true)
        })
    })
})
