import { assert } from 'chai'
import { JSDOM } from 'jsdom'
import { describe, it, beforeEach } from 'mocha'
import extractSelectors from '../src/utils/extract-selectors'
import compile from '../src/utils/compile'


beforeEach(() => {
    const dom = new JSDOM('<html><body></body></html>')
    global.window = dom.window
    global.document = dom.window.document
})


describe('utils', () => {
    describe('.compile()', () => {
        it('should replace tag name of nested elements', () => {
            // Add a custom tag.
            const el = document.createElement('custom-element')
            el.classList.add('foo')
            el.id = 'el'
            el.title = 'Title of el'
            el.textContent = 'Content of el'
            document.body.appendChild(el)

            const child = document.createElement('custom-element')
            child.classList.add('bar')
            child.id = 'child'
            child.title = 'Title of child'
            child.textContent = 'Content of child'
            el.appendChild(child)

            const grandchild = document.createElement('another-custom-element')
            grandchild.classList.add('baz')
            grandchild.id = 'grandchild'
            grandchild.title = 'Title of grandchild'
            grandchild.textContent = 'Content of grandchild'
            child.appendChild(grandchild)

            // Convert tags.
            compile('custom-element', 'div', ['foo-2', 'bar-2'], {
                display: 'none',
                opacity: 0
            })
            compile('another-custom-element', 'span')

            // Check if elements were replaced.
            const el2 = document.getElementById('el')
            assert.deepEqual([
                el2.tagName,
                el2.id,
                el2.classList.toString(),
                el2.title,
                el2.textContent,
                el2.style.display,
                el2.style.opacity
            ], [
                'DIV',
                el.id,
                'foo foo-2 bar-2',
                el.title,
                el.textContent,
                'none',
                '0'
            ])

            const child2 = document.getElementById('child')
            assert.deepEqual([
                child2.tagName,
                child2.id,
                child2.classList.toString(),
                child2.title,
                child2.textContent,
                child2.style.display,
                child2.style.opacity
            ], [
                'DIV',
                child.id,
                'bar foo-2 bar-2',
                child.title,
                child.textContent,
                'none',
                '0'
            ])

            const grandchild2 = document.getElementById('grandchild')
            assert.deepEqual([
                grandchild2.tagName,
                grandchild2.id,
                grandchild2.classList.toString(),
                grandchild2.title,
                grandchild2.textContent,
                grandchild2.style.display,
                grandchild2.style.opacity
            ], [
                'SPAN',
                grandchild2.id,
                grandchild.classList.toString(),
                grandchild2.title,
                grandchild2.textContent,
                '',
                ''
            ])
        })
    })

    describe('.extractSelectors()', () => {
        it('should extract all class selectors', () => {
            // Add div.
            const el = document.createElement('div')
            el.classList.add('foo', 'bar', 'bar')
            el.id = 'some-id'

            // Extract selectors.
            assert.deepEqual(extractSelectors(el), ['#some-id', '.bar', '.foo'])
        })
    })
})
