import { select } from 'd3'
import SceneObject from './scene-object'

// TODO Add callback option when frame is changed.
// TODO Instead of a single transition, add support to a sequence of style/attr transitions.

// TODO Lump transitions with same delay and duration together.
export default function (selector) {
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

    const api = {}

    /* test-code */
    api.__test__ = {
        _
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
        _.frames = frames
        _.objects = select(selector).selectAll('.obj')
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
