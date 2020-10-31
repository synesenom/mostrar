import { assert } from 'chai'
import { describe, it } from 'mocha'
import FrameCollection from '../src/frame-collection'
import TransitionCollection from '../src/transition-collection'

describe('FrameCollection', () => {
    describe('.getTransitions()', () => {
        it('should return a transition collection', () => {
            assert.deepEqual(FrameCollection([
                {
                    update: [{}, {
                        selector: ['.foo'],
                        duration: 10,
                        attr: {},
                        style: {}
                    }]
                },
                {
                    enter: [{
                        selector: ['.bar'],
                        delay: 10,
                        attr: {
                            fill: 'red'
                        }
                    }]
                },
                {
                    exit: [{
                        selector: ['#foo'],
                        style: {
                            stroke: 'red'
                        }
                    }]
                }]).getTransitions().__test__._.transitions.map(d => d.__test__._), TransitionCollection([{
                selector: [],
                duration: 0,
                delay: 0,
                attr: {},
                style: {}
            }, {
                selector: ['.foo'],
                duration: 10,
                delay: 0,
                attr: {},
                style: {}
            }, {
                selector: ['.bar'],
                duration: 0,
                delay: 10,
                attr: {
                    fill: 'red'
                },
                style: {}
            }, {
                selector: ['#foo'],
                duration: 0,
                delay: 0,
                attr: {},
                style: {
                    stroke: 'red'
                }
            }]).__test__._.transitions.map(d => d.__test__._))
        })
    })

})
