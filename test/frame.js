import { assert } from 'chai'
import { describe, it } from 'mocha'
import Frame from '../src/frame'

describe('Frame', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(Frame({name: 'Foo'}, 0).toString(), 'Frame{index: 0, name: "Foo"}')

            assert.equal(Frame({
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
                    selectors: ['.foo', '.bar']
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
                    selectors: ['#foo', '#bar']
                }]
            }, 3).toString(), 'Frame{index: 3, enter: TransitionCollection[Transition{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, selectors: [.bar, .foo], style: Style{color: "red", width: "100px"}}, Transition{attr: Attributes{lang: "de", title: "Bar"}, delay: 30, duration: 15, selectors: [#bar, #foo], style: Style{color: "rgb(123, 234, 56)", width: "120px"}}]}')
        })
    })

    describe('.collectAttributeNames()', () => {
        it('should collect all attribute names for specific selectors', () => {
            const frame = Frame({
                enter: [{
                    selectors: ['.foo', '#bar'],
                    attr: {
                        title: 'First'
                    }
                }],
                update: [{
                    selectors: ['.foo'],
                    attr: {
                        lang: 'en'
                    }
                }, {}, {
                    selectors: ['#bar'],
                    attr: {
                        onclick: 'alert()'
                    }
                }],
                exit: [{
                    selectors: ['.foo'],
                    attr: {
                        onmouseover: 'alert()'
                    }
                }, {
                    selectors: ['#bar'],
                    attr: {
                        onmouseleave: 'alert()'
                    }
                }]
            }, 0)

            // .foo
            assert.deepEqual(frame.collectAttributeNames(['.foo']), ['lang', 'onmouseover', 'title'])

            // #bar
            assert.deepEqual(frame.collectAttributeNames(['#bar']), ['onclick', 'onmouseleave', 'title'])

            // .foo, #bar
            assert.deepEqual(frame.collectAttributeNames([ '.foo', '#bar']), ['lang', 'onclick', 'onmouseleave', 'onmouseover', 'title'])
        })
    })

    describe('.collectStyleNames()', () => {
        it('should collect all style names for specific selectors', () => {
            const frame = Frame({
                enter: [{
                    selectors: ['.foo', '#bar'],
                    style: {
                        color: 'red'
                    }
                }],
                update: [{
                    selectors: ['.foo'],
                    style: {
                        'background-color': 'red'
                    }
                }, {}, {
                    selectors: ['#bar'],
                    style: {
                        'width': 'blue'
                    }
                }],
                exit: [{
                    selectors: ['.foo'],
                    style: {
                        height: '10px'
                    }
                }, {
                    selectors: ['#bar'],
                    style: {
                        padding: '10px'
                    }
                }]
            }, 0)

            // .foo
            assert.deepEqual(frame.collectStyleNames(['.foo']), ['background-color', 'color', 'height'])

            // #bar
            assert.deepEqual(frame.collectStyleNames(['#bar']), ['color', 'padding', 'width'])

            // .foo, #bar
            assert.deepEqual(frame.collectStyleNames([ '.foo', '#bar']), ['background-color', 'color', 'height', 'padding', 'width'])
        })
    })

    return
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
