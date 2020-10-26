import { assert } from 'chai'
import { JSDOM } from 'jsdom'
import { describe, it, beforeEach } from 'mocha'
import SceneObject from '../src/scene-object'
import * as d3 from 'd3'

const FRAMES = [{
    id: 1,
    update: [{
        selector: ['#obj-1'],
        duration: 10,
        style: {
            color: 'red'
        }
    }]
}, {
    id: 2,
    exit: [{
        selector: ['.foo'],
        delay: 10,
        style: {
            'background-color': 'blue'
        }
    }]
}, {
    id: 3,
    enter: [{
        selector: ['.bar'],
        attr: {
            title: 'Changed'
        }
    }]
}, {
    id: 4,
    enter: [{
        selector: ['#obj-2']
    }]
}]

function addObjects () {
    [{
        classList: ['foo', 'bar']
    }].forEach((d, i) => {
        const el = document.createElement('div')
        el.id = 'obj-' + (i + 1)
        el.classList.add('obj', ...d.classList)
        el.style.backgroundColor = 'orange'
        el.title = 'First object'
        document.body.appendChild(el)
    })
}

beforeEach(() => {
    // Create DOM.
    const dom = new JSDOM('<html><body></body></html>')
    global.window = dom.window
    global.document = dom.window.document
})

describe('SceneObject', () => {
    describe('.collectProperties()', () => {
        it('should collect properties from frames', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
        })
    })

    describe('.computeAttributeDiff()', () => {
        it('should return difference between two attributes', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.computeAttributeDiff({
                title: 'Changed title',
                lang: 'en',
                translate: true
            }, {
                title: 'Changed title',
                lang: 'de',
                spellcheck: true
            }), {
                // Same attribute but different from object's current attributes.
                title: 'Changed title',

                // Differing attributes.
                lang: 'de'
            })
        })
    })

    describe('.computeStyleDiff()', () => {
        it('should return difference between two styles', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.computeStyleDiff({
                'background-color': 'red',
                color: 'black',
                margin: 0
            }, {
                'background-color': 'red',
                color: 'blue',
                padding: 0
            }), {
                // Same style but different from object's current style.
                'background-color': 'red',

                // Differing style.
                color: 'blue'
            })
        })
    })

    describe('.determineTransition()', () => {
        it('should return undefined if object is not present', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert(
                typeof obj.__test__.determineTransition(false, false) === 'undefined'
            )
        })

        it('should return enter if object enters', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(
                obj.__test__.determineTransition(false, true),
                obj.__test__.TRANSITION_TYPES.enter
            )
        })

        it('should return exit if object exits', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(
                obj.__test__.determineTransition(true, false),
                obj.__test__.TRANSITION_TYPES.exit
            )
        })

        it('should return update if object updates', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(
                obj.__test__.determineTransition(true, true),
                obj.__test__.TRANSITION_TYPES.update
            )
        })
    })

    describe('.includes()', () => {
        it('should not find object if not present', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.includes(['#obj-2', '.a', '.b']), false)
        })

        it('should find object by id', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.includes(['#obj-1', '.a', '.b']), true)
        })

        it('should find object by class', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.includes(['#obj-2', '.obj', '.b']), true)
            assert.equal(obj.__test__.includes(['#obj-2', '.foo', '.b']), true)
        })
    })

    describe('.getTransitions()', () => {
        it('should return a flat list of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getTransitions([
                {},
                {update: [1, 2, 3]},
                {enter: ['a', 'b', 'c']},
                {exit: ['x', 'y', 'z']}
            ]), [1, 2, 3, 'a', 'b', 'c', 'x', 'y', 'z'])
        })
    })

    describe('.initProperties()', () => {
        it('should initialize style correctly', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.initProperties({
                'background-color': null, 'z-index': null
            }, 'style'), {
                'background-color': 'orange', 'z-index': null
            })
        })

        it('should initialize attributes correctly', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.initProperties({
                title: null, lang: null}, 'attr'
            ), {
                title: 'First object', lang: null
            })
        })
    })

    describe('.getAttributes()', () => {
        it('should return attributes from a set of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getAttributes([{
                attr: {
                    fill: 'red'
                }
            }, {
                attr: {
                    stroke: 'blue'
                }
            }, {
                attr: {}
            }, {}]), {fill: 'red', stroke: 'blue'})
        })
    })

    describe('.getEnters()', () => {
        it('should return empty list for no enters', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getEnters({}), [])
        })

        it('should return array of relevant enter entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getEnters({
                enter: [{
                    selector: ['#obj-1', '#foo'],
                    style: 1,
                    attr: 2
                }, {
                    selector: ['#obj-2']
                }]
            }), [{
                selector: ['#obj-1', '#foo'],
                style: 1,
                attr: 2
            }])
        })
    })

    describe('.getExits()', () => {
        it('should return empty list for no exits', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getExits({}), [])
        })

        it('should return array of relevant exit entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getExits({
                exit: [{
                    selector: ['#obj-1', '#foo'],
                    style: 1,
                    attr: 2
                }, {
                    selector: ['#obj-2']
                }]
            }), [{
                selector: ['#obj-1', '#foo'],
                style: 1,
                attr: 2
            }])
        })
    })

    describe('.getMaxDelay()', () => {
        it('should return 0 for an empty array of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.getMaxDelay([]), 0)
            assert.equal(obj.__test__.getMaxDelay(), 0)
        })

        it('should return the maximum delay from a set of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.getMaxDelay([{
                delay: 0
            }, {
                delay: 1000
            }, {
                delay: null
            }, {}]), 1000)
        })
    })

    describe('.getMaxDuration()', () => {
        it('should return 0 for an empty array of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.getMaxDuration([]), 0)
            assert.equal(obj.__test__.getMaxDuration(), 0)
        })

        it('should return the maximum duration from a set of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.equal(obj.__test__.getMaxDuration([{
                duration: 0
            }, {
                duration: 1000
            }, {
                duration: null
            }, {}]), 1000)
        })
    })

    describe('.getRelevantEntries()', () => {
        it('should return empty object for no relevant entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getRelevantEntries({}), {})
            assert.deepEqual(obj.__test__.getRelevantEntries({
                enter: [{
                    selector: ['#foo']
                }],
                update: [{
                    selector: ['#obj-2']
                }],
                exit: [{
                    selector: ['#bar']
                }]
            }), {})
        })

        it('should return exit if object is exiting', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getRelevantEntries({
                enter: [{
                    selector: ['#foo']
                }],
                update: [{
                    selector: ['#obj-2']
                }],
                exit: [{
                    selector: ['#obj-1']
                }]
            }), {
                entries: [{
                    selector: ['#obj-1']
                }],
                type: obj.__test__.TRANSITION_TYPES.exit
            })
        })

        it('should return update if object is updating', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getRelevantEntries({
                enter: [{
                    selector: ['#obj-2']
                }],
                update: [{
                    selector: ['#obj-1']
                }],
                exit: [{
                    selector: ['#obj-1']
                }]
            }), {
                entries: [{
                    selector: ['#obj-1']
                }],
                type: obj.__test__.TRANSITION_TYPES.update
            })
        })

        it('should return enter if object is entering', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getRelevantEntries({
                enter: [{
                    selector: ['#obj-1']
                }],
                update: [{
                    selector: ['#obj-1']
                }],
                exit: [{
                    selector: ['#obj-1']
                }]
            }), {
                entries: [{
                    selector: ['#obj-1']
                }],
                type: obj.__test__.TRANSITION_TYPES.enter
            })
        })
    })

    describe('.getStyle()', () => {
        it('should return attributes from a set of entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getStyle([{
                style: {
                    fill: 'red'
                }
            }, {
                style: {
                    stroke: 'blue'
                }
            }, {
                style: {}
            }, {}]), {fill: 'red', stroke: 'blue'})
        })
    })

    describe('.getUpdates()', () => {
        it('should return empty list for no updates', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getUpdates({}), [])
        })

        it('should return array of relevant update entries', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.__test__.getUpdates({
                update: [{
                    selector: ['#obj-1', '#foo'],
                    style: 1,
                    attr: 2
                }, {
                    selector: ['#obj-2']
                }]
            }), [{
                selector: ['#obj-1', '#foo'],
                style: 1,
                attr: 2
            }])
        })
    })

    describe('.setStyle()', () => {
        it('should return a selection', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            const t = d3.select('#obj-1')
            assert.deepEqual(obj.__test__.setStyle(t, {
                'background-color': 'pink'
            }), t)
        })

        it('should change style', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            const t = d3.select('#obj-1')
            obj.__test__.setStyle(t, {
                'background-color': 'pink'
            })
            assert.equal(t.style('background-color'), 'pink')
        })
    })

    describe('.setAttributes()', () => {
        it('should return a selection', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            const t = d3.select('#obj-1')
            assert.deepEqual(obj.__test__.setAttributes(t, {
                'background-color': 'pink'
            }), t)
        })

        it('should change attributes', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            const t = d3.select('#obj-1')
            obj.__test__.setAttributes(t, {
                lang: 'en'
            })
            assert.equal(t.attr('lang'), 'en')
        })
    })

    describe('.init()', () => {
        it ('should return the SceneObject API', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            assert.deepEqual(obj.init([]), obj)
        })

        it('should initialize scene object', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            assert.deepEqual(obj.__test__._.states.map(d => d.GET()), [{
                id: 0,
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'orange', color: null},
                attr: {title: 'First object'}
            }, {
                id: 1,
                visible: true,
                duration: 10,
                delay: 0,
                style: {'background-color': 'orange', color: 'red'},
                attr: {title: 'First object'}
            }, {
                id: 2,
                visible: false,
                duration: 0,
                delay: 10,
                style: {'background-color': 'blue', color: 'red'},
                attr: {title: 'First object'}
            }, {
                id: 3,
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'blue', color: 'red'},
                attr: {title: 'Changed'}
            }, {
                id: 4,
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'blue', color: 'red'},
                attr: {title: 'Changed'}
            }])
        })
    })

    describe('.toFrame()', () => {
        it('should return the SceneObject API', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            assert.deepEqual(obj.toFrame(0, 1), obj)
        })

        it(`should update the object's style`, () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            obj.toFrame(0, 1)
            assert.deepEqual(obj.__test__._.states[1].GET().style, {
                color: 'red',
                'background-color': 'orange'
            })
        })

        it('should exit the object', done => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            obj.toFrame(0, 2)

            // Not removed immediately.
            assert.equal(document.getElementById('obj-1').style.display, '')

            // Removed after transition ended.
            setTimeout(() => {
                assert.equal(document.getElementById('obj-1').style.display, 'none')
                done()
            }, 20)
        })

        it('should enter the object', done => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            obj.toFrame(0, 2)
            setTimeout(() => {
                obj.toFrame(2, 3)
                assert.equal(document.getElementById('obj-1').style.display, '')
                done()
            }, 15)
        })
    })
})
