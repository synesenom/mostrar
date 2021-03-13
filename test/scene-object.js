import { assert } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import ElementState from '../src/element-state'
import SceneObject from '../src/scene-object'
import { addObjects } from './test-utils';


describe('SceneObject', () => {
    describe('.toString()', () => {
        it('should return the string representation', () => {
            addObjects()
            assert.equal(SceneObject(document.getElementById('obj-1')).toString(), 'SceneObject{ tagName: div, selectors: { #obj-1, .el, .foo, .m }, states: [] }')
        })
    })

    return
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
            assert.deepEqual(obj.__test__._.states.map(d => d.__test__.toString()), [{
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'orange', color: null},
                attr: {title: 'First object'}
            }, {
                visible: true,
                duration: 10,
                delay: 0,
                style: {'background-color': 'orange', color: 'rgb(255, 0, 0)'},
                attr: {title: 'First object'}
            }, {
                visible: false,
                duration: 0,
                delay: 10,
                style: {'background-color': 'rgb(0, 0, 255)', color: 'rgb(255, 0, 0)'},
                attr: {title: 'First object'}
            }, {
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'rgb(0, 0, 255)', color: 'rgb(255, 0, 0)'},
                attr: {title: 'Changed'}
            }, {
                visible: true,
                duration: 0,
                delay: 0,
                style: {'background-color': 'rgb(0, 0, 255)', color: 'rgb(255, 0, 0)'},
                attr: {title: 'Changed'}
            }].map(d => ElementState(d).__test__.toString()))
        })
    })

    describe('.toFrame()', () => {
        it('should return the SceneObject API', () => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            assert.deepEqual(obj.toFrame(0, 1), obj)
        })

        it(`should update the object's style`, done => {
            addObjects()
            const obj = new SceneObject(document.getElementById('obj-1'))
            obj.init(FRAMES)
            obj.toFrame(0, 1)
            setTimeout(() => {
                assert.equal(document.getElementById('obj-1').style.color, 'rgb(255, 0, 0)')
                assert.equal(document.getElementById('obj-1').style.backgroundColor, 'orange')
                done()
            }, 30)
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
