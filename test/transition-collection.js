import { assert } from 'chai'
import {describe, it} from 'mocha'
import TransitionCollection from '../src/transition-collection'
import * as d3 from 'd3'
import {addObjects} from "./test-utils";


describe('TransitionCollection', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(TransitionCollection(), 'TransitionCollection[]')

            assert.equal(TransitionCollection([{
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
            }]).toString(), 'TransitionCollection[Transition{attr: Attributes{lang: "en", title: "Foo"}, delay: 20, duration: 10, selector: [.bar, .foo], style: Style{color: "red", width: "100px"}}, Transition{attr: Attributes{lang: "de", title: "Bar"}, delay: 30, duration: 15, selector: [#bar, #foo], style: Style{color: "rgb(123, 234, 56)", width: "120px"}}]')
        })
    })

    describe('.size()', () => {
        it('should return the size of the collection', () => {
            assert.equal(TransitionCollection().size(), 0)

            assert.equal(TransitionCollection([{
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
            }]).size(), 2)
        })
    })

    return
    describe('.getAttributes()', () => {
        it('should return empty object for empty entries', () => {
            assert.deepEqual(TransitionCollection([]).getAttributes(), {})
        })

        it('should return attributes from a set of entries', () => {
            assert.deepEqual(TransitionCollection([{
                attr: {
                    fill: 'red'
                }
            }, {
                attr: {
                    stroke: 'blue'
                }
            }, {
                attr: {}
            }, {}]).getAttributes(), {fill: 'red', stroke: 'blue'})
        })

        it('should init attributes if node is valid', () => {
            addObjects()
            assert.deepEqual(TransitionCollection([{
                attr: {
                    title: 'Original'
                }
            }, {
                attr: {
                    stroke: 'blue'
                }
            }]).getAttributes(d3.select('#obj-1')), {
                title: 'First object',
                stroke: null
            })
        })
    })

    describe('.getStyles()', () => {
        it('should return empty object for empty entries', () => {
            assert.deepEqual(TransitionCollection([]).getStyle(), {})
        })

        it('should return attributes from a set of entries', () => {
            assert.deepEqual(TransitionCollection([{
                style: {
                    fill: 'red'
                }
            }, {
                style: {
                    stroke: 'blue'
                }
            }, {
                style: {}
            }, {}]).getStyle(), {fill: 'red', stroke: 'blue'})
        })

        it('should init style if node is valid', () => {
            addObjects()
            assert.deepEqual(TransitionCollection([{
                style: {
                    'background-color': 'red'
                }
            }, {
                style: {
                    stroke: 'blue'
                }
            }]).getStyle(d3.select('#obj-1')), {
                'background-color': 'orange',
                stroke: null
            })
        })
    })

    describe('.getMaxDelay()', () => {
        it('should return 0 if transition collection is empty', () => {
            assert.equal(TransitionCollection([]).getMaxDelay(), 0)
        })

        it('should return 0 if delays are invalid', () => {
            assert.equal(TransitionCollection([{}]).getMaxDelay(), 0)
        })

        it('should return the max delay', () => {
            assert.equal(TransitionCollection([{},  {delay: 0}, {delay: 1}]).getMaxDelay(), 1)
        })
    })

    describe('.getMaxDuration()', () => {
        it('should return 0 if transition collection is empty', () => {
            assert.equal(TransitionCollection([]).getMaxDuration(), 0)
        })

        it('should return 0 if durations are invalid', () => {
            assert.equal(TransitionCollection([{}]).getMaxDuration(), 0)
        })

        it('should return the max duration', () => {
            assert.equal(TransitionCollection([{},  {duration: 0}, {duration: 1}]).getMaxDuration(), 1)
        })
    })
})
