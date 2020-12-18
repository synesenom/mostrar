import { event, select, selectAll, text } from 'd3'
import jsyaml from 'js-yaml'
import SceneObject from './scene-object'

// TODO Add callback option when frame is changed.
// TODO Instead of a single transition, add support to a sequence of style/attr transitions.

// TODO Lump transitions with same delay and duration together.
export default function Scene (selector) {
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

    // TODO Move this to transition.
    function parseTransitions (transitionCollection) {
        return Object.entries(transitionCollection || [])
            .map(([selector, details]) => Object.assign(details, {
                selector: selector.split(' ')
            }))
    }

    function jump (frame) {
        _.objects.forEach(obj => obj.toFrame(_.current, frame))
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

    api.init = async path => {
        // Load frames from YAML file and add indices.
        const frames = jsyaml.load(await text(path))

        // TODO Move this to Frame.
        _.frames = Object.entries(frames)
            // Map selectors to actions.
            .map(([name, frame]) => ({
                name,
                enter: parseTransitions(frame.enter),
                update: parseTransitions(frame.update),
                exit: parseTransitions(frame.exit)
            }))

            // Sort frames.
            .sort((a, b) => a.name.localeCompare(b.name))

            // Add index.
            .map((d, index) => Object.assign(d, {
                index
            }))

        // Build scene.
        _.objects = select(selector).selectAll('.' + CLASSES.object)
            .nodes()
            .map(d => SceneObject(d).init(_.frames))
        return api
    }

    api.controls = controls => {
        const forward = controls.forward || []
        const backward = controls.backward || []
        const bookmarks = controls.bookmarks || {}
        select('body').on('keydown.controls', () => {
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
