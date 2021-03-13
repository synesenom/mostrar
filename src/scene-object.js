import { select } from 'd3-selection'
import extractSelectors from './utils/extract-selectors'
import FrameCollection from './frame-collection'
import { TRANSITION_TYPES } from './transition'
import ElementState from './element-state'

/**
 * Factory representing a scene object. A scene object is a single HTML element along with its state history and transitions.
 *
 * @function SceneObject
 * @param {HTMLElement} node HTML element to animate.
 */
export default function SceneObject (node) {
    // Private members.
    const _ = {
        // D3-selection of the element.
        selection: select(node),

        // Selectors that this scene object should be selected by.
        selectors: new Set(extractSelectors(node)),

        // History of its states.
        states: []
    }

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the scene object.
     *
     * @method toString
     * @memberOf SceneObject
     * @return {string} String representation of the scene object.
     */
    api.toString = () => {
        return 'SceneObject{ '
            + `tagName: ${node.tagName.toLowerCase()}, `
            + `selectors: { ${[..._.selectors].sort().join(', ')} }, `
            + 'states: []'
            // TODO Add this when it is not empty.
            // + 'states: ' + (_.states.length === 0 ? '[]' : `[ ${_.states.map(d => d.toString()).join(', ')} ]`)
            + ' }'
    }

    /*
    api.init = frames => {
        // Build frame collection and read all transitions.
        const frameCollection = FrameCollection(frames)
        const transitions = frameCollection.getTransitions()

        // Initialize state.
        let visible = _.selection.style('display') !== 'none'
        const currentStyle = transitions.getStyle(_.selection)
        const currentAttr = transitions.getAttributes(_.selection)
        _.states.push(ElementState({
            visible,
            duration: 0,
            delay: 0,
            style: currentStyle,
            attr: currentAttr
        }))

        // Build state history.
        frameCollection.getFrames()
            .forEach(frame => {
                const transitionCollection = frame.getRelevantEntries(_.selectors)

                if (typeof transitionCollection.getType() !== 'undefined') {
                    Object.assign(currentStyle, transitionCollection.getStyle())
                    Object.assign(currentAttr, transitionCollection.getAttributes())
                }

                switch (transitionCollection.getType()) {
                    case TRANSITION_TYPES.enter:
                        visible = true
                        break
                    case TRANSITION_TYPES.exit:
                        visible = false
                        break
                }

                // Add state for frame.
                _.states.push(ElementState({
                    visible,
                    duration: transitionCollection.getMaxDuration(),
                    delay: transitionCollection.getMaxDelay(),
                    style: currentStyle,
                    attr: currentAttr
                }))
            })

        return api
    }

    api.toFrame = (before, after) => {
        // Determine transition type (if any), duration and delay.
        const type = _.states[before].getTransitionType(_.states[after])
        const duration = _.states[after].getDuration() || _.states[before].getDuration()
        const delay = _.states[after].getDelay() || _.states[before].getDelay()

        switch (type) {
            case TRANSITION_TYPES.enter: {
                const t = _.states[before].getStyle()
                    .apply(_.selection)
                    .style('display', null)
                    .interrupt().transition()
                    .duration(duration)
                    .delay(delay)
                _.states[after].getStyle()
                    .apply(t)
                _.states[after].getAttributes()
                    .apply(t)
                break
            }

            default:
            case TRANSITION_TYPES.update: {
                const t = typeof type === 'undefined' ? _.selection
                    : _.selection.interrupt()
                        .transition()
                        .duration(duration)
                        .delay(delay)
                _.states[before].getStyle()
                    .diff(_.states[after].getStyle(), _.selection)
                    .apply(t)
                _.states[before].getAttributes()
                    .diff(_.states[after].getAttributes(), _.selection)
                    .apply(t)
                break
            }

            case TRANSITION_TYPES.exit: {
                const t = _.selection.interrupt()
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .on('end', () => _.selection.style('display', 'none'))
                _.states[after].getStyle()
                    .apply(t)
                _.states[after].getAttributes()
                    .apply(t)
                break
            }
        }

        return api
    }
     */

    return api
}
