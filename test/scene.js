import { readFileSync } from 'fs'
import { assert } from 'chai'
import { JSDOM } from 'jsdom'
import { describe, it, beforeEach } from 'mocha'
import SceneObject from '../src/scene-object'
import Scene from '../src/scene'
import * as d3 from 'd3'

/*
const FRAMES = [{
    id: 1,
    update: [{
        selector: ['.mo'],
        style: {
            color: 'rgb(255, 0, 0)'
        },
        attr: {
            title: 'Frame 1'
        }
    }]
}, {
    id: 2,
    exit: [{
        selector: ['.foo'],
        style: {
            color: 'rgb(255, 255, 0)'
        },
        attr: {
            title: 'Exited'
        }
    }]
}, {
    id: 3,
    enter: [{
        selector: ['.bar'],
        style: {
            color: 'rgb(0, 255, 0)'
        },
        attr: {
            title: 'Entered'
        }
    }]
}]
 */
const FRAMES = './test/test_data/test_scene.yml'

function addObjects () {
    [{
        classList: ['foo'],
        style: {
            color: 'rgb(0, 0, 0)'
        },
        attr: {
            title: 'First object'
        }
    }, {
        classList: ['bar'],
        style: {
            'background-color': 'orange',
            display: 'none'
        },
        attr: {
            title: 'Second object'
        }
    }].forEach((d, i) => {
        const el = d3.select('body').append('div')
            .attr('id', 'mo-' + (i + 1))
            .attr('class', 'mo ' + d.classList.join(' '))

        for (const key in d.style) {
            if (d.style.hasOwnProperty(key)) {
                el.style(key, d.style[key])
            }
        }

        for (const key in d.attr) {
            if (d.attr.hasOwnProperty(key)) {
                el.attr(key, d.attr[key])
            }
        }
    })
}

function assert_frame_0 (scene) {
    return new Promise(resolve => {
        setTimeout(() => {
            assert.equal(scene.__test__._.current, 0)
            const obj1 = document.getElementById('mo-1')
            assert.deepEqual(obj1.tagName, 'DIV')
            assert.deepEqual(obj1.style.display, '')
            assert.deepEqual(obj1.style.color, 'rgb(0, 0, 0)')
            assert.deepEqual(obj1.title, 'First object')
            const obj2 = document.getElementById('mo-2')
            assert.deepEqual(obj2.tagName, 'DIV')
            assert.deepEqual(obj2.style.display, 'none')
            assert.deepEqual(obj2.style.color, '')
            assert.deepEqual(obj2.style.backgroundColor, 'orange')
            assert.deepEqual(obj2.title, 'Second object')
            resolve()
        }, 20)
    })
}

function assert_frame_1 (scene) {
    return new Promise(resolve => {
        setTimeout(() => {
            assert.equal(scene.__test__._.current, 1)
            const obj1 = document.getElementById('mo-1')
            assert.deepEqual(obj1.style.display, '')
            assert.deepEqual(obj1.style.color, 'rgb(255, 0, 0)')
            assert.deepEqual(obj1.title, 'Frame 1')
            const obj2 = document.getElementById('mo-2')
            assert.deepEqual(obj2.style.display, 'none')
            assert.deepEqual(obj2.style.color, 'rgb(255, 0, 0)')
            assert.deepEqual(obj2.style.backgroundColor, 'orange')
            assert.deepEqual(obj2.title, 'Frame 1')
            resolve()
        }, 20)
    })
}

function assert_frame_2 (scene) {
    return new Promise(resolve => {
        setTimeout(() => {
            assert.equal(scene.__test__._.current, 2)
            const obj1 = document.getElementById('mo-1')
            assert.deepEqual(obj1.style.display, 'none')
            assert.deepEqual(obj1.style.color, 'rgb(255, 255, 0)')
            assert.deepEqual(obj1.title, 'Exited')
            const obj2 = document.getElementById('mo-2')
            assert.deepEqual(obj2.style.display, 'none')
            assert.deepEqual(obj2.style.color, 'rgb(255, 0, 0)')
            assert.deepEqual(obj2.style.backgroundColor, 'orange')
            assert.deepEqual(obj2.title, 'Frame 1')
            resolve()
        }, 20)
    })
}

function assert_frame_3 (scene) {
    return new Promise(resolve => {
        setTimeout(() => {
            assert.equal(scene.__test__._.current, 3)
            const obj1 = document.getElementById('mo-1')
            assert.deepEqual(obj1.style.display, 'none')
            assert.deepEqual(obj1.style.color, 'rgb(255, 255, 0)')
            assert.deepEqual(obj1.title, 'Exited')
            const obj2 = document.getElementById('mo-2')
            assert.deepEqual(obj2.style.display, '')
            assert.deepEqual(obj2.style.color, 'rgb(0, 255, 0)')
            assert.deepEqual(obj2.style.backgroundColor, 'orange')
            assert.deepEqual(obj2.title, 'Entered')
            resolve()
        }, 20)
    })
}

beforeEach(() => {
    // Create DOM.
    const dom = new JSDOM('<html><body></body></html>')
    global.window = dom.window
    global.document = dom.window.document

    // Mock fetch method that just reads a local file.
    global.fetch = function (url) {
        return new Promise(resolve => {
            resolve({
                ok: true,
                text () {
                    readFileSync(url, {encoding: 'utf8'})
                }
            })
        })
    }
})

describe('Scene', () => {
    describe('.init()', () => {
        it('should build scene', async () => {
            addObjects()

            // Build objects separate.
            const objects = [
                SceneObject(document.getElementById('mo-1')).init(FRAMES),
                SceneObject(document.getElementById('mo-2')).init(FRAMES)
            ]

            // Build scene.
            const scene = await Scene('body')
                .init(FRAMES)

            assert.deepEqual(scene.__test__._.current, 0)
            assert.deepEqual(
                scene.__test__._.objects.map(obj => obj.__test__._.states.map(d => d.__test__.toString())),
                objects.map(obj => obj.__test__._.states.map(d => d.__test__.toString()))
            )
            return assert_frame_0(scene)
        })
    })

    describe('.jumpTo()', () => {
        it('should do nothing if jumping to the same frame', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_0(scene
                .jumpTo(0))
        })

        it('should do nothing if frame is below 0', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_0(scene
                .jumpTo(-1))
        })

        it('should do nothing if frame is above max', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_0(scene
                .jumpTo(4))
        })

        it('should jump to frame', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_3(scene
                .jumpTo(3))
        })
    })

    describe('.forward()', () => {
        it('should not do anything if on last frame', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_3(scene
                .jumpTo(3)
                .forward())
        })

        it('should advance to next frame', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_1(scene.forward())
        })
    })

    describe('.backward()', () => {
        it('should not do anything if on first frame', async () => {
            addObjects()
            return assert_frame_0(Scene('body')
                .init(FRAMES)
                .backward())
        })

        it('should go back to previous frame', async () => {
            addObjects()
            const scene = await Scene('body')
                .init(FRAMES)
            return assert_frame_2(scene
                .jumpTo(3)
                .backward()
            )
        })
    })

    describe('.controls()', () => {
        it('should bind forward controls', async () => {
            addObjects()
            const scene = await Scene('body')
                .controls({
                    forward: ['Space']
                })
                .init(FRAMES)

            document.body.dispatchEvent(new window.KeyboardEvent('keydown', {'code': 'Space'}))
            return assert_frame_1(scene)
        })

        it('should bind backward controls', async () => {
            addObjects()
            const scene = await Scene('body')
                .controls({
                    backward: ['Space']
                })
                .init(FRAMES)
            scene.jumpTo(3)

            document.body.dispatchEvent(new window.KeyboardEvent('keydown', {'code': 'Space'}))
            return assert_frame_2(scene)
        })

        it('should bind bookmark controls and trigger it', async () => {
            addObjects()
            const scene = await Scene('body')
                .controls({
                    bookmarks: {
                        'Space': 2
                    }
                })
                .init(FRAMES)

            // Unknown key.
            document.body.dispatchEvent(new window.KeyboardEvent('keydown', {'code': 'ArrowLeft'}))
            await assert_frame_0(scene)

            // Trigger jump.
            document.body.dispatchEvent(new window.KeyboardEvent('keydown', {'code': 'Space'}))
            return assert_frame_2(scene)
        })
    })
})
