import { assert } from 'chai'
import { describe, it } from 'mocha'
import Attributes from '../src/attributes'
import * as d3 from 'd3'
import { addObjects } from './test-utils';


describe('Attributes', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(Attributes().toString(), 'Attributes{}')

            assert.equal(Attributes({
                title: 'Some title',
                lang: 'en'
            }).toString(), 'Attributes{lang: "en", title: "Some title"}')
        })
    })

    describe('.apply()', () => {
        it('should change attributes', () => {
            addObjects()
            Attributes({
                title: 'Changed'
            }).apply(d3.select('#obj-1'))
            assert.equal(d3.select('#obj-1').attr('title'), 'Changed')
        })
    })

    describe('.diffTo()', () => {
        it('should return the difference between two attributes', () => {
            addObjects()
            const attr1 = Attributes({
                lang: 'de',
                title: 'Changed'
            })
            const attr2 = Attributes({
                lang: 'en',
                title: 'Changed'
            })
            const diff = attr1.diffTo(attr2)
            assert.deepEqual(diff.toString(), Attributes({
                lang: 'en'
            }).toString())
        })
    })

    describe('.filter()', () => {
        it('should return the attributes different in selection', () => {
            addObjects()
            const attr = Attributes({
                lang: 'en',
                title: 'Changed'
            })
            const el = d3.select('#obj-1')
            const diff = attr.filter(el)
            assert.deepEqual(diff.toString(), Attributes({
                title: 'Changed'
            }).toString())
        })
    })

    describe('.diff()', () => {
        it('should return the difference between two attributes', () => {
            addObjects()
            const attr1 = Attributes({
                lang: 'en',
                title: 'First object'
            })
            const attr2 = Attributes({
                lang: 'en',
                title: 'Changed'
            })
            const diff = attr1.diff(attr2, d3.select('#obj-1'))
            assert.deepEqual(diff.toString(), Attributes({
                title: 'Changed'
            }).toString())
        })
    })
})
