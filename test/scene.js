import { assert } from 'chai'
import { describe, it } from 'mocha'
import Scene from '../src/scene'
import { FRAMES_PATH, addObjects } from './test-utils';
import jsyaml from 'js-yaml';


const FRAMES = './test/test_data/test_scene.yml'

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

describe('Scene', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            assert.equal(Scene().toString(), 'Scene{frames: FrameCollection[], current: 0, objects: []}')
        })
    })

    describe('.init()', () => {
        it('should build scene', async () => {
            addObjects()
            const scene = await Scene().init(FRAMES_PATH)
            assert.equal(scene.toString(),'Scene{frames: FrameCollection[Frame{index: 0, name: "first", update: TransitionCollection[Transition{duration: 10, selector: [#obj-1], style: Style{color: "rgb(255, 0, 0)"}}]}, Frame{index: 1, exit: TransitionCollection[Transition{delay: 10, selector: [.foo], style: Style{background-color: "rgb(0, 0, 255)"}}, Transition{delay: 20, selector: [.bar], style: Style{color: "rgb(0, 0, 255)"}}]}, Frame{index: 2, enter: TransitionCollection[Transition{attr: Attributes{title: "Changed"}, selector: [.el], style: Style{color: "rgb(0, 255, 0)"}}]}, Frame{index: 3, name: "fourth", enter: TransitionCollection[Transition{selector: [#obj-2]}]}], current: 0, objects: []}')
        })
    })

    return
    describe('.init()', () => {
        it('should build scene', async () => {
            addObjects()

            // Build objects separate.
            /*const objects = [
                SceneObject(document.getElementById('mo-1')).init(frames),
                SceneObject(document.getElementById('mo-2')).init(frames)
            ]*/

            // Build scene.
            const scene = await Scene('body')
                .init(FRAMES)
            console.log(scene.__test__._.frames)

            assert.deepEqual(scene.__test__._.current, 0)
            assert.deepEqual(
                scene.__test__._.objects.map(obj => obj.__test__._.states.map(d => d.__test__.toString())),
                objects.map(obj => obj.__test__._.states.map(d => d.__test__.toString()))
            )
            return assert_frame_0(scene)
        })
    })
    return

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
