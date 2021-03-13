import {JSDOM} from "jsdom";
import { beforeEach } from 'mocha';
import {readFileSync} from "fs";

export const FRAMES_PATH = './test/test_data/test_scene.yml'

export const FRAMES = [{
    name: 'first',
    update: [{
        selector: ['#mo-1'],
        duration: 10,
        style: {
            color: 'rgb(255, 0, 0)'
        }
    }]
}, {
    exit: [{
        selector: ['.foo'],
        delay: 10,
        style: {
            'background-color': 'rgb(0, 0, 255)'
        }
    }]
}, {
    enter: [{
        selector: ['.el'],
        style: {
            color: 'rgb(0, 255, 0)'
        },
        attr: {
            title: 'Changed'
        }
    }]
}, {
    name: 'fourth',
    enter: [{
        selector: ['#obj-2']
    }]
}]

beforeEach(() => {
    // Create DOM.
    const dom = new JSDOM('<html lang="en"><body></body></html>')
    global['window'] = dom.window
    global['document'] = dom.window.document

    // Mock fetch method that just reads a local file.
    global.fetch = url => {
        return new Promise(resolve => {
            resolve({
                ok: true,
                text: () => readFileSync(url, {encoding: 'utf8'})
            })
        })
    }
})

export function addObjects () {
    [{
        classList: ['foo', 'el'],
        style: {
            color: 'rgb(0, 0, 0)',
            width: '100px'
        },
        attr: {
            lang: 'en',
            title: 'First object',
            href: 'www.example.com'
        }
    }, {
        classList: ['bar', 'el'],
        style: {
            'background-color': 'orange',
            display: 'none'
        },
        attr: {
            title: 'Second object'
        }
    }].forEach((d, i) => {
        const el = document.createElement('div')
        el.id = `obj-${i + 1}`
        el.classList.add(...['m'].concat(d.classList))

        for (const key in d.style) {
            if (d.style.hasOwnProperty(key)) {
                el.style.setProperty(key, d.style[key])
            }
        }

        for (const key in d.attr) {
            if (d.attr.hasOwnProperty(key)) {
                el.setAttribute(key, d.attr[key])
            }
        }

        document.body.appendChild(el)
    })
}
