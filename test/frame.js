import { assert } from 'chai'
import { describe, it } from 'mocha'
import Frame from '../src/frame'

describe('Frame', () => {
    describe('.getEnters()', () => {
        it('should return empty array for invalid enter', () => {
            assert.deepEqual(Frame({}).__test__.getEnters(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid enter selector', () => {
            assert.deepEqual(Frame({enter: [{}]}).__test__.getEnters(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid selector', () => {
            assert.deepEqual(Frame({enter: [{}]}).__test__.getEnters(), [])
            assert.deepEqual(Frame({enter: [{}]}).__test__.getEnters(null), [])
        })

        it('should return empty array for non-overlapping selectors', () => {
            assert.deepEqual(Frame({enter: [{selector: ['.foo', '#bar']}, {}]}).__test__.getEnters(['#foo', '.bar']), [])
        })

        it('should return the relevant enter transitions', () => {
            assert.deepEqual(Frame({enter: [{selector: ['.foo']}, {selector: ['#bar']}]}).__test__.getEnters(['.foo', '.bar']), [{selector: ['.foo']}])
        })
    })

    describe('.getExits()', () => {
        it('should return empty array for invalid exit', () => {
            assert.deepEqual(Frame({}).__test__.getExits(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid exit selector', () => {
            assert.deepEqual(Frame({exit: [{}]}).__test__.getExits(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid selector', () => {
            assert.deepEqual(Frame({exit: [{}]}).__test__.getExits(), [])
            assert.deepEqual(Frame({exit: [{}]}).__test__.getExits(null), [])
        })

        it('should return empty array for non-overlapping selectors', () => {
            assert.deepEqual(Frame({exit: [{selector: ['.foo', '#bar']}, {}]}).__test__.getExits(['#foo', '.bar']), [])
        })

        it('should return the relevant exit transitions', () => {
            assert.deepEqual(Frame({exit: [{selector: ['.foo']}, {selector: ['#bar']}]}).__test__.getExits(['.foo', '.bar']), [{selector: ['.foo']}])
        })
    })

    describe('.getUpdates()', () => {
        it('should return empty array for invalid update', () => {
            assert.deepEqual(Frame({}).__test__.getUpdates(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid update selector', () => {
            assert.deepEqual(Frame({update: [{}]}).__test__.getUpdates(['.foo', '#bar']), [])
        })

        it('should return empty array for invalid selector', () => {
            assert.deepEqual(Frame({update: [{}]}).__test__.getUpdates(), [])
            assert.deepEqual(Frame({update: [{}]}).__test__.getUpdates(null), [])
        })

        it('should return empty array for non-overlapping selectors', () => {
            assert.deepEqual(Frame({update: [{selector: ['.foo', '#bar']}, {}]}).__test__.getUpdates(['#foo', '.bar']), [])
        })

        it('should return the relevant update transitions', () => {
            assert.deepEqual(Frame({update: [{selector: ['.foo']}, {selector: ['#bar']}]}).__test__.getUpdates(['.foo', '.bar']), [{selector: ['.foo']}])
        })
    })
})
