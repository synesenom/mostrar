import Attributes from "./attributes";
import Style from "./style";

/**
 * Transition types. These define the possible changes in the scene.
 */
export const TRANSITION_TYPES = {
    // Entering objects: display:none -> display:null.
    enter: 'enter',

    // Updating objects: attribute or style changes.
    update: 'update',

    // Exiting objects: display:<any> => display:none.
    exit: 'exit'
}

/**
 * Factory representing a single transition for a set of selectors.
 *
 * @function Transition
 * @param {Object} options Object describing the transition options.
 */
export function Transition (options = {}) {
    // Private members.
    const _ = {
        attr: Attributes(options.attr || {}),
        style: Style(options.style || {}),
        delay: options.delay || 0,
        duration: options.duration || 0,
        selectors: options.selectors || []
    }

    // Public methods.
    const api = {}

    /* test-code */
    api.toString = () => {
        let entries = []

        if (_.attr.size() > 0) {
            entries.push(`attr: ${_.attr.toString()}`)
        }

        if (_.delay > 0) {
            entries.push(`delay: ${_.delay}`)
        }

        if (_.duration > 0) {
            entries.push(`duration: ${_.duration}`)
        }

        if (_.selectors.length > 0) {
            entries.push(`selectors: [${_.selectors.sort().join(', ')}]`)
        }

        if (_.style.size() > 0) {
            entries.push(`style: ${_.style.toString()}`)
        }

        return `Transition{${entries.join(', ')}}`
    }
    /* end-test-code */

    // TODO Remove this.
    //api.GET = () => options

    /**
     * Checks if any of a set of selectors are included among the transition's selectors.
     *
     * @method includes
     * @memberOf Transition
     * @param {string[]} selectors Array of strings representing the selectors.
     * @return {boolean} True if there is an overlap with the selectors, false otherwise.
     */
    api.includes = (selectors = []) => {
        return selectors.filter(d => _.selectors.indexOf(d) > -1).length > 0
    }

    api.getAttributes = () => _.attr

    api.getStyle = () => _.style

    /*
    api.getDelay = () => _.delay

    api.getDuration = () => _.duration
     */

    return api
}
