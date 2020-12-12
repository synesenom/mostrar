import { select } from 'd3'
import compile from './utils/compile'
import SceneObject from './scene-object'

// TODO Add callback option when frame is changed.
// TODO Instead of a single transition, add support to a sequence of style/attr transitions.

// TODO Lump transitions with same delay and duration together.
export default function Scene (selector) {
    const TAGS = {
        object: {
            hidden: 'mo',
            visible: 'mo-v'
        }
    }

    const CLASSES = {
        object: 'mo'
    }

    let _ = {
        frames: [],

        // Current frame.
        current: 0,

        // Create scene objects.
        objects: []
    }

    function jump (frame) {
        _.objects.map(obj => obj.toFrame(_.current, frame))
        _.current = frame
    }

    function compileTags () {
        // Compile <mo> tags to hidden divs.
        compile(TAGS.object.hidden, 'div', [CLASSES.object], {
            display: 'none',
            opacity: 0
        })

        // Compile <mo-s> tags to shown divs.
        compile(TAGS.object.visible, 'div', [CLASSES.object])
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        _,
        compileTags
    }
    /* end-test-code */

    api.forward = () => {
        if (_.frames.length > _.current) {
            jump(_.current + 1)
        }
        return api
    }

    api.backward = () => {
        if (_.current > 0) {
            jump(_.current - 1)
        }
        return api
    }

    api.jumpTo = frame => {
        if (frame !== _.current && frame >= 0 && frame <= _.frames.length) {
            jump(frame)
        }
        return api
    }

    api.init = frames => {
        // Add indices to frames.
        _.frames = frames.map((d, index) => Object.assign(d, {
            index
        }))

        // Compile HTML.
        compileTags()

        // Build scene.
        _.objects = select(selector).selectAll('.mo')
            .nodes()
            .map(d => SceneObject(d).init(_.frames))
        return api
    }

    api.controls = controls => {
        const forward = controls.forward || []
        const backward = controls.backward || []
        const bookmarks = controls.bookmarks || {}
        select('body').on('keydown.controls', event => {
            if (forward.indexOf(event.code) > -1) {
                api.forward()
                return
            }

            if (backward.indexOf(event.code) > -1) {
                api.backward()
            }

            for (const key in bookmarks) {
                if (event.code === key && bookmarks.hasOwnProperty(key)) {
                    api.jumpTo(bookmarks[key])
                }
            }
        })
        return api
    }

    return api
}
