import jsyaml from 'js-yaml'
import FrameCollection from "./frame-collection";

// TODO Add callback option when frame is changed.
// TODO Instead of a single transition, add support to a sequence of style/attr transitions.
// TODO Lump transitions with same delay and duration together.
// TODO Add TOC by specifying slides with titles.
// TODO Convert transitions to async methods.
// TODO Implement save to PDF in browser.
export default function Scene (selector) {
    // Constants
    const CLASSES = {
        object: 'm'
    }

    // Private members.
    const _ = {
        frames: FrameCollection(),

        // Current frame.
        current: 0,

        // Create scene objects.
        objects: []
    }

    /*
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
     */

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the scene.
     *
     * @method toString
     * @memberOf Scene
     * @return {string} String representation of the scene.
     */
    /* test-code */
    api.toString = () => {
        return 'Scene{'
            // TODO Add more when frames are added.
            + `frames: ${_.frames.toString()}, `
            + `current: ${_.current}, `
            // TODO Add more when objects are added.
            + `objects: []`
            + '}'
    }
    /* end-test-code */

    api.init = async transitions => {
        // Load transitions from the YAML file.
        const text = await fetch(transitions)
            .then(response => response.text())
        const frames = jsyaml.load(text)

        // Build frames.
        _.frames = FrameCollection(frames)
        //_.frames = FrameCollection(frames)
            // Map selectors to actions.
            /*.map(([name, frame]) => ({
                name,
                enter: parseTransitions(frame.enter),
                update: parseTransitions(frame.update),
                exit: parseTransitions(frame.exit)
            }))
             */
        return api
    }

    /*
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
     */

    return api
}
