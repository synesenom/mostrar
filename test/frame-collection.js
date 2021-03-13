import { assert } from 'chai'
import { describe, it } from 'mocha'
import FrameCollection from '../src/frame-collection'
import TransitionCollection from '../src/transition-collection'
import {FRAMES} from "./test-utils";

describe('FrameCollection', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(FrameCollection().toString(), 'FrameCollection[]')

            assert.equal(FrameCollection(FRAMES).toString(), 'FrameCollection[Frame{index: 0, name: "first", update: TransitionCollection[Transition{attr: Attributes{onclick: "alert()"}, duration: 10, selectors: [#obj-1], style: Style{color: "rgb(255, 0, 0)"}}]}, Frame{index: 1, exit: TransitionCollection[Transition{delay: 10, selectors: [.foo], style: Style{background-color: "rgb(0, 0, 255)"}}, Transition{delay: 20, selectors: [.bar], style: Style{color: "rgb(0, 0, 255)"}}]}, Frame{index: 2, update: TransitionCollection[Transition{attr: Attributes{title: "Changed"}, selectors: [.el], style: Style{color: "rgb(0, 255, 0)"}}]}, Frame{index: 3, name: "fourth", enter: TransitionCollection[Transition{selectors: [.el]}]}, Frame{index: 4, update: TransitionCollection[Transition{attr: Attributes{title: "Fifth frame"}, selectors: [.bar, .foo], style: Style{opacity: "0.5"}}]}]')
        })
    })

    describe('.collectStyleNames()', async () => {
        it('should return the relevant style names for some selectors', () => {
            const frameCollection = FrameCollection(FRAMES)

            assert.deepEqual(frameCollection.collectStyleNames(['.foo']), ['background-color', 'opacity'])
            assert.deepEqual(frameCollection.collectStyleNames(['.bar']), ['color', 'opacity'])
            assert.deepEqual(frameCollection.collectStyleNames(['.foo', '.bar']), ['background-color', 'color', 'opacity'])
        })
    })

    return
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
