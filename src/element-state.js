import { TRANSITION_TYPES } from './transition'
import Style from './style'
import Attributes from './attributes'

/**
 * Factory representing the state of a DOM element.
 *
 * @function ElementState
 * @param state
 */
export default function ElementState (state) {
    // Private members.
    const _ = {
        visible: state.visible || false,
        duration: state.duration || 0,
        delay: state.delay || 0,
        style: Style(state.style || {}),
        attr: Attributes(state.attr || {})
    }

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the element state.
     *
     * @method toString
     * @memberOf ElementState
     * @return {string} String representation of the element state.
     */
    /* test-code */
    api.toString = () => {
        const entries = []

        if (_.attr.size() > 0) {
            entries.push(`attr: ${_.attr.toString()}`)
        }

        if (_.delay > 0) {
            entries.push(`delay: ${_.delay}`)
        }

        if (_.duration > 0) {
            entries.push(`duration: ${_.duration}`)
        }

        if (_.style.size() > 0) {
            entries.push(`style: ${_.style.toString()}`)
        }

        if (_.visible) {
            entries.push(`visible`)
        }

        return `ElementState{${entries.join(', ')}}`
    }
    /* end-test-code */

    api.isVisible = () => _.visible

    /*
    api.getDuration = () => _.duration

    api.getDelay = () => _.delay

    api.getStyle = () => _.style

    api.getAttributes = () => _.attr

    api.getVisible = () => _.visible
     */

    api.getTransitionType = newState => {
        if (!_.visible && newState.isVisible()) {
            return TRANSITION_TYPES.enter
        }

        if (_.visible && !newState.isVisible()) {
            return TRANSITION_TYPES.exit
        }

        if (_.visible && newState.isVisible()) {
            return TRANSITION_TYPES.update
        }
    }

    return api
}
