import { select } from 'd3'
import extractSelectors from './utils/extract-selectors'
import FrameCollection from './frame-collection'
import { TRANSITION_TYPES } from './transition'
import State from './state'

export default function SceneObject (node) {
    // Private members.
    const _ = {
        selection: select(node),
        selectors: new Set(extractSelectors(node)),
        states: []
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        _
    }
    /* end-test-code */

    api.init = frames => {
        // Build frame collection and read all transitions.
        const frameCollection = FrameCollection(frames)
        const transitions = frameCollection.getTransitions()

        // Initialize state.
        let visible = _.selection.style('display') !== 'none'
        const currentStyle = transitions.getStyle(_.selection)
        const currentAttr = transitions.getAttributes(_.selection)
        _.states.push(State({
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
                _.states.push(State({
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

    return api
}
