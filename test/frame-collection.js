import { assert } from 'chai'
import { describe, it } from 'mocha'
import FrameCollection from '../src/frame-collection'
import TransitionCollection from '../src/transition-collection'

describe('FrameCollection', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(FrameCollection().toString(), 'FrameCollection[]')

            assert.equal(FrameCollection([{
                name: 'first',
                enter: [{
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
                    selector: ['.foo', '.bar']
                }, {
                    style: {
                        width: '120px',
                        color: 'rgb(123, 234, 56)'
                    },
                    delay: 30,
                    duration: 15,
                    attr: {
                        title: 'Bar',
                        lang: 'de'
                    },
                    selector: ['#foo', '#bar']
                }]
            }, {
                update: [{
                    style: {
                        width: '120px',
                        color: 'black'
                    },
                    delay: 30,
                    duration: 15,
                    attr: {
                        title: 'Bar 2',
                        lang: 'se'
                    },
                    selector: ['#foo', '#bar']
                }],
                exit: [{
                    attr: {
                        title: 'Foo 3',
                        lang: 'dk'
                    },
                    style: {
                        width: '100px',
                        color: 'red'
                    },
                    delay: 20,
                    duration: 10,
                    selector: ['.foo', '.bar']
                }]
            }]).toString(), 'FrameCollection[Frame{index: 0, name: "first", enter: TransitionCollection[Transition{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, selector: [.bar, .foo], style: Style{color: "red", width: "100px"}}, Transition{attr: Attributes{lang: "de", title: "Bar"}, delay: 30, duration: 15, selector: [#bar, #foo], style: Style{color: "rgb(123, 234, 56)", width: "120px"}}]}, Frame{index: 1, update: TransitionCollection[Transition{attr: Attributes{lang: "se", title: "Bar 2"}, delay: 30, duration: 15, selector: [#bar, #foo], style: Style{color: "black", width: "120px"}}], exit: TransitionCollection[Transition{attr: Attributes{lang: "dk", title: "Foo 3"}, delay: 20, duration: 10, selector: [.bar, .foo], style: Style{color: "red", width: "100px"}}]}]')
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
