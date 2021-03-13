import { assert } from 'chai'
import { describe, it } from 'mocha'
import Style from '../src/style'
import * as d3 from 'd3'
import { addObjects } from './test-utils';


describe('Style', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(Style().toString(), 'Style{}')

            assert.equal(Style({
                width: '100px',
                'background-color': 'red'
            }).toString(), 'Style{background-color: "red", width: "100px"}')
        })
    })

    describe('.apply()', () => {
        it('should change style', () => {
            addObjects()
            Style({
                'background-color': 'pink'
            }).apply(d3.select('#obj-1'))
            assert.equal(d3.select('#obj-1').style('background-color'), 'pink')
        })
    })

    describe('.diffTo()', () => {
        it('should return the difference between two style', () => {
            addObjects()
            const style1 = Style({
                color: 'red',
                'background-color': 'blue'
            })
            const style2 = Style({
                color: 'green',
                'background-color': 'blue'
            })
            const diff = style1.diffTo(style2)
            assert.deepEqual(diff.toString(), Style({
                color: 'green'
            }).toString())
        })
    })

    describe('.filter()', () => {
        it('should return the style different in selection', () => {
            addObjects()
            const style = Style({
                color: 'rgb(0, 0, 0)',
                width: '200px'
            })
            const el = d3.select('#obj-1')
            const diff = style.filter(el)
            assert.deepEqual(diff.toString(), Style({
                width: '200px'
            }).toString())
        })
    })

    describe('.diff()', () => {
        it('should return the difference between two attributes', () => {
            addObjects()
            const style1 = Style({
                color: 'rgb(0, 0, 0)',
                width: '100px'
            })
            const style2 = Style({
                color: 'rgb(0, 0, 0)',
                width: '200px'
            })
            const diff = style1.diff(style2, d3.select('#obj-1'))
            assert.deepEqual(diff.toString(), Style({
                width: '200px'
            }).toString())
        })
    })
})
