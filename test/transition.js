import { assert } from 'chai'
import { describe, it } from 'mocha'
import { Transition } from '../src/transition'

describe('Transition', () => {
    describe('.includes()', () => {
        it('should return false if left selector is invalid', () => {
            assert.equal(Transition({}).includes(new Set(['.foo', '#bar'])), false)
            assert.equal(Transition({selector: null}).includes(new Set(['.foo', '#bar'])), false)
        })

        it('should return false if right selector is invalid', () => {
            assert.equal(Transition({selector: ['.foo', '#bar']}).includes(), false)
            assert.equal(Transition({selector: ['.foo', '#bar']}).includes(null), false)
        })

        it('should return false if no overlap', () => {
            assert.equal(Transition({selector: ['.foo', '#bar']}).includes(['#foo', '.bar']), false)
        })

        it('should return true if there is overlap', () => {
            assert.equal(Transition({selector: ['.foo', '#bar']}).includes(['#foo', '.bar', '#bar']), true)
        })
    })
})
